# Integrator Service

## 📌 Descripción

El **Integrator Service** es un servicio basado en **NestJS** mediante una arquitectura modular y escalable. Utiliza **MongoDB** como base de datos y se compone de múltiples capas organizadas en **API Layer, Core Domain e Infrastructure**.

## 📂 Estructura del Proyecto

```
📦 integrator-service
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 api.module.ts
│   │   ├── 📄 api.controller.ts
│   │   ├── 📄 api.service.ts
│   ├── 📁 core
│   │   ├── 📄 auth.service.ts
│   │   ├── 📄 product.service.ts
│   │   ├── 📄 jwt.service.ts
│   ├── 📁 infrastructure
│   │   ├── 📄 database.module.ts
│   │   ├── 📄 database.service.ts
│   ├── 📄 main.ts
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 README.md
```

## 🛠️ Instalación y Configuración

### 🔹 Requisitos Previos

- **Node.js** v18+
- **MongoDB**
- **Docker (opcional para entorno local)**

### 🔹 Instalación

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/tu_usuario/integrator-service.git
   cd integrator-service
   ```

2. Instalar dependencias:

   ```sh
   npm install
   ```

3. Configurar variables de entorno:

   ```sh
   cp .env.example .env
   ```

4. Ejecutar la aplicación en modo desarrollo:

   ```sh
   npm run start:dev
   ```

## 🚀 Uso de la API

La documentación de la API está disponible en Swagger:

```sh
http://localhost:3000/api/docs
```

## 🧪 Pruebas

Ejecutar pruebas unitarias:

```sh
npm run test
```

📦 Despliegue

El servicio está desplegado en AWS Lambda con las siguientes URLs:

API Principal: <https://dtzxkhyjzcykop72jkelsvb7pa0tmprp.lambda-url.us-east-1.on.aws/>

Servicio de Validación de Productos: <https://cqls5huae4r26kr3bdfmreaslq0fikci.lambda-url.us-east-1.on.aws/>

🔹 Despliegue con Serverless Framework

Para desplegar el servicio en AWS Lambda, usa Serverless Framework terraform y github workflows; además de un contenedor de Docker:
