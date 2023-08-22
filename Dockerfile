# Entorno o runtime, en este caso Node v.20
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código a nuestro contenedor
COPY . .

# Ejecutamos el comando “build” para crear una versión de producción
RUN npm run build

# Exponemos el puerto en el que normalmente trabaja Nextjs
EXPOSE 3000

# Ejecutamos la versión de producción de nuestra app
CMD ["npm", "start"]
