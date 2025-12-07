# Imagen base: Node.js en versión ligera (Alpine)
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Configurar el puerto que utilizará la aplicación
ENV PORT=4000

# Exponer el puerto interno del contenedor
EXPOSE 4000

# Comando de inicio del backend
CMD ["npm", "start"]