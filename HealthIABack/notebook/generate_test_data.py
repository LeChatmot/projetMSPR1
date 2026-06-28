"""
Script de génération de données de test réalistes.
Génère des utilisateurs, des séances d'exercice et des pratiques.
"""

import os
import random
from datetime import date, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from config import (
    User, ExerciseSession, Practice,
    Gender, PhysicalActivityLevel
)

load_dotenv()

db_url = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)

engine  = create_engine(db_url, connect_args={"ssl": {}})
session = Session(engine)

# ============================================================
# VÉRIFICATION DU TYPE DE LA COLONNE id_exercice_sessions
# ============================================================

with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_NAME='exercice_sessions' AND COLUMN_NAME='id_exercice_sessions'"
    )).fetchone()
    col_type = result[0] if result else "unknown"
    print(f"ℹ️  Type de id_exercice_sessions en base : {col_type}")

USE_UUID = col_type.lower() in ("char", "varchar", "text")

# ============================================================
# CONFIG
# ============================================================

N_USERS = 200
MIN_PRACTICES = 5
MAX_PRACTICES = 20

OBJECTIFS = ["perte_de_poids", "prise_de_masse", "maintien", "endurance"]

OBJECTIF_WEIGHTS = {
    "perte_de_poids": {3: 0.25, 2: 0.20, 5: 0.15, 6: 0.15, 8: 0.10},
    "prise_de_masse": {4: 0.35, 9: 0.20, 2: 0.15, 8: 0.10},
    "maintien":       {1: 0.20, 3: 0.15, 5: 0.15, 10: 0.15},
    "endurance":      {5: 0.25, 3: 0.25, 6: 0.20, 2: 0.15},
}

PRENOMS_H = ["Lucas", "Thomas", "Hugo", "Antoine", "Maxime"]
PRENOMS_F = ["Emma", "Léa", "Chloé", "Camille", "Sarah"]
NOMS = ["Martin", "Bernard", "Dubois", "Thomas", "Robert"]

# ============================================================
# HELPERS
# ============================================================

def random_date_of_birth(min_age=18, max_age=60):
    today = date.today()
    age = random.randint(min_age, max_age)
    return today.replace(year=today.year - age) - timedelta(days=random.randint(0, 364))

def compute_bmi(weight, height):
    return round(weight / (height / 100) ** 2, 2)

def random_workout_ids(objectif, n):
    weights_dict = OBJECTIF_WEIGHTS.get(objectif, {i: 1 for i in range(1, 10)})
    ids = list(weights_dict.keys())
    weights = list(weights_dict.values())
    return random.choices(ids, weights=weights, k=n)

def random_session_stats(workout_id):
    base = {
        1: (145, 115, 280, 1.0),
        2: (195, 165, 520, 0.5),
        3: (175, 145, 420, 1.0),
        4: (165, 130, 380, 1.25),
        5: (180, 155, 500, 1.0),
    }.get(workout_id, (170, 140, 400, 1.0))

    max_bpm, avg_bpm, cal, duration = base

    return {
        "max_bpm": random.randint(max_bpm - 5, max_bpm + 5),
        "avg_bpm": random.randint(avg_bpm - 5, avg_bpm + 5),
        "resting_bpm": random.randint(50, 70),
        "calories_burned": int(cal * random.uniform(0.9, 1.1)),
        "session_duration_hours": round(duration * random.uniform(0.8, 1.2), 2),
    }

# ============================================================
# INSERTION MANUELLE (contourne l'ORM pour la PK)
# ============================================================

def insert_exercise_session(conn, ex_data):
    """
    Insère une ExerciseSession sans passer par l'ORM pour éviter
    le conflit UUID vs INT. Retourne l'ID généré par MySQL.
    La colonne 'gender' est un INT en base (FK vers genders).
    """
    sql = text("""
        INSERT INTO exercice_sessions
            (age, gender, weight_kg, height_cm, max_bpm, avg_bpm,
             resting_bpm, session_duration_hours, calories_burned,
             workout_type, fat_percentage, water_intake_liters,
             workout_frequency, experience_level, bmi)
        VALUES
            (:age, :gender, :weight_kg, :height_cm, :max_bpm, :avg_bpm,
             :resting_bpm, :session_duration_hours, :calories_burned,
             :workout_type, :fat_percentage, :water_intake_liters,
             :workout_frequency, :experience_level, :bmi)
    """)
    result = conn.execute(sql, ex_data)
    return result.lastrowid

