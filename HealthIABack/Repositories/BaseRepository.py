import pymysql
from pymysql.cursors import DictCursor
import os
import logging

logger = logging.getLogger(__name__)


class BaseRepository:

    def __init__(self):
        self._conn = self._get_connection()

    def _get_connection(self) -> pymysql.connections.Connection:
        db_config = {
            'user': os.getenv('DB_USER', 'healthia'),
            'password': os.getenv('DB_PASSWORD', '123456'),
            'host': os.getenv('DB_HOST', 'mysql'),
            'port': int(os.getenv('DB_PORT', 3306)),
            'db': os.getenv('DB_NAME', 'health_ia_db'),
            'charset': 'utf8mb4',
            'cursorclass': DictCursor,
            'connect_timeout': 10,
            'autocommit': False,
        }
        try:
            return pymysql.connect(**db_config)
        except pymysql.OperationalError as e:
            msg = f"Impossible de se connecter à la base de données : {e}"
            logger.error(msg)
            raise ConnectionError(msg) from e

    def _ensure_connection(self):
        """Assure que la connexion de l'instance est active."""
        try:
            if self._conn is None or not self._conn.open:
                self._conn = self._get_connection()
            else:
                # Vérifie si la connexion est toujours valide
                self._conn.ping(reconnect=True)
        except (pymysql.OperationalError, AttributeError):
            # Recrée la connexion si le ping échoue ou si _conn est None
            self._conn = self._get_connection()

    def _fetch_all(self, query: str, params: tuple = None) -> list:
        self._ensure_connection()
        try:
            with self._conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()
        except pymysql.Error as e:
            msg = f"Erreur _fetch_all | query='{query}' | {e}"
            logger.error(msg)
            raise RuntimeError(msg) from e

    def _fetch_one(self, query: str, params: tuple = None) -> dict | None:
        self._ensure_connection()
        try:
            with self._conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()
        except pymysql.Error as e:
            msg = f"Erreur _fetch_one | query='{query}' | {e}"
            logger.error(msg)
            raise RuntimeError(msg) from e

    def _execute(self, query: str, params: tuple = None) -> int:
        """Retourne le lastrowid (utile pour les INSERT)"""
        self._ensure_connection()
        try:
            with self._conn.cursor() as cursor:
                cursor.execute(query, params)
                self._conn.commit()
                return cursor.lastrowid
        except pymysql.Error as e:
            self._conn.rollback()
            msg = f"Erreur _execute | query='{query}' | {e}"
            logger.error(msg)
            raise RuntimeError(msg) from e

    def _execute_many(self, query: str, params_list: list[tuple]) -> int:
        """Exécute une requête en batch — utile pour les INSERT multiples"""
        self._ensure_connection()
        try:
            with self._conn.cursor() as cursor:
                cursor.executemany(query, params_list)
                self._conn.commit()
                return cursor.rowcount
        except pymysql.Error as e:
            self._conn.rollback()
            msg = f"Erreur _execute_many | query='{query}' | {e}"
            logger.error(msg)
            raise RuntimeError(msg) from e

    def close(self):
        """Ferme la connexion de l'instance."""
        if self._conn and self._conn.open:
            self._conn.close()
