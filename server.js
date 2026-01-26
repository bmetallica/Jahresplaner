const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ical = require('ical-generator').default;

const app = express();
const PORT = 3089;
const CSV_FILE = './termine.csv';
const CONFIG_FILE = './config.json';

const getConfig = () => {
    if (!fs.existsSync(CONFIG_FILE)) {
        return { 
            year: new Date().getFullYear(),
            purpose: "Termine",
            mainColor: "#2E86DE",
            accentColor: "#E74C3C",
            backgroundColor: "#0F1419",
            password: "Stavo01"
        };
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
};

const saveConfig = (config) => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
};

app.use(express.json());
app.use(express.static('public'));

const getCsvWriter = () => createCsvWriter({
    path: CSV_FILE,
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'endDate', title: 'END_DATE'},
        {id: 'title', title: 'TITLE'},
        {id: 'subevents', title: 'SUBEVENTS'}
    ]
});

const readEvents = () => {
    return new Promise((resolve) => {
        const results = [];
        if (!fs.existsSync(CSV_FILE)) return resolve([]);
        fs.createReadStream(CSV_FILE)
            .pipe(csvParser())
            .on('data', (data) => {
                try {
                    data.SUBEVENTS = data.SUBEVENTS ? JSON.parse(data.SUBEVENTS) : [];
                } catch(e) { data.SUBEVENTS = []; }
                results.push(data);
            })
            .on('end', () => {
                results.sort((a, b) => new Date(a.DATE) - new Date(b.DATE));
                resolve(results);
            });
    });
};

app.get('/api/config', (req, res) => {
    res.json(getConfig());
});

app.post('/api/config/update', (req, res) => {
    const { password, config } = req.body;
    const currentConfig = getConfig();
    if (password !== currentConfig.password) return res.status(403).send('Falsches Passwort');
    // Merge mit aktueller Config, um keine Felder zu verlieren
    const updatedConfig = { ...currentConfig, ...config };
    saveConfig(updatedConfig);
    res.json({ success: true });
});

app.get('/api/events', async (req, res) => {
    const events = await readEvents();
    res.json(events);
});

app.post('/api/events/update', async (req, res) => {
    const { password, events } = req.body;
    const config = getConfig();
    if (password !== config.password) return res.status(403).send('Falsches Passwort');
    
    const formatted = events.sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(e => ({
            date: e.date,
            endDate: e.endDate || '',
            title: e.title,
            subevents: JSON.stringify(e.subevents || [])
        }));

    await getCsvWriter().writeRecords(formatted);
    res.json({ success: true });
});

// iCal Feed für Abonnements
app.get('/api/calendar.ics', async (req, res) => {
    const events = await readEvents();
    const config = getConfig();
    const calendarName = (config.purpose || 'Termine') + ' ' + config.year;
    const calendar = ical({ name: calendarName });

    events.forEach(e => {
        const description = e.SUBEVENTS.map(s => `${s.time ? s.time + ' ' : ''}${s.text}`).join('\n');
        
        // Prüfe ob irgendein Subevent eine Zeit hat
        const hasTime = e.SUBEVENTS && e.SUBEVENTS.some(s => s.time);
        
        if (hasTime) {
            // Event mit Zeitangabe: Timed Event (mehrere Events für jede Zeit)
            e.SUBEVENTS.forEach(s => {
                if (s.time) {
                    const [hours, minutes] = s.time.split(':');
                    const startDate = new Date(e.DATE);
                    startDate.setHours(parseInt(hours), parseInt(minutes), 0);
                    
                    const endDate = e.END_DATE ? new Date(e.END_DATE) : new Date(e.DATE);
                    endDate.setHours(parseInt(hours) + 1, parseInt(minutes), 0);
                    
                    calendar.createEvent({
                        start: startDate,
                        end: endDate,
                        summary: `${e.TITLE} - ${s.text}`,
                        description: s.text,
                        location: 'Jugendheim Kurtscheid'
                    });
                }
            });
        } else {
            // Event ohne Zeitangabe: Ganztägiges Event
            calendar.createEvent({
                start: new Date(e.DATE),
                end: e.END_DATE ? new Date(e.END_DATE) : new Date(e.DATE),
                allDay: true,
                summary: e.TITLE,
                description: description,
                location: 'Jugendheim Kurtscheid'
            });
        }
    });

    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.send(calendar.toString());
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
