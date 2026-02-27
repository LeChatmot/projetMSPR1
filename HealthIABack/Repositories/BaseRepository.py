import pymysql
from pymysql.cursors import DictCursor
import os
import logging

logger = logging.getLogger(__name__)


class BaseRepository:

    _instance = None

    DB_CONFIG = {
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', '123456'),
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', 3306)),
        'db': os.getenv('DB_NAME', 'health_ia_db'),
        'charset': 'utf8mb4',
        'cursorclass': DictCursor,
        'connect_timeout': 10,
        'autocommit': False,

    }

    def __init__(self):
        self._conn = self._get_connection()

    def _get_connection(self) -> pymysql.connections.Connection:
        try:
            return pymysql.connect(**self.DB_CONFIG)
        except pymysql.OperationalError as e:
            logger.error(f"Impossible de se connecter à la base de données : {e}")
            raise

    def _ensure_connection(self):
        """Reconnecte si la connexion est perdue (MySQL 8h timeout)"""
        try:
            self._conn.ping(reconnect=True)
        except pymysql.OperationalError:
            self._conn = self._get_connection()

    def _fetch_all(self, query: str, params: tuple = None) -> list:
        self._ensure_connection()
        try:
            with self._conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()
        except pymysql.Error as e:
            logger.error(f"Erreur _fetch_all | query={query} | {e}")
            raise

    def _fetch_one(self, query: str, params: tuple = None) -> dict | None:
        self._ensure_connection()
        try:
            with self._conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()
        except pymysql.Error as e:
            logger.error(f"Erreur _fetch_one | query={query} | {e}")
            raise

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
            logger.error(f"Erreur _execute | query={query} | {e}")
            raise

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
            logger.error(f"Erreur _execute_many | query={query} | {e}")
            raise

    def close(self):
        if self._conn and self._conn.open:
            self._conn.close()

    def __del__(self):
        self.close()