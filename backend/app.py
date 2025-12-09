from flask import Flask, jsonify, request
from flask_cors import CORS
from mongo_utils import MongoDBClient
from map_reduce.ville_stats import execute_ville_stats
from map_reduce.doublons_detect import execute_doublons_detect
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialiser le client MongoDB
mongo_client = MongoDBClient()
mongo_client.connect()

@app.route('/')
def index():
    return jsonify({"message": "API MongoDB Employees", "status": "active"})

# Routes pour les requêtes MongoDB
@app.route('/api/collections', methods=['GET'])
def get_collections():
    """a. Afficher toutes les collections"""
    collections = mongo_client.get_collections()
    return jsonify(collections)

@app.route('/api/employees', methods=['GET'])
def get_all_employees():
    """b. Afficher tous les documents"""
    employees = mongo_client.get_all_documents()
    # Convertir ObjectId en string pour la sérialisation JSON
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

@app.route('/api/employees/count', methods=['GET'])
def count_employees():
    """c. Compter le nombre de documents"""
    count = mongo_client.count_documents()
    return jsonify({"count": count})

@app.route('/api/employees', methods=['POST'])
def add_employee():
    """d. Insérer un employé"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['nom', 'prenom']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    inserted_id = mongo_client.insert_employee(data)
    return jsonify({"message": "Employee added", "id": str(inserted_id)}), 201

@app.route('/api/employees/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Obtenir un employé spécifique"""
    try:
        employee = mongo_client.collection.find_one({"_id": ObjectId(employee_id)})
        if employee:
            employee['_id'] = str(employee['_id'])
            return jsonify(employee)
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Mettre à jour un employé"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Nettoyer les données (enlever _id si présent)
        if '_id' in data:
            del data['_id']
        
        # Mettre à jour l'employé
        result = mongo_client.collection.update_one(
            {"_id": ObjectId(employee_id)},
            {"$set": data}
        )
        
        if result.matched_count > 0:
            if result.modified_count > 0:
                return jsonify({"message": "Employee updated successfully", "modified": True})
            else:
                return jsonify({"message": "No changes were made", "modified": False})
        else:
            return jsonify({"error": "Employee not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Supprimer un employé"""
    try:
        result = mongo_client.collection.delete_one(
            {"_id": ObjectId(employee_id)}
        )
        
        if result.deleted_count > 0:
            return jsonify({"message": "Employee deleted successfully", "deleted": True})
        else:
            return jsonify({"error": "Employee not found", "deleted": False}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/employees/name/<pattern>', methods=['GET'])
def find_by_name_pattern(pattern):
    """e. Prénom commence par pattern"""
    position = request.args.get('position', 'start')
    employees = mongo_client.find_by_name_pattern(pattern, position)
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

@app.route('/api/employees/name-length/<pattern>/<int:length>', methods=['GET'])
def find_by_name_length(pattern, length):
    """g. Prénom commence par pattern et a X caractères"""
    employees = mongo_client.find_name_length(pattern, length)
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

@app.route('/api/employees/seniority/<int:years>', methods=['GET'])
def find_by_seniority(years):
    """h. Ancienneté > years"""
    employees = mongo_client.find_by_seniority(years)
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

@app.route('/api/employees/with-street', methods=['GET'])
def find_with_street():
    """i. Employés avec attribut rue"""
    employees = mongo_client.find_with_street_address()
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

@app.route('/api/employees/increment-prime', methods=['POST'])
def increment_prime():
    """j. Incrémenter la prime"""
    data = request.json
    amount = data.get('amount', 200)
    modified = mongo_client.increment_prime(amount)
    return jsonify({"message": f"Prime incremented for {modified} employees"})

@app.route('/api/employees/oldest/<int:limit>', methods=['GET'])
def get_oldest_employees(limit=10):
    """k. Les X employés les plus anciens"""
    employees = mongo_client.get_oldest_employees(limit)
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

@app.route('/api/employees/city/<city>', methods=['GET'])
def group_by_city(city):
    """l. Regrouper par ville"""
    result = mongo_client.group_by_city(city)
    # Convertir ObjectId en string
    for group in result:
        for emp in group.get('employees', []):
            emp['_id'] = str(emp['_id'])
    return jsonify(result)

@app.route('/api/employees/search', methods=['GET'])
def search_employees():
    """m. Recherche par prénom et ville"""
    name_pattern = request.args.get('name', 'M')
    cities = request.args.get('cities', 'Bordeaux,Paris').split(',')
    employees = mongo_client.find_by_city_and_name(name_pattern, cities)
    for emp in employees:
        emp['_id'] = str(emp['_id'])
    return jsonify(employees)

# Routes pour MapReduce
@app.route('/api/analytics/ville-stats', methods=['GET'])
def get_ville_stats():
    """1. Statistiques par ville avec MapReduce"""
    collection = mongo_client.collection
    results = execute_ville_stats(collection)
    # Convertir ObjectId en string
    for result in results:
        result['_id'] = str(result['_id'])
        if 'value' in result:
            result['value']['_id'] = str(result['value'].get('_id', ''))
    return jsonify(results)

@app.route('/api/analytics/doublons', methods=['GET'])
def get_doublons():
    """2. Détection de doublons avec MapReduce"""
    collection = mongo_client.collection
    results = execute_doublons_detect(collection)
    # Convertir ObjectId en string
    for result in results:
        result['_id'] = str(result['_id'])
        if 'value' in result and 'ids' in result['value']:
            result['value']['ids'] = [str(id) for id in result['value']['ids']]
    return jsonify(results)

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=os.getenv('FLASK_DEBUG', True), port=port, host='0.0.0.0')