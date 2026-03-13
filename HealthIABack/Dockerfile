FROM python:3.12

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install pyway mysql-connector-python \
    && apt-get update \
    && apt-get install -y netcat-openbsd

COPY . .

RUN chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]
