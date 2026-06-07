import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")
    MISTRAL_MODEL: str = os.getenv("MISTRAL_MODEL", "mistral-small-latest")
    DB_PATH: str = os.getenv("DB_PATH", "coach.db")
    APP_ENV: str = os.getenv("APP_ENV", "dev")

    def __init__(self):
        if not self.MISTRAL_API_KEY:
            raise RuntimeError("MISTRAL_API_KEY manquante dans .env")

settings = Settings()