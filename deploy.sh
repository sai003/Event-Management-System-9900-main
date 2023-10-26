#!/bin/bash
echo -e "\n1. Stopping Docker containers..."
docker kill $(docker ps -q)

echo -e "\n2. Removing Docker containers..."
docker rm $(docker ps -a -q)

echo -e "\n3. Removing Images..."
docker rmi account-service-image
docker rmi email-service-image
docker rmi events-service-image
docker rmi front-end-image
docker rmi chat-server-image
docker rmi groups-service-image
docker rmi postgres

echo -e "\n4. Creating EvenTastic Docker Network..."
docker network create eventastic-net

echo -e "\n5. Builing Postgres Image..."
docker pull postgres 
docker run --net eventastic-net --name eventastic-db -d -p 5432:5432 -e POSTGRES_PASSWORD=postgrespw postgres

echo -e "\n6. Creating Database..."
sleep 5
cd database
pip3 install -r requirements.txt
python3 create_db.py

echo -e "\n7. Building Account Service Image..."
cd ../services/accounts-service/python-flask-server
docker build -t account-service-image .
docker run --net eventastic-net --name account-service-container -d -p 8080:8080 account-service-image

echo -e "\n8. Building Events Service Image..."
cd ../../events-service/python-flask-server
docker build -t events-service-image .
docker run --net eventastic-net --name events-service-container -d -p 8081:8081 events-service-image

echo -e "\n9. Building Groups Service Image..."
cd ../../groups-service/python-flask-server
docker build -t groups-service-image .
docker run --net eventastic-net --name groups-service-container -d -p 8082:8082 groups-service-image

echo -e "\n10. Building Email Service Image..."
cd ../../email-service/python-flask-server
docker build -t email-service-image .
docker run --net eventastic-net --name email-service-container -d -p 8083:8083 email-service-image

echo -e "\n11. Building Front End Image..."
cd ../../../frontend/eventastic-client
docker build -t front-end-image .
docker run --net eventastic-net --name front-end-container -d -p 3000:3000 front-end-image

echo -e "\n12. Building Chat Server Image..."
cd ../chat-server
docker build -t chat-server-image .
docker run --net eventastic-net --name chat-server-container -d -p 9090:9090 chat-server-image

echo -e "\nBuild Complete."