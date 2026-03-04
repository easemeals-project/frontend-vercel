# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables needed at build time
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
ARG NEXT_PUBLIC_APPSYNC_URL
ARG NEXT_PUBLIC_APPSYNC_REGION
ARG NEXT_PUBLIC_APPSYNC_AUTH_TYPE
ARG NEXT_PUBLIC_APPSYNC_API_KEY

ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=$NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
ENV NEXT_PUBLIC_APPSYNC_URL=$NEXT_PUBLIC_APPSYNC_URL
ENV NEXT_PUBLIC_APPSYNC_REGION=$NEXT_PUBLIC_APPSYNC_REGION
ENV NEXT_PUBLIC_APPSYNC_AUTH_TYPE=$NEXT_PUBLIC_APPSYNC_AUTH_TYPE
ENV NEXT_PUBLIC_APPSYNC_API_KEY=$NEXT_PUBLIC_APPSYNC_API_KEY

RUN npm run build

# Stage 3: Production server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

#USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
