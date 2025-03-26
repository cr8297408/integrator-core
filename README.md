# Boilerplate de API con Express - NestJS y TypeScript

Este es un boilerplate para crear una API robusta utilizando Express y TypeScript. Está configurado por defecto para trabajar con PostgreSQL, pero es fácilmente adaptable a otras bases de datos.

## Características

- Express como framework de servidor
- TypeScript para un desarrollo más seguro y productivo
- Configuración predeterminada con PostgreSQL
- Estructura de proyecto organizada y escalable
- Manejo de errores centralizado
- Logging con Winston
- Validación de datos con Joi
- Documentación de API con Swagger

## Repositorios de ejemplo

Este boilerplate incluye repositorios de ejemplo que demuestran cómo interactuar con la base de datos. Estos repositorios son los únicos archivos que deben comunicarse directamente con la base de datos. Esto ayuda a mantener una separación clara de responsabilidades y facilita el mantenimiento y las pruebas.

Los repositorios de ejemplo se encuentran en la carpeta `src/repositories` y muestran cómo realizar operaciones CRUD básicas. Asegúrate de seguir este patrón al crear nuevos repositorios para tu aplicación.

## Configuración de la base de datos

Por defecto, este boilerplate está configurado para usar PostgreSQL con los módulos `pg` y `transaction-db`. Sin embargo, puedes adaptarlo fácilmente a otras bases de datos:

1. Elimina las dependencias de PostgreSQL:

   ```
   npm uninstall pg transaction-db
   ```

2. Instala los módulos necesarios para tu base de datos preferida.

3. Actualiza los archivos de configuración y conexión a la base de datos según sea necesario.

## Instalación

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en un archivo `.env`
4. Ejecuta el servidor de desarrollo: `npm run dev`

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto
- `npm start`: Inicia el servidor en producción
- `npm test`: Ejecuta las pruebas

## Estructura del proyecto

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o realiza un pull request con tus sugerencias.
