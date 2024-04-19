FROM python:3.10

RUN python3 -m venv /opt/venv/
ENV PATH="/opt/venv/bin:$PATH"

CMD ["mkdir", "app/backend/"]

WORKDIR /app/backend/

COPY ./apps/app_backend/ .

RUN apt-get update \
    && apt-get install -y \
        gcc \
        g++ \
        make \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip setuptools \
    && pip install -r requirements.txt \
    && chmod +x /app/backend/scripts/entrypoint.sh \
    && chmod +x /app/backend/scripts/migrations.sh \
    && bash /app/backend/scripts/migrations.sh

CMD ["/app/backend/scripts/entrypoint.sh"]