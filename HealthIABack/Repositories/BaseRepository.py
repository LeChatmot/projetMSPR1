import pymysql
from pymysql.cursors import DictCursor


class BaseRepository:

    def __init__(self):
        self._conn = pymysql.connect(
            user='root',
            password='123456',
            host='localhost',
            port=3306,
            db='health_ia_db',
            cursorclass=DictCursor
        )

    def _fetch_all(self, query: str, params: tuple = None) -> list:
        with self._conn.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def _fetch_one(self, query: str, params: tuple = None) -> dict:
        with self._conn.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()

    def _execute(self, query: str, params: tuple = None) -> int:
        """Retourne le lastrowid (utile pour les INSERT)"""
        with self._conn.cursor() as cursor:
            cursor.execute(query, params)
            self._conn.commit()
            return cursor.lastrowid

    def close(self):
        self._conn.close()