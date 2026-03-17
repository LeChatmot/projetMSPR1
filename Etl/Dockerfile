FROM apache/airflow:2.9.0

USER airflow

RUN pip install pandas mysql-connector-python pymysql

COPY ../Datasets/ /Datasets

USER airflow
