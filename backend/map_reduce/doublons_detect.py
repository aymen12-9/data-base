from bson.code import Code

def execute_doublons_detect(collection):
    """Exécuter le MapReduce pour détecter les doublons (version moderne)"""
    
    # Pipeline d'aggregation pour détecter les doublons
    pipeline = [
        # Étape 1: Filtrer les documents avec nom et prénom
        {
            "$match": {
                "nom": {"$exists": True, "$ne": None},
                "prenom": {"$exists": True, "$ne": None}
            }
        },
        # Étape 2: Créer une clé unique nom+prenom (en minuscules)
        {
            "$addFields": {
                "cle_unique": {
                    "$concat": [
                        {"$toLower": "$nom"},
                        "_",
                        {"$toLower": "$prenom"}
                    ]
                }
            }
        },
        # Étape 3: Grouper par clé unique
        {
            "$group": {
                "_id": "$cle_unique",
                "ids": {"$push": "$_id"},
                "noms": {"$push": "$nom"},
                "prenoms": {"$push": "$prenom"},
                "adresses": {"$push": "$adresse"},
                "count": {"$sum": 1}
            }
        },
        # Étape 4: Filtrer seulement les doublons (count > 1)
        {
            "$match": {
                "count": {"$gt": 1}
            }
        },
        # Étape 5: Vérifier si les adresses sont différentes
        {
            "$addFields": {
                "adresses_differentes": {
                    "$reduce": {
                        "input": {"$slice": ["$adresses", 1, {"$size": "$adresses"}]},
                        "initialValue": False,
                        "in": {
                            "$or": [
                                "$$value",
                                {"$ne": [
                                    {"$ifNull": ["$$this", {}]},
                                    {"$arrayElemAt": ["$adresses", 0]}
                                ]}
                            ]
                        }
                    }
                }
            }
        },
        # Étape 6: Formater la sortie
        {
            "$project": {
                "_id": 1,
                "value": {
                    "ids": "$ids",
                    "noms": "$noms",
                    "prenoms": "$prenoms",
                    "adresses": "$adresses",
                    "count": "$count",
                    "adresses_differentes": "$adresses_differentes"
                }
            }
        }
    ]
    
    # Exécuter l'aggregation
    results = list(collection.aggregate(pipeline))
    
    return results