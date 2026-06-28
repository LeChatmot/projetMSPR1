import os
import uuid

from dotenv import load_dotenv
from sqlalchemy import (
    Column, Date, DateTime, ForeignKey,
    Integer, Numeric, String, Text, Float,
    SmallInteger, DECIMAL
)
from sqlalchemy.dialects.mysql import CHAR, TINYINT, SMALLINT
from sqlalchemy.orm import DeclarativeBase, relationship

load_dotenv()

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
TMP_PATH = os.path.join(BASE_PATH, "tmp")
TO_IMPORT_ID = os.getenv("TO_IMPORT_ID")
ARCHIVE_ID   = os.getenv("ARCHIVE_ID")
ERROR_ID     = os.getenv("ERROR_ID")
LOG_ID       = os.getenv("LOG_ID")

class Base(DeclarativeBase):
    pass

UUID_TYPE = CHAR(36)

# ── Tables de référence ────────────────────────────────────────────────────────

class Gender(Base):
    __tablename__ = "genders"
    id_genders = Column(Integer, primary_key=True, autoincrement=True)
    name       = Column(String(50))
    utilisateurs = relationship("User", back_populates="gender")

class PhysicalActivityLevel(Base):
    __tablename__ = "physical_activity_levels"
    id_physical_activity_levels = Column(Integer, primary_key=True, autoincrement=True)
    name                        = Column(String(50))
    utilisateurs = relationship("User", back_populates="activity_level")

class WorkoutType(Base):
    __tablename__ = "workout_types"
    id_workout_types    = Column(Integer, primary_key=True, autoincrement=True)
    name                = Column(String(50))
    muscles_sollicites  = Column(String(255))
    description         = Column(Text)
    exercice_sessions   = relationship("ExerciseSession", back_populates="workout_type_rel")

class DiseaseType(Base):
    __tablename__ = "disease_types"
    id_disease_types = Column(Integer, primary_key=True, autoincrement=True)
    name             = Column(String(100))
    pathologies      = relationship("UtilisateurPathologie", back_populates="disease")

class Allergie(Base):
    __tablename__ = "allergies"
    id_allergies = Column(Integer, primary_key=True, autoincrement=True)
    name         = Column(String(100))
    allergies    = relationship("UtilisateurAllergie", back_populates="allergie")

# ── Utilisateurs ───────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "utilisateurs"

    id_utilisateurs     = Column(Integer, primary_key=True, autoincrement=True)
    prenom              = Column(String(50))
    nom                 = Column(String(50))
    pseudo              = Column(String(50))
    email               = Column(String(100), unique=True)
    mot_de_passe        = Column(String(255))

    # Colonnes ajoutées par V1_42 et V1_36
    age                 = Column(TINYINT(unsigned=True))
    height_cm           = Column(SMALLINT(unsigned=True))
    weight_kg           = Column(DECIMAL(5, 2))
    id_gender           = Column(Integer, ForeignKey("genders.id_genders"))
    id_activity_level   = Column(Integer, ForeignKey("physical_activity_levels.id_physical_activity_levels"))
    experience_level    = Column(TINYINT(unsigned=True))   # 1=Débutant 2=Intermédiaire 3=Avancé
    objectif            = Column(String(50))               # perte_de_poids | prise_de_masse | maintien | endurance

    gender         = relationship("Gender", back_populates="utilisateurs")
    activity_level = relationship("PhysicalActivityLevel", back_populates="utilisateurs")
    practices      = relationship("Practice", back_populates="user")
    blessures      = relationship("UtilisateurBlessure", back_populates="user")
    pathologies    = relationship("UtilisateurPathologie", back_populates="user")
    allergies_rel  = relationship("UtilisateurAllergie", back_populates="user")
    coach_messages = relationship("CoachMessage", back_populates="user")

# ── Tables liées aux utilisateurs ─────────────────────────────────────────────

class UtilisateurBlessure(Base):
    __tablename__ = "utilisateurs_blessures"
    id_utilisateurs_blessures = Column(Integer, primary_key=True, autoincrement=True)
    id_utilisateurs           = Column(Integer, ForeignKey("utilisateurs.id_utilisateurs"))
    zone                      = Column(String(100))
    description               = Column(Text)
    created_at                = Column(DateTime)
    user = relationship("User", back_populates="blessures")

class UtilisateurPathologie(Base):
    __tablename__ = "utilisateurs_pathologies"
    id_utilisateurs_pathologies = Column(Integer, primary_key=True, autoincrement=True)
    id_utilisateurs             = Column(Integer, ForeignKey("utilisateurs.id_utilisateurs"))
    id_disease_types            = Column(Integer, ForeignKey("disease_types.id_disease_types"))
    user    = relationship("User", back_populates="pathologies")
    disease = relationship("DiseaseType", back_populates="pathologies")

class UtilisateurAllergie(Base):
    __tablename__ = "utilisateurs_allergies"
    id_utilisateurs_allergies = Column(Integer, primary_key=True, autoincrement=True)
    id_utilisateurs           = Column(Integer, ForeignKey("utilisateurs.id_utilisateurs"))
    id_allergies              = Column(Integer, ForeignKey("allergies.id_allergies"))
    user     = relationship("User", back_populates="allergies_rel")
    allergie = relationship("Allergie", back_populates="allergies")

class CoachMessage(Base):
    __tablename__ = "coach_messages"
    id              = Column(Integer, primary_key=True, autoincrement=True)
    id_utilisateurs = Column(Integer, ForeignKey("utilisateurs.id_utilisateurs"))
    role            = Column(String(20))   # "user" | "assistant"
    content         = Column(Text)
    created_at      = Column(DateTime)
    user = relationship("User", back_populates="coach_messages")

# ── Exercices ──────────────────────────────────────────────────────────────────

class ExerciseSession(Base):
    __tablename__ = "exercice_sessions"

    id_exercice_sessions = Column(Integer, primary_key=True, autoincrement=True)
    age                    = Column(Integer)
    gender                 = Column(String(50))
    weight_kg              = Column(Float)
    height_cm              = Column(Float)
    max_bpm                = Column(Integer)
    avg_bpm                = Column(Integer)
    resting_bpm            = Column(Integer)
    session_duration_hours = Column(Float)
    calories_burned        = Column(Integer)
    workout_type           = Column(Integer, ForeignKey("workout_types.id_workout_types"))
    fat_percentage         = Column(Float)
    water_intake_liters    = Column(Float)
    workout_frequency      = Column(Integer)
    experience_level       = Column(Integer)
    bmi                    = Column(Float)

    workout_type_rel = relationship("WorkoutType", back_populates="exercice_sessions")
    practices        = relationship("Practice", back_populates="exercise")

# ── Pratiques ──────────────────────────────────────────────────────────────────

class Practice(Base):
    __tablename__ = "practice"

    id_pratiques   = Column(UUID_TYPE, primary_key=True, default=lambda: str(uuid.uuid4()))
    id_utilisateur = Column(Integer,   ForeignKey("utilisateurs.id_utilisateurs"))
    id_exercice    = Column(UUID_TYPE, ForeignKey("exercice_sessions.id_exercice_sessions"))
    practiced_at   = Column(Date)

    user     = relationship("User",            back_populates="practices")
    exercise = relationship("ExerciseSession", back_populates="practices")