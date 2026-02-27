from Models.Patient import Patient
from Repositories.BaseRepository import BaseRepository


class PatientRepository(BaseRepository):

    def get_all(self) -> list[Patient]:
        rows = self._fetch_all("SELECT * FROM Patient")
        return [Patient.from_dict(row) for row in rows]

    def get_by_id(self, id: int) -> Patient:
        row = self._fetch_one("SELECT * FROM Patient WHERE id = %s", (id,))
        return Patient.from_dict(row) if row else None

    def create(self, patient: Patient) -> Patient:
        last_id = self._execute(
            "INSERT INTO Patient "
            "(age, gender, height_cm, current_weight_kg, disease_type, diet_recommendation, daily_caloric_target)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (patient.getAge(), patient.getGender(), patient.getHeight(), patient.getWeight(),
             patient.getDiseaseType(), patient.getDietRecommendation(), patient.getDailyCaloricTarget())
        )
        patient.setId(last_id)
        return patient

    def update(self, patient: Patient) -> Patient:
        self._execute(
            "UPDATE Patient SET age = %s, gender = %s, height_cm = %s, current_weight_kg = %s, "
            "disease_type = %s, diet_recommendation = %s, daily_caloric_target = %s WHERE id = %s",
            (patient.getAge(), patient.getGender(), patient.getHeight(), patient.getWeight(),
             patient.getDiseaseType(), patient.getDietRecommendation(), patient.getDailyCaloricTarget(),
             patient.getId())
        )
        return patient

    def remove(self, patient: Patient) -> bool:
        self._execute("DELETE FROM Patient WHERE id = %s", (patient.getId(),))
        return True
