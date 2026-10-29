#!/bin/bash
set -e

echo "=========================================="
echo "  Jahresplaner - Node.js Server"
echo "  Container Initialization"
echo "=========================================="

# Stelle sicher, dass notwendige Verzeichnisse existieren
mkdir -p /app/logs
mkdir -p /data

# Setze Umgebungsvariablen mit Defaults
export PORT="${PORT:-3089}"

# Kopiere config.json und termine.csv ins persistente Volume, falls nicht vorhanden
if [ ! -f "/data/config.json" ]; then
    echo "[INFO] Kopiere initiale config.json ins Volume..."
    cp /app/config.json /data/config.json
fi

if [ ! -f "/data/termine.csv" ]; then
    echo "[INFO] Kopiere initiale termine.csv ins Volume..."
    cp /app/termine.csv /data/termine.csv
fi

# Erstelle Symlinks zu den persistenten Dateien
echo "[INFO] Erstelle Symlinks zu persistenten Dateien..."
ln -sf /data/config.json /app/config.json
ln -sf /data/termine.csv /app/termine.csv

echo "[INFO] Jahresplaner wird gestartet..."
echo "[INFO] Server-Port: $PORT"

# Starte die Anwendung
exec "$@"