def insert_practice(conn, practice_data):
    sql = text("""
        INSERT INTO practice (id_pratiques, id_utilisateur, id_exercice, practiced_at)
        VALUES (:id_pratiques, :id_utilisateur, :id_exercice, :practiced_at)
    """)
    conn.execute(sql, practice_data)

# ============================================================
# LOAD FK IDs
# ============================================================

gender_ids   = [g.id_genders for g in session.query(Gender).all()]
activity_ids = [a.id_physical_activity_levels for a in session.query(PhysicalActivityLevel).all()]

if not gender_ids:
    raise RuntimeError("❌ Aucun genre trouvé en base. Vérifie la table 'genders'.")
if not activity_ids:
    raise RuntimeError("❌ Aucun niveau d'activité trouvé. Vérifie 'physical_activity_levels'.")

# ============================================================
# USERS
# ============================================================

print(f"Génération de {N_USERS} utilisateurs...")

users_data = []

for _ in range(N_USERS):
    gender_id = random.choice(gender_ids)
    is_male   = (gender_id == 1)

    prenom = random.choice(PRENOMS_H if is_male else PRENOMS_F)
    nom    = random.choice(NOMS)

    weight = round(random.uniform(55, 110), 2)
    height = random.randint(155, 195)

    dob = random_date_of_birth()
    age = (date.today() - dob).days // 365

    objectif = random.choice(OBJECTIFS)

    user = User(
        prenom=prenom,
        nom=nom,
        pseudo=f"{prenom.lower()}_{random.randint(1000, 9999)}",
        email=f"{prenom.lower()}.{nom.lower()}_{random.randint(1000, 9999)}@test.com",
        mot_de_passe="$2b$12$FakeHashForTestingOnly",
        age=age,
        height_cm=height,
        weight_kg=weight,
        id_gender=gender_id,
        id_activity_level=random.choice(activity_ids),
        experience_level=random.randint(1, 3),
        objectif=objectif,
    )

    session.add(user)
    users_data.append((user, objectif))

session.flush()   # récupère les id_utilisateurs dans la session
session.commit()  # commit avant d'ouvrir une connexion directe séparée
print(f"✅ {N_USERS} utilisateurs créés.")

# ============================================================
# SESSIONS + PRACTICES  (insertion directe SQL)
# ============================================================

print("Génération des séances et pratiques...")

n_sessions  = 0
n_practices = 0

practice_id = 0

with engine.begin() as conn:
    for user, objectif in users_data:

        nb          = random.randint(MIN_PRACTICES, MAX_PRACTICES)
        workout_ids = random_workout_ids(objectif, nb)
        start_date  = date.today() - timedelta(days=random.randint(30, 180))

        for i, workout_id in enumerate(workout_ids):
            stats = random_session_stats(workout_id)

            ex_data = {
                "age":                    user.age,
                "gender":                 user.id_gender,
                "weight_kg":              float(user.weight_kg),
                "height_cm":              float(user.height_cm),
                "max_bpm":                stats["max_bpm"],
                "avg_bpm":                stats["avg_bpm"],
                "resting_bpm":            stats["resting_bpm"],
                "session_duration_hours": stats["session_duration_hours"],
                "calories_burned":        stats["calories_burned"],
                "workout_type":           workout_id,
                "fat_percentage":         round(random.uniform(10, 35), 1),
                "water_intake_liters":    round(random.uniform(1.5, 3.5), 1),
                "workout_frequency":      random.randint(2, 6),
                "experience_level":       user.experience_level,
                "bmi":                    compute_bmi(float(user.weight_kg), float(user.height_cm)),
            }

            exercise_id = insert_exercise_session(conn, ex_data)

            practiced_date = start_date + timedelta(days=i * random.randint(2, 7))

            insert_practice(conn, {
                "id_pratiques":   (practice_id := practice_id + 1),
                "id_utilisateur": user.id_utilisateurs,
                "id_exercice":    exercise_id,
                "practiced_at":   practiced_date,
            })

            n_sessions  += 1
            n_practices += 1

# engine.begin() a déjà tout commité — pas besoin d'un second commit

print(f"✅ {n_sessions} séances créées")
print(f"✅ {n_practices} pratiques créées")

print("\n📊 Résumé final")
print("Users    :", session.query(User).count())
print("Sessions :", session.query(ExerciseSession).count())
print("Practices:", session.query(Practice).count())

session.close()