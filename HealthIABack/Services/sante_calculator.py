from datetime import date

ACTIVITY_MULTIPLIERS = {1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9}

IMC_CATEGORIES = [
    (18.5, "Insuffisance pondérale"),
    (25.0, "Poids normal"),
    (30.0, "Surpoids"),
    (float("inf"), "Obésité"),
]

GENDER_MALE = 1


def calculate_age_from_dob(date_of_birth: date) -> int:
    today = date.today()
    years = today.year - date_of_birth.year
    birthday_passed = (today.month, today.day) >= (date_of_birth.month, date_of_birth.day)
    return years if birthday_passed else years - 1


def calculate_imc(weight_kg: float, height_cm: int) -> float:
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def get_imc_categorie(imc: float) -> str:
    for threshold, label in IMC_CATEGORIES:
        if imc < threshold:
            return label
    return "Obésité"


def calculate_tdee(weight_kg: float, height_cm: int, age: int,
                   id_gender: int, id_activity_level: int) -> int:
    if id_gender == GENDER_MALE:
        bmr = 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)

    multiplier = ACTIVITY_MULTIPLIERS.get(id_activity_level, 1.375)
    return round(bmr * multiplier)
