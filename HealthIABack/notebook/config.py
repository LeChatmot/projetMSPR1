import os
import uuid

from dotenv import load_dotenv
from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Float,
    Uuid,
)
from sqlalchemy.orm import DeclarativeBase, relationship

load_dotenv()

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
TMP_PATH = os.path.join(BASE_PATH, "tmp")
TO_IMPORT_ID = os.getenv("TO_IMPORT_ID")
ARCHIVE_ID = os.getenv("ARCHIVE_ID")
ERROR_ID = os.getenv("ERROR_ID")
LOG_ID = os.getenv("LOG_ID")

class Base(DeclarativeBase):
    pass

class Practice(Base):
    __tablename__ = "practice"

    practice_id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(ForeignKey("utilisateurs.id_utilisateurs"))
    exercise_id = Column(ForeignKey("exercice_sessions.id_exercice_sessions"))
    practiced_at = Column(Date)

    user = relationship("User", back_populates="practices")
    exercise = relationship("Exercise", back_populates="practices")

class User(Base):
    __tablename__ = "utilisateurs"

    id_utilisateurs = Column(Uuid, primary_key=True, default=uuid.uuid4)

    prenom = Column(String(50), nullable=False)
    nom = Column(String(50), nullable=False)

    pseudo = Column(String(50), nullable=False)

    email = Column(String(100), unique=True, nullable=False)
    mot_de_passe = Column(String(50), nullable=False)

    birthdate = Column(Date, nullable=False)
    gender = Column(String(50), nullable=False)

    weight = Column(Numeric(15, 2), nullable=False)
    height = Column(Integer, nullable=False)
    bmi = Column(Numeric(15, 2), nullable=False)
    body_fat_pct = Column(Numeric(15, 2), nullable=False)

    physical_activity_level = Column(String(50), nullable=False)
    daily_caloric_intake = Column(Integer, nullable=False)

    favorite_exercise_categorie = Column(String(100))

    practices = relationship("Practice", back_populates="user")

class ExerciseSession(Base) :

    __tablename__       = "exercice_sessions"

    id_exercice_sessions         = Column(Uuid, primary_key=True, default=uuid.uuid4)
    age                = Column(Integer, nullable=False)
    gender                = Column(String(50), nullable=False)
    weight_kg    = Column(Float, nullable=False)
    height_cm        = Column(Float, nullable=False)
    max_bpm   = Column(Integer)
    avg_bpm  = Column(Integer)
    resting_bpm  = Column(Integer)
    session_duration_hours = Column(Float)
    calories_burned = Column(Integer)
    workout_type  = Column(String(50))
    fat_percentage  = Column(Float)
    water_intake_liters = Column(Float)
    workout_frequency   = Column(Integer)
    experience_level = Column(Integer)
    bmi = Column(Float)

    practices = relationship("Practice", back_populates="exercise")