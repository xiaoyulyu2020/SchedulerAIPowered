FROM node:alpine

WORKDIR /app/frontend

COPY ./apps/dashboard/ .

RUN chmod +x /app/frontend/entrypoint.sh

EXPOSE 3000

CMD [ "/app/frontend/entrypoint.sh"]