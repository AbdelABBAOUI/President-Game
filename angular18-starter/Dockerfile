# Dockerfile pour le frontend
# Étape de build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build du projet Angular
RUN npm run build --prod

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=builder /app/dist/angular18-with-tailwind/ /usr/share/nginx/html/

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
