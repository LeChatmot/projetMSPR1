from langchain_mistralai import ChatMistralAI
import sqlite3
import json
from datetime import datetime
from config import settings

def get_llm(temperature: float = 0.3) -> ChatMistralAI:
    return ChatMistralAI(
        model=settings.MISTRAL_MODEL,
        api_key=settings.MISTRAL_API_KEY,
        temperature=temperature,
        timeout=30,
    )



def get_connection() -> sqlite3.Connection:
    return sqlite3.connect(settings.DB_PATH, check_same_thread=False)

def init_db() -> None:
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS seances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            sport TEXT NOT NULL,
            duree_min INTEGER NOT NULL,
            ressenti TEXT NOT NULL,
            sentiment TEXT,
            signaux_faibles TEXT,
            ton_utilise TEXT,
            message_genere TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def enregistrer_seance(user_id: str, sport: str, duree_min: int, ressenti: str,
                       sentiment: str = None, signaux: list = None,
                       ton: str = None, message: str = None) -> int:
    conn = get_connection()
    cursor = conn.execute("""
        INSERT INTO seances
        (user_id, sport, duree_min, ressenti, sentiment, signaux_faibles, ton_utilise, message_genere, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, sport, duree_min, ressenti,
        sentiment, json.dumps(signaux or []), ton, message,
        datetime.utcnow().isoformat()
    ))
    seance_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return seance_id

def historique_utilisateur(user_id: str, limite: int = 5) -> list[dict]:
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    rows = conn.execute("""
        SELECT * FROM seances
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    """, (user_id, limite)).fetchall()
    conn.close()

    seances = []
    for r in rows:
        d = dict(r)
        d["signaux_faibles"] = json.loads(d["signaux_faibles"]) if d["signaux_faibles"] else []
        seances.append(d)
    return seances

def compter_seances(user_id: str) -> int:
    conn = get_connection()
    count = conn.execute(
        "SELECT COUNT(*) FROM seances WHERE user_id = ?", (user_id,)
    ).fetchone()[0]
    conn.close()
    return count

def supprimer_utilisateur(user_id: str) -> int:
    """Bonus RGPD."""
    conn = get_connection()
    cursor = conn.execute("DELETE FROM seances WHERE user_id = ?", (user_id,))
    nb = cursor.rowcount
    conn.commit()
    conn.close()
    return nb
