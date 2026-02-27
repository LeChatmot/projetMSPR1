from airflow import DAG
from airflow.decorators import task
from datetime import datetime
import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.types import String, Integer, Float, DateTime

with DAG(
    dag_id="premier_test_pipeline",
    start_date=datetime(2026, 2, 14),
    schedule=None,
    catchup=False,
) as dag:

    @task
    def extract():

        df_members_synthetic = pd.read_csv("/home/maxime/airflow/data/gym_members_exercise_tracking_synthetic_data.csv", on_bad_lines='skip')
        df_members_tracking = pd.read_csv("/home/maxime/airflow/data/gym_members_exercise_tracking.csv", on_bad_lines='skip')
        df_members = pd.concat([df_members_tracking, df_members_synthetic])

        output_path = "/home/maxime/airflow/data/members_exercise.csv"

        df_members.to_csv(output_path, index=False)

        return output_path

    @task
    def transform(file_path):

        df_members = pd.read_csv(file_path)

        df_members['Workout_Type'] = df_members['Workout_Type'].replace({
            r'\\t': '',      # supprime \t
            r'\\n': '',
            r'\n': '',
            r'\t': ''
        }, regex=True)


        df_members['Max_BPM'] = df_members['Max_BPM'].replace({
            r'\\t': '',      # supprime \t
            r'\\n': ''
        }, regex=True)


        df_members['Max_BPM'] = pd.to_numeric(df_members['Max_BPM'])

        df_members['Gender'] = df_members['Gender'].fillna('Other')

        mean_age = round(df_members['Age'].mean())
        df_members['Age'] = df_members['Age'].fillna(mean_age)

        mean_Weight = round(df_members['Weight (kg)'].mean())
        df_members['Weight (kg)'] = df_members['Weight (kg)'].fillna(mean_Weight)

        mean_Height = round(df_members['Height (m)'].mean(), 2)
        df_members['Height (m)'] = df_members['Height (m)'].fillna(mean_Height)

        mean_MaxBPM = round(df_members['Max_BPM'].mean())
        df_members['Max_BPM'] = df_members['Max_BPM'].fillna(mean_MaxBPM)

        mean_AvgBPM = round(df_members['Avg_BPM'].mean())
        df_members['Avg_BPM'] = df_members['Avg_BPM'].fillna(mean_AvgBPM)

        mean_RestingBPM = round(df_members['Resting_BPM'].mean())
        df_members['Resting_BPM'] = df_members['Resting_BPM'].fillna(mean_RestingBPM)

        mean_SessionDuration = round(df_members['Session_Duration (hours)'].mean(), 2)
        df_members['Session_Duration (hours)'] = df_members['Session_Duration (hours)'].fillna(mean_SessionDuration)

        mean_FatPourcentage = round(df_members['Fat_Percentage'].mean(), 1)
        df_members['Fat_Percentage'] = df_members['Fat_Percentage'].fillna(mean_FatPourcentage)

        mean_Water_Intake = round(df_members['Water_Intake (liters)'].mean(), 1)
        df_members['Water_Intake (liters)'] = df_members['Water_Intake (liters)'].fillna(mean_Water_Intake)

        df_members = df_members.dropna(subset=['Workout_Type'])

        df_members['Workout_Frequency (days/week)'] = df_members['Workout_Frequency (days/week)'].fillna(1)

        df_members = df_members.dropna(subset=['Experience_Level'])

        mean_CaloriesBurned = round(df_members['Calories_Burned'].mean())
        df_members['Calories_Burned'] = df_members['Calories_Burned'].fillna(mean_CaloriesBurned)

        mean_BMI = round(df_members['BMI'].mean(), 2)
        df_members['BMI'] = df_members['BMI'].fillna(mean_BMI)

        output_path = "/home/maxime/airflow/data/members_clean.csv"

        df_members.to_csv(output_path, index=False)

        return output_path


    @task
    def load(file_path):

        df_members = pd.read_csv(file_path)

        engine = create_engine("mysql+pymysql://root:C3poR2d2!@localhost/test_donnees")

        df_members.to_sql(
            name="test_table_datas",
            con=engine,
            if_exists="append",
            index=False,
            dtype={
                "age": Integer(),
                "gender": String(20),
                "weight": Float,
                "height": Float,
                "maxBPM": Integer(),
                "avgBPM": Integer(),
                "restingBPM": Integer(),
                "sessionDuration": Float,
                "caloriesBurned": Integer(),
                "workoutType": String(30),
                "fatPourcentage": Float,
                "waterIntake": Float,
                "workoutFrequency": Integer(),
                "experienceLevel": Integer(),
                "bmi": Float
            }
        )

    data = extract()
    cleaned = transform(data)
    load(cleaned)