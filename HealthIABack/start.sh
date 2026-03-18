

#!/bin/sh
echo "Waiting for MySQL..."
until nc -z mysql 3306; do
  sleep 2
done

echo "Running migrations..."
pyway --database-type=mysql \
  --database-host=$DB_HOST \
  --database-port=3306 \
  --database-name=$DB_NAME \
  --database-username=$DB_USER \
  --database-password=$DB_PASSWORD \
  --database-table=pyway_schema_history \
  --database-migration-dir=/app/schema \
  migrate


echo "Starting backend..."
python app.py

