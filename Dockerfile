FROM node:20-alpine AS builder
WORKDIR /app

# Instala as dependências usando cache do Docker
COPY package*.json ./
RUN npm ci

# Copia o código fonte
COPY . .

# Argumentos de Build para o Vite (necessários em tempo de build para produção)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Define as variáveis de ambiente para o processo de build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Gera o bundle de produção
RUN npm run build

# Estágio de Servidor (Nginx)
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
