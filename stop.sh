#!/bin/bash
echo -e "\n1. Stopping Front End Container ..."
docker stop front-end-container

echo -e "\n2. Stopping Chat Server Container ..."
docker stop chat-server-container

echo -e "\n3. Stopping Email Service Container ..."
docker stop email-service-container

echo -e "\n4. Stopping Groups Service Container ..."
docker stop groups-service-container

echo -e "\n5. Stopping Events Service Container ..."
docker stop events-service-container

echo -e "\n6. Stopping Account Service Container ..."
docker stop account-service-container

echo -e "\n7. Stopping Database Container ..."
docker stop eventastic-db

docker ps
