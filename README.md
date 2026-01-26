# Jahresplaner

Ein flexibler, webbasierter Jahresplaner für Vereine, Organisationen und Gruppen. 
Vollständig anpassbar für jeden Verwendungszweck.

![DPM Screenshot](https://github.com/bmetallica/Jahresplaner/blob/main/jahresplaner.jpg)

## Features

- 📅 **Übersichtliche Jahresplanung** - Alle Termine auf einen Blick
- 🎨 **Anpassbares Design** - Farben, Titel und Zweck individuell einstellbar
- 📱 **Kalender-Integration** - iCal-Feed zum Abonnieren in Apple Kalender, Google Kalender, Outlook etc.
- 🖨️ **Druckfunktion** - Optimierte Druckansicht
- 🔒 **Admin-Bereich** - Passwortgeschützter Bereich zum Bearbeiten der Termine
- 📱 **Responsive** - Optimiert für Desktop, Tablet und Smartphone
- ⚙️ **Einstellungen** - Farbschema, Zweck und Passwort konfigurierbar

<br>
Hinweis: Das Standardpasswort für Adminfunktionen ist "Jahresplaner"  (bitte ändern)
<br>

## 🐳 **Docker-Installation**

<table border=2><tr><th>
<b><u> 🔧 Voraussetzungen </u></b></th><td>
- docker & compose Plugin
</td></tr></table>
<br>
  
```bash
mkdir jahresplaner
cd jahresplaner
wget https://raw.githubusercontent.com/bmetallica/Jahresplaner/refs/heads/main/docker-compose.yml
docker compose up -d
```
<br>

## ⚙️ **Oder Manuelle Installation** (Debian/Ubuntu)

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (wird mit Node.js installiert)

### 1. System aktualisieren

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Node.js installieren

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Projekt herunterladen

```bash
cd /opt
sudo git clone https://github.com/bmetallica/Jahresplaner.git
cd jahresplaner
```

### 4. Abhängigkeiten installieren

```bash
sudo npm install
```

### 5. Server testen

```bash
node server.js
```

Der Server sollte nun auf Port 3089 laufen. Testen Sie im Browser: `http://localhost:3089`

## Autostart mit systemd einrichten

### 1. Service-Datei erstellen

```bash
sudo nano /etc/systemd/system/jahresplaner.service
```

### 2. Folgenden Inhalt einfügen

```ini
[Unit]
Description=Jahresplaner Node.js Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/jahresplaner
ExecStart=/usr/bin/node /opt/jahresplaner/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=jahresplaner

[Install]
WantedBy=multi-user.target
```

### 3. Service aktivieren und starten

```bash
sudo systemctl daemon-reload
sudo systemctl enable jahresplaner.service
sudo systemctl start jahresplaner.service
```

### 4. Status überprüfen

```bash
sudo systemctl status jahresplaner.service
```

### 5. Service verwalten

```bash
# Server stoppen
sudo systemctl stop jahresplaner.service

# Server neu starten
sudo systemctl restart jahresplaner.service

# Logs anzeigen
sudo journalctl -u jahresplaner.service -f
```

## Reverse Proxy mit Nginx (Optional)

Für den Produktivbetrieb empfiehlt sich ein Reverse Proxy


## Verwendung

### Termine anzeigen

Öffnen Sie einfach die URL im Browser. Die Termine werden automatisch geladen.

### Admin-Bereich

1. Scrollen Sie nach unten und klicken Sie auf "🔓 Admin Panel öffnen"
2. Geben Sie das Passwort ein (Standard: `Jahresplaner`)
3. Bearbeiten Sie Termine und speichern Sie

### Einstellungen

1. Klicken Sie auf das Zahnrad-Symbol ⚙️ oben links
2. Geben Sie das aktuelle Passwort ein
3. Passen Sie Design, Zweck und Farben an
4. Optional: Ändern Sie das Passwort

### Kalender abonnieren

1. Klicken Sie auf "📅 Kalender abonnieren"
2. Link wird kopiert
3. Fügen Sie den Link in Ihrer Kalender-App ein (siehe Hilfe-Button)


## Standard-Passwort ändern

⚠️ **Wichtig**: Ändern Sie das Standard-Passwort nach der Installation!

1. Öffnen Sie die Einstellungen (Zahnrad-Symbol)
2. Geben Sie das aktuelle Passwort ein: `Jahresplaner`
3. Tragen Sie ein neues Passwort ein
4. Klicken Sie auf "💾 Speichern"

## Port ändern

Bearbeiten Sie `server.js` und ändern Sie die Zeile:

```javascript
const PORT = 3089;
```

Nach der Änderung den Service neu starten:

```bash
sudo systemctl restart jahresplaner.service
```

## Lizenz

MIT License - Frei verwendbar und anpassbar

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue auf GitHub.
