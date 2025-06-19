# ---------- Stage 1: Build ----------
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app and build
COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html
# OR if React: /app/build instead of /app/dist

# Optional: Copy custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]