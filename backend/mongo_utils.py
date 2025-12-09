from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDBClient:
    def __init__(self):
        self.uri = os.getenv("MONGODB_URI")
        self.db_name = os.getenv("DATABASE_NAME")
        self.collection_name = os.getenv("COLLECTION_NAME")
        self.client = None
        self.db = None
        self.collection = None
        
    def connect(self):
        """Établir la connexion à MongoDB"""
        try:
            self.client = MongoClient(self.uri)
            self.db = self.client[self.db_name]
            self.collection = self.db[self.collection_name]
            print(f"Connected to MongoDB: {self.db_name}.{self.collection_name}")
            return True
        except Exception as e:
            print(f"Connection error: {e}")
            return False
    
    def get_collections(self):
        """Afficher toutes les collections de la base"""
        return list(self.db.list_collection_names())
    
    def get_all_documents(self):
        """Afficher tous les documents de la base"""
        return list(self.collection.find({}))
    
    def count_documents(self):
        """Compter le nombre de documents"""
        return self.collection.count_documents({})
    
    def insert_employee(self, employee_data):
        """Insérer un employé"""
        result = self.collection.insert_one(employee_data)
        return result.inserted_id
    
    def find_by_name_pattern(self, pattern, position="start"):
        """Trouver les employés par pattern de prénom"""
        if position == "start":
            regex_pattern = f"^{pattern}"
        elif position == "end":
            regex_pattern = f"{pattern}$"
        else:  # any position
            regex_pattern = f".*{pattern}.*"
        
        query = {"prenom": {"$regex": regex_pattern, "$options": "i"}}
        return list(self.collection.find(query))
    
    def find_name_length(self, pattern, length):
        """Trouver les prénoms avec pattern et longueur spécifique"""
        query = {
            "prenom": {
                "$regex": f"^{pattern}",
                "$options": "i",
                "$exists": True
            }
        }
        
        results = list(self.collection.find(query))
        # Filtrage supplémentaire pour la longueur
        filtered = [emp for emp in results if len(emp.get('prenom', '')) == length]
        return filtered
    
    def find_by_seniority(self, years):
        """Trouver les employés avec ancienneté > années"""
        return list(self.collection.find({"anciennete": {"$gt": years}}))
    
    def find_with_street_address(self):
        """Trouver les employés avec attribut rue dans l'adresse"""
        return list(self.collection.find({"adresse.rue": {"$exists": True}}))
    
    def increment_prime(self, amount):
        """Incrémenter la prime des employés"""
        result = self.collection.update_many(
            {"prime": {"$exists": True}},
            {"$inc": {"prime": amount}}
        )
        return result.modified_count
    
    def get_oldest_employees(self, limit=10):
        """Obtenir les employés les plus anciens"""
        return list(self.collection.find().sort("anciennete", -1).limit(limit))
    
    def group_by_city(self, city):
        """Regrouper par ville"""
        pipeline = [
            {"$match": {"adresse.ville": city}},
            {"$group": {
                "_id": "$adresse.ville",
                "count": {"$sum": 1},
                "employees": {"$push": "$$ROOT"}
            }}
        ]
        return list(self.collection.aggregate(pipeline))
    
    def find_by_city_and_name(self, name_pattern, cities):
        """Trouver par prénom et ville"""
        query = {
            "prenom": {"$regex": f"^{name_pattern}", "$options": "i"},
            "adresse.ville": {"$in": cities}
        }
        return list(self.collection.find(query))