"""
Microservice FastAPI — Recommandation d'exercices
Lance avec : uvicorn main:app --reload --port 8001
"""

import os
import pathlib
import numpy as np
import pandas as pd
import joblib

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from food import guess_image

# ── Chargement des modèles ─────────────────────────────────────────────────────

MODEL_DIR = pathlib.Path(__file__).parent / "models"

try:
    model       = joblib.load(MODEL_DIR / "model.pkl")
    mlb         = joblib.load(MODEL_DIR / "encoder.pkl")
    preprocessor = joblib.load(MODEL_DIR / "preprocessor.pkl")
    meta        = joblib.load(MODEL_DIR / "meta.pkl")
    print("✅ Modèles chargés avec succès.")
except FileNotFoundError as e:
    raise RuntimeError(f"❌ Fichier modèle introuvable : {e}. Lance d'abord le notebook.")

FEATURES      = meta["features"]
MLB_CLASSES   = np.array(meta["mlb_classes"])
WORKOUT_MAP   = meta["workout_map"]
MUSCLES_MAP   = meta["muscles_map"]

# ── Bonus objectif ─────────────────────────────────────────────────────────────

BONUS_MAP = {
    "perte_de_poids": {"Cardio": 1.5, "HIIT": 1.3, "Yoga": 1.1, "Strength": 0.8},
    "prise_de_masse": {"Strength": 1.5, "HIIT": 1.1, "Cardio": 0.7, "Yoga": 0.9},
    "endurance":      {"Cardio": 1.4, "HIIT": 1.3, "Yoga": 1.0, "Strength": 0.9},
    "maintien":       {"Cardio": 1.1, "Yoga": 1.2, "Strength": 1.1, "HIIT": 1.0},
}

# ── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="HealthIA — Recommandation d'exercices",
    description="API de recommandation personnalisée basée sur un Random Forest multi-label.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restreindre en production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schémas Pydantic ───────────────────────────────────────────────────────────

class RecommandationRequest(BaseModel):
    objectif:        str   = Field(..., example="perte_de_poids",
                                   description="perte_de_poids | prise_de_masse | maintien | endurance")
    user_weight_kg:  float = Field(..., gt=0, example=80.0)
    user_height_cm:  float = Field(..., gt=0, example=175.0)
    user_age:        int   = Field(..., gt=0, lt=120, example=30)
    experience_level: int  = Field(..., ge=1, le=3, example=1,
                                   description="1=Débutant, 2=Intermédiaire, 3=Avancé")
    problemes:       Optional[str] = Field(default="",
                                           example="genou,dos",
                                           description="Zones blessées séparées par des virgules")
    exercices_exclus: Optional[list[str]] = Field(default=[],
                                                   description="Exercices déjà pratiqués à exclure")
    n:               int   = Field(default=5, ge=1, le=20, description="Nombre de recommandations")


class ExerciceRecommande(BaseModel):
    exercice:    str
    score_rf:    float
    score_final: float


class RecommandationResponse(BaseModel):
    objectif:         str
    recommandations:  list[ExerciceRecommande]
    nb_exclus_blessure: int
    nb_exclus_pratique: int


# ── Logique de recommandation ──────────────────────────────────────────────────

def recommander(req: RecommandationRequest) -> RecommandationResponse:
    # Calcul IMC
    imc = round(req.user_weight_kg / (req.user_height_cm / 100) ** 2, 2)

    # Encodage features
    row = pd.DataFrame([{
        "objectif":        req.objectif,
        "user_weight_kg":  req.user_weight_kg,
        "user_height_cm":  req.user_height_cm,
        "user_imc":        imc,
        "user_age":        req.user_age,
        "experience_level": req.experience_level,
    }])[FEATURES]

    X_enc = preprocessor.transform(row)

    # Prédiction
    probs   = model.predict_proba(X_enc)[0]
    classes = model.classes_   # indices dans MLB_CLASSES

    # Zones problématiques
    problemes = set(p.strip().lower() for p in (req.problemes or "").split(",") if p.strip())

    # Exercices déjà pratiqués
    exclus_pratique = set(req.exercices_exclus or [])

    bonus = BONUS_MAP.get(req.objectif, {})

    results      = []
    nb_blessure  = 0
    nb_pratique  = 0

    for idx, col_idx in enumerate(classes):
        exo_name = MLB_CLASSES[col_idx]

        # Exclusion exercices déjà pratiqués
        if exo_name in exclus_pratique:
            nb_pratique += 1
            continue

        # Exclusion blessures (vérification muscles sollicités)
        muscles = MUSCLES_MAP.get(exo_name, "")
        zones   = set(z.strip().lower() for z in muscles.split(",") if z.strip())
        if problemes & zones:
            nb_blessure += 1
            continue

        score_rf    = round(float(probs[idx]), 4)
        score_final = round(score_rf * bonus.get(exo_name, 1.0), 4)

        results.append(ExerciceRecommande(
            exercice=exo_name,
            score_rf=score_rf,
            score_final=score_final,
        ))

    # Tri par score final décroissant
    results.sort(key=lambda x: x.score_final, reverse=True)

    return RecommandationResponse(
        objectif=req.objectif,
        recommandations=results[:req.n],
        nb_exclus_blessure=nb_blessure,
        nb_exclus_pratique=nb_pratique,
    )


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    return await guess_image(image)

@app.get("/", tags=["Santé"])
def root():
    return {"status": "ok", "message": "HealthIA Recommandation API v1.0.0"}


@app.get("/health", tags=["Santé"])
def health():
    return {
        "status":    "ok",
        "modele":    "Random Forest multi-label",
        "exercices": len(MLB_CLASSES),
        "features":  FEATURES,
    }


@app.post("/recommander", response_model=RecommandationResponse, tags=["Recommandation"])
def endpoint_recommander(req: RecommandationRequest):
    """
    Retourne les N exercices les plus adaptés au profil utilisateur.

    - Exclut les exercices contre-indiqués selon les zones blessées
    - Exclut les exercices déjà pratiqués
    - Applique un bonus selon l'objectif
    """
    try:
        return recommander(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/exercices", tags=["Référentiel"])
def liste_exercices():
    """Liste tous les exercices connus du modèle."""
    return {
        "exercices": [
            {"nom": nom, "muscles": MUSCLES_MAP.get(nom, "")}
            for nom in MLB_CLASSES.tolist()
        ]
    }


@app.get("/objectifs", tags=["Référentiel"])
def liste_objectifs():
    """Liste les objectifs supportés."""
    return {"objectifs": list(BONUS_MAP.keys())}