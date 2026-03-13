#!/bin/sh

echo "Waiting for MySQL..."

until nc -z mysql 3306; do
  sleep 2
done

echo "Running migrations..."

pyway migrate


echo "Starting backend..."

python app.py
