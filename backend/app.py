from flask import Flask, jsonify, request
from flask_cors import CORS
from mongo_utils import MongoDBClient
from map_reduce.ville_stats import execute_ville_stats
from map_reduce.doublons_detect import execute_doublons_detect
import os
from dotenv import load_dotenv
from bson import ObjectId
import logging
import datetime

load_dotenv()

# Configurer le logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration CORS très permissive pour tous les environnements
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Permettre toutes les origines
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False,
        "max_age": 86400
    }
})

# Middleware pour ajouter les headers CORS
@app.after_request
def after_request(response):
    """Ajouter les headers CORS à toutes les réponses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Max-Age', '86400')
    return response

# Gérer les requêtes OPTIONS (preflight)
@app.before_request
def handle_options_request():
    """Gérer les requêtes OPTIONS (preflight CORS)"""
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'preflight'})
        response.status_code = 200
        return response

# Initialiser le client MongoDB
try:
    mongo_client = MongoDBClient()
    mongo_client.connect()
    logger.info("✅ MongoDB connected successfully")
except Exception as e:
    logger.error(f"❌ MongoDB connection failed: {e}")
    mongo_client = None

@app.route('/')
def index():
    """Page d'accueil de l'API"""
    return jsonify({
        "message": "API MongoDB Employees Manager",
        "status": "active",
        "version": "1.0.0",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "endpoints": {
            "health": "/api/health",
            "employees": "/api/employees",
            "analytics": "/api/analytics/*",
            "collections": "/api/collections"
        },
        "cors": "enabled"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de santé"""
    status = "healthy" if mongo_client and mongo_client.client else "unhealthy"
    return jsonify({
        "status": status,
        "service": "MongoDB Employees API",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "mongo_connected": mongo_client is not None and mongo_client.client is not None
    })

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Endpoint de test simple"""
    return jsonify({
        "message": "Test endpoint working",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "method": request.method
    })

# Routes pour les requêtes MongoDB
@app.route('/api/collections', methods=['GET'])
def get_collections():
    """a. Afficher toutes les collections"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        collections = mongo_client.get_collections()
        return jsonify({
            "collections": collections,
            "count": len(collections)
        })
    except Exception as e:
        logger.error(f"Error in get_collections: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees', methods=['GET'])
def get_all_employees():
    """b. Afficher tous les documents"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        employees = mongo_client.get_all_documents()
        # Convertir ObjectId en string pour la sérialisation JSON
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "employees": employees,
            "count": len(employees),
            "timestamp": datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in get_all_employees: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/count', methods=['GET'])
def count_employees():
    """c. Compter le nombre de documents"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        count = mongo_client.count_documents()
        return jsonify({
            "count": count,
            "message": f"Total employees: {count}"
        })
    except Exception as e:
        logger.error(f"Error in count_employees: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees', methods=['POST'])
def add_employee():
    """d. Insérer un employé"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        required_fields = ['nom', 'prenom']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Nettoyer les données
        employee_data = {
            "nom": data.get('nom', '').strip(),
            "prenom": data.get('prenom', '').strip(),
            "anciennete": float(data.get('anciennete', 0)) if data.get('anciennete') else 0,
            "prime": float(data.get('prime', 0)) if data.get('prime') else 0,
            "adresse": data.get('adresse', {})
        }
        
        inserted_id = mongo_client.insert_employee(employee_data)
        return jsonify({
            "message": "Employee added successfully",
            "id": str(inserted_id),
            "employee": employee_data
        }), 201
    except Exception as e:
        logger.error(f"Error in add_employee: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Obtenir un employé spécifique"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        if not ObjectId.is_valid(employee_id):
            return jsonify({"error": "Invalid employee ID"}), 400
            
        employee = mongo_client.collection.find_one({"_id": ObjectId(employee_id)})
        if employee:
            employee['_id'] = str(employee['_id'])
            return jsonify(employee)
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        logger.error(f"Error in get_employee: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Mettre à jour un employé"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        if not ObjectId.is_valid(employee_id):
            return jsonify({"error": "Invalid employee ID"}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Nettoyer les données (enlever _id si présent)
        if '_id' in data:
            del data['_id']
        
        # Mettre à jour l'employé
        result = mongo_client.collection.update_one(
            {"_id": ObjectId(employee_id)},
            {"$set": data}
        )
        
        if result.matched_count > 0:
            return jsonify({
                "message": "Employee updated successfully",
                "matched_count": result.matched_count,
                "modified_count": result.modified_count,
                "employee_id": employee_id
            })
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        logger.error(f"Error in update_employee: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Supprimer un employé"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        if not ObjectId.is_valid(employee_id):
            return jsonify({"error": "Invalid employee ID"}), 400
            
        result = mongo_client.collection.delete_one({"_id": ObjectId(employee_id)})
        
        if result.deleted_count > 0:
            return jsonify({
                "message": "Employee deleted successfully",
                "deleted_count": result.deleted_count,
                "employee_id": employee_id
            })
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        logger.error(f"Error in delete_employee: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/name/<pattern>', methods=['GET'])
def find_by_name_pattern(pattern):
    """e. Prénom commence par pattern"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        position = request.args.get('position', 'start')
        employees = mongo_client.find_by_name_pattern(pattern, position)
        
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "pattern": pattern,
            "position": position,
            "employees": employees,
            "count": len(employees)
        })
    except Exception as e:
        logger.error(f"Error in find_by_name_pattern: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/name-length/<pattern>/<int:length>', methods=['GET'])
def find_by_name_length(pattern, length):
    """g. Prénom commence par pattern et a X caractères"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        employees = mongo_client.find_name_length(pattern, length)
        
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "pattern": pattern,
            "length": length,
            "employees": employees,
            "count": len(employees)
        })
    except Exception as e:
        logger.error(f"Error in find_by_name_length: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/seniority/<int:years>', methods=['GET'])
def find_by_seniority(years):
    """h. Ancienneté > years"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        employees = mongo_client.find_by_seniority(years)
        
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "years": years,
            "employees": employees,
            "count": len(employees)
        })
    except Exception as e:
        logger.error(f"Error in find_by_seniority: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/with-street', methods=['GET'])
def find_with_street():
    """i. Employés avec attribut rue"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        employees = mongo_client.find_with_street_address()
        
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "employees": employees,
            "count": len(employees)
        })
    except Exception as e:
        logger.error(f"Error in find_with_street: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/increment-prime', methods=['POST'])
def increment_prime():
    """j. Incrémenter la prime"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        data = request.get_json() or {}
        amount = data.get('amount', 200)
        
        modified = mongo_client.increment_prime(amount)
        return jsonify({
            "message": f"Prime incremented successfully",
            "amount": amount,
            "modified_count": modified
        })
    except Exception as e:
        logger.error(f"Error in increment_prime: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/oldest/<int:limit>', methods=['GET'])
def get_oldest_employees(limit=10):
    """k. Les X employés les plus anciens"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        employees = mongo_client.get_oldest_employees(limit)
        
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "limit": limit,
            "employees": employees,
            "count": len(employees)
        })
    except Exception as e:
        logger.error(f"Error in get_oldest_employees: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/city/<city>', methods=['GET'])
def group_by_city(city):
    """l. Regrouper par ville"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        result = mongo_client.group_by_city(city)
        
        # Convertir ObjectId en string
        for group in result:
            if '_id' in group:
                group['_id'] = str(group['_id'])
            for emp in group.get('employees', []):
                if '_id' in emp:
                    emp['_id'] = str(emp['_id'])
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in group_by_city: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/search', methods=['GET'])
def search_employees():
    """m. Recherche par prénom et ville"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        name_pattern = request.args.get('name', 'M')
        cities_param = request.args.get('cities', 'Bordeaux,Paris')
        cities = [city.strip() for city in cities_param.split(',') if city.strip()]
        
        employees = mongo_client.find_by_city_and_name(name_pattern, cities)
        
        for emp in employees:
            if '_id' in emp:
                emp['_id'] = str(emp['_id'])
        
        return jsonify({
            "name_pattern": name_pattern,
            "cities": cities,
            "employees": employees,
            "count": len(employees)
        })
    except Exception as e:
        logger.error(f"Error in search_employees: {e}")
        return jsonify({"error": str(e)}), 500

# Routes pour MapReduce
@app.route('/api/analytics/ville-stats', methods=['GET'])
def get_ville_stats():
    """1. Statistiques par ville avec MapReduce"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        collection = mongo_client.collection
        results = execute_ville_stats(collection)
        
        # Convertir ObjectId en string
        for result in results:
            if '_id' in result:
                result['_id'] = str(result['_id'])
        
        return jsonify({
            "stats": results,
            "count": len(results)
        })
    except Exception as e:
        logger.error(f"Error in get_ville_stats: {e}")
        return jsonify({"error": str(e), "results": []}), 500

@app.route('/api/analytics/doublons', methods=['GET'])
def get_doublons():
    """2. Détection de doublons avec MapReduce"""
    try:
        if not mongo_client:
            return jsonify({"error": "MongoDB not connected"}), 500
            
        collection = mongo_client.collection
        results = execute_doublons_detect(collection)
        
        # Convertir ObjectId en string
        for result in results:
            if '_id' in result:
                result['_id'] = str(result['_id'])
            if 'value' in result and 'ids' in result['value']:
                result['value']['ids'] = [str(id) for id in result['value']['ids']]
        
        return jsonify({
            "doublons": results,
            "count": len(results)
        })
    except Exception as e:
        logger.error(f"Error in get_doublons: {e}")
        return jsonify({"error": str(e), "results": []}), 500

# Gestion des erreurs 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "message": "The requested endpoint does not exist",
        "status": 404
    }), 404

# Gestion des erreurs 500
@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred",
        "status": 500
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True').lower() in ['true', '1', 'yes']
    
    logger.info(f"🚀 Starting MongoDB Employees API")
    logger.info(f"📡 Server: {host}:{port}")
    logger.info(f"🐞 Debug mode: {debug}")
    logger.info(f"🌍 CORS: Enabled for all origins")
    
    app.run(debug=debug, port=port, host=host, threaded=True)
