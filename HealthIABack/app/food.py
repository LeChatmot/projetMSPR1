import base64
import json
from io import BytesIO

import requests
from PIL import Image
from fastapi import File, HTTPException, UploadFile


# ── Configuration ─────────────────────────────────────────────────────────────

OLLAMA_URL = "http://localhost:11434"
MODEL_NAME = "llava:latest"
TIMEOUT = 240


# ── Image processing ─────────────────────────────────────────────────────────

def prepare_image_base64(image_bytes: bytes, max_size: int = 1024) -> str:
    """
    Réduit et compresse l'image avant envoi à Ollama.
    """
    img = Image.open(BytesIO(image_bytes)).convert("RGB")

    if max(img.size) > max_size:
        ratio = max_size / max(img.size)
        img = img.resize(
            (
                int(img.width * ratio),
                int(img.height * ratio)
            ),
            Image.LANCZOS
        )

    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=85)

    return base64.b64encode(buffer.getvalue()).decode("utf-8")


# ── Prompt vision nutrition ───────────────────────────────────────────────────

def build_nutrition_prompt() -> str:
    return """
You are an AI food recognition assistant.

Analyze the meal image carefully.

Rules:
- Identify only visible foods.
- Estimate portions approximately.
- Do not invent hidden ingredients.
- If unsure, lower confidence.
- Return ONLY valid JSON.

Format:

{
  "foods": [
    {
      "name_fr": "",
      "name_en": "",
      "estimated_quantity_g": 0,
      "estimated_calories_kcal": 0,
      "confidence": 0.0
    }
  ],
  "meal_type": "",
  "nutrition_comment_fr": "",
  "needs_user_confirmation": true
}
"""


# ── JSON validation ───────────────────────────────────────────────────────────

def parse_json_response(text: str):
    try:
        return json.loads(text)
    except Exception:
        return None


# ── FastAPI endpoint ──────────────────────────────────────────────────────────

async def guess_image(image: UploadFile = File(...)):
    """
    Analyse une photo de repas avec un modèle vision Ollama.
    """

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Le fichier doit être une image."
        )

    image_bytes = await image.read()

    try:
        image_base64 = prepare_image_base64(image_bytes)

        payload = {
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "user",
                    "content": build_nutrition_prompt(),
                    "images": [image_base64]
                }
            ],
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1
            }
        }

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llava:latest",
                "prompt": build_nutrition_prompt(),
                "images": [image_base64],
                "stream": False,
                "format": "json",
                "options": {
                    "temperature": 0.1
                }
            },
            timeout=TIMEOUT
        )

        response.raise_for_status()

        raw = response.json().get("response", "")
        data = parse_json_response(raw)

        if data:
            return {
                "status": "success",
                "is_working": 1,
                "data": data
            }

    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "message": "Le modèle vision a dépassé le délai."
        }

    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": str(e)
        }

    return {
        "status": "degraded",
        "is_working": 0,
        "data": None,
        "message": "Analyse impossible, saisie manuelle nécessaire."
    }
