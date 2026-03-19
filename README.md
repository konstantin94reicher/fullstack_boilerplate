## Setup

1. Repository klonen
   git clone https://github.com/deinname/fullstack-boilerplate mein-neues-projekt
   cd mein-neues-projekt
   git remote remove origin
   git remote add origin https://github.com/deinname/mein-neues-projekt
2. `cd backend && npm install`
3. `.env.example` zu `.env` kopieren und Werte eintragen
4. PostgreSQL Datenbank erstellen
5. `npm run dev` starten

6. `cd frontend && npm install`
7. `npm run dev` starten

## Deployment

1. Railway: Backend deployen, PostgreSQL hinzufügen, Variables setzen
2. Netlify: Base directory = frontend, Build command = npm run build, Publish directory = frontend/dist
