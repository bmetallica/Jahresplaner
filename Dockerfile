FROM node:24-bookworm-slim

LABEL maintainer="bmetallica"
LABEL description="Jahresplaner - Webbasierter Jahresplaner für Vereine und Organisationen"
LABEL version="1.0.0"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone https://github.com/bmetallica/Jahresplaner.git /app

RUN npm install

RUN mkdir -p /app/logs

EXPOSE 3089

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3089} || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
