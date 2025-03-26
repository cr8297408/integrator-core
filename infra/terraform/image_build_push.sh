#!/bin/bash
# Si falla se detiene el script
set -e

cd ../..

#Variables
NODE_ENV=${NODE_ENV}
IMAGE_VERSION=${IMAGE_VERSION}
AWS_REGION=${AWS_REGION}
AWS_ACCOUNT=${AWS_ACCOUNT}
REPO_NAME=${REPO_NAME}
SECRET_NAME_AWS=${SECRET_NAME_AWS}

#obtener el login de ecr
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com

# Construir la imagen de Docker con las variables de entorno
docker build -t $REPO_NAME .

#Etiqueta de la imagen
docker tag $REPO_NAME:latest $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_VERSION

#Crear el repo si no existe
aws ecr describe-repositories --repository-names $REPO_NAME || aws ecr create-repository --repository-name $REPO_NAME

# Subir la imagen a ECR
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_VERSION

# Generar un hash de la imagen Docker y exportarlo
IMAGE_HASH=$(docker images --no-trunc --format "{{.ID}}")
echo "IMAGE_HASH=${IMAGE_HASH}" > image_hash.env