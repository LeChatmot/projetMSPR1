from Models.DailyFood import DailyFood
from Repositories.BaseRepository import BaseRepository


class DailyFoodsRepository(BaseRepository):

    TABLE = 'daily_foods'

    def __init__(self):
        super().__init__()

    def create(self, d: DailyFood) -> DailyFood:
        last_id = self._execute(
            f"""INSERT INTO {self.TABLE}
                    (name, category, calories_kcal, protein_g, carbs_g, fat_g, fiber_g,
                    sugar_g, sodium, cholesterol, meal_type, water_intake_ml)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (d.name, d.category, d.calories_kcal, d.protein_g, d.carbs_g, d.fat_g,
             d.fiber_g, d.sugar_g, d.sodium, d.cholesterol,
             d.meal_type, d.water_intake_ml)
        )
        d.id = last_id
        return d

    def getById(self, id: int) -> dict | None:
        d = DailyFood()
        row = self._fetch_one(f"SELECT * FROM {self.TABLE} WHERE id = %s", (id,))
        return d.to_model(row)

    def getAll(self) -> list:
        res = list()
        rows = self._fetch_all(f"SELECT * FROM {self.TABLE}")
        for row in rows:
            d = DailyFood()
            res.append(d.to_model(row))
        return res

    def update(self, d: DailyFood) -> None:
        self._execute(
            f"""UPDATE {self.TABLE} SET
                    name = %s, category = %s, calories_kcal = %s, protein_g = %s, carbs_g = %s,
                    fat_g = %s, fiber_g = %s, sugar_g = %s, sodium = %s,
                    cholesterol = %s, meal_type = %s, water_intake_ml = %s
                    WHERE id = %s""",
            (d.name, d.category, d.calories_kcal, d.protein_g, d.carbs_g, d.fat_g,
             d.fiber_g, d.sugar_g, d.sodium, d.cholesterol,
             d.meal_type, d.water_intake_ml, d.id)
        )
        return d

    def delete(self, id: int) -> bool:
        self._execute(f"DELETE FROM {self.TABLE} WHERE id = %s", (id,))
        return True
