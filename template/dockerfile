FROM node:18-alpine

WORKDIR /home/app

# Install npm packages
COPY package*.json ./
RUN npm ci

# Copy all other source code to work directory
COPY . ./
RUN npm run build

# Environment variables
ARG COTALKER_TOKEN
ARG BASE_URL
ARG FAAS_URL
ARG WEB_BASE_URL
ARG BI_URL
ARG SAP_NOTIFY_BASE_URL
ARG SAP_NOTIFY_AUTH
ARG AWS_S3_ACCESSKEY_ID
ARG AWS_S3_SECRET_ACCESSKEY
ARG AWS_S3_BUCKET_NAME
ARG AVISOS_URL_INIT
ARG ELASTIC_APM_SECRET_TOKEN
ARG ELASTIC_APM_SERVER_URL
ARG NODE_ENV

# Command
CMD node --max-old-space-size=4096 ./dist/template/index.js
