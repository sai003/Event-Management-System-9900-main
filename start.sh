#!/bin/bash
echo -e "\n1. Starting Front End Container ..."
docker start front-end-container

echo -e "\n2. Starting Chat Server Container ..."
docker start chat-server-container

echo -e "\n3. Starting Email Service Container ..."
docker start email-service-container

echo -e "\n4. Starting Groups Service Container ..."
docker start groups-service-container

echo -e "\n5. Starting Events Service Container ..."
docker start events-service-container

echo -e "\n6. Starting Account Service Container ..."
docker start account-service-container

echo -e "\n7. Starting Database Container ..."
docker start eventastic-db

docker ps
