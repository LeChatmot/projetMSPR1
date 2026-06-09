FROM python:3.12

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY schema /app/resources

RUN chmod +x start.sh

EXPOSE 5000

CMD ["sh","./start.sh"]
