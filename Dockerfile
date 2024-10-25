# Stage 1: Install root-level dependencies and build shared packages
FROM node:20.12.0-alpine3.19 AS shared-dependencies

# Set the working directory in the Docker image
WORKDIR /app


# Copy root configuration files
COPY package.json package-lock.json turbo.json ./
COPY tsconfig.json ./

# Copy and install dependencies for shared packages (db, ui, etc.)
COPY packages ./packages 

#install dependencies
RUN npm install

# Run Turbo build for shared packages
RUN npm run build  --filter=packages

# Stage 2: Run Prisma Migrations
FROM node:20.12.0-alpine3.19 AS prisma-migrations

# Set the working directory for migrations
WORKDIR /app

# Copy packages for DB and relevant files for Prisma
COPY packages/db ./packages/db

# Install dependencies related to the database package
RUN npm install

# Run database migrations
WORKDIR /app/packages/db
RUN npx prisma migrate dev

# Stage 3: Build User App
FROM node:20.12.0-alpine3.19 AS user-app-builder

WORKDIR /app
# Copy the necessary files for the user app
COPY apps/user-app ./apps/user-app
COPY packages ./packages
# Copy packages for DB and relevant files for Prisma
COPY packages/db ./packages/db
COPY packages/typescript-config ./packages/typescript-config
COPY tsconfig.json ./
COPY turbo.json ./

WORKDIR /app/apps/user-app

# Install dependencies for the user app
RUN npm install

# Build the user app
RUN npm run build --filter=apps/user-app

# Stage 5: Build Bank Webhook Handler (Express Backend)
FROM node:20.12.0-alpine3.19 AS bank-handler-builder

WORKDIR /app

# Copy necessary files for the bank webhook handler
COPY apps/bank ./apps/bank
COPY packages ./packages
COPY packages/db ./packages/db
COPY tsconfig.json ./.
COPY turbo.json ./.

WORKDIR /app/apps/bank
# Install dependencies for the bank app
RUN npm install --production

# Build the bank webhook handler (Express backend)
RUN npm run build --filter=apps/bank

# Stage 6: Prepare the Final Runtime Image
FROM node:20.12.0-alpine3.19 AS final

# Set the working directory for the final image
WORKDIR /app

# Copy the built files from previous stages
COPY --from=user-app-builder /app/apps/user-app/.next ./user-app/.next
COPY --from=user-app-builder /app/apps/user-app/public ./user-app/public
COPY --from=user-app-builder /app/apps/user-app/node_modules ./user-app/node_modules

COPY --from=bank-handler-builder /app/apps/bank/dist ./bank/dist
COPY --from=bank-handler-builder /app/apps/bank/node_modules ./bank/node_modules

# Environment Variables 
ENV NODE_ENV=production

# Expose necessary ports 
EXPOSE 3000 3001 3003

# Run command
CMD ["npm", "run", "start-user-app"]
