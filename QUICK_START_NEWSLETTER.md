# 🚀 Quick Start - Newsletter AI Hub

## Configurazione Rapida

### 1. File .env
Crea il file `.env` nella root del progetto:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/aihub_db

# JWT Secret
JWT_SECRET=aihub-super-secret-jwt-key-2024

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# SMTP Gmail (CONFIGURATO)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lucadng@gmail.com
SMTP_PASS=vzchspctcknlhtmy
SMTP_FROM="AI Hub <no-reply@aihub.dev>"
NEWSLETTER_SIGNUP_URL=https://genai4business.com/#newsletter

# Environment
NODE_ENV=development
```

### 2. Avvia il Progetto
```bash
npm run dev
```

## 🧪 Test del Sistema

### Test 1: Iscrizione Newsletter (Frontend)
1. Vai su `http://localhost:5173`
2. Trova il form di iscrizione newsletter
3. Inserisci un'email di test
4. Controlla la tua casella email per l'email di benvenuto

### Test 2: Admin Newsletter
1. Vai su `http://localhost:5173/admin`
2. Login con:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Clicca tab "Newsletter" → "Apri Gestione Newsletter"
4. Verifica che si apra la pagina `/admin/newsletter`

### Test 3: Gestione Iscritti
1. Nella pagina newsletter admin
2. Tab "Iscritti" → Visualizza lista iscritti
3. Verifica che appaia l'email appena iscritta

### Test 4: Campagna Email
1. Tab "Campagne" → "Nuova Campagna"
2. Compila:
   - **Oggetto**: "Test Newsletter AI Hub"
   - **Contenuto**: "Ciao! Questa è una email di test della newsletter di AI Hub 🚀"
3. Clicca "Crea Campagna"
4. Clicca "Invia" sulla campagna creata
5. Controlla email ricevuta

## 🐛 Problemi Comuni

### Database non trovato
Se vedi errori di database:
```bash
# Configura DATABASE_URL con il tuo database PostgreSQL
# Oppure usa un database online come Neon, Supabase, etc.
```

### Email non inviate
- Verifica che l'App Password Gmail sia corretta
- Controlla i log del server per errori SMTP
- Assicurati che 2FA sia abilitato su Gmail

### Pagina admin non accessibile
- Verifica username/password nel file .env
- Cancella localStorage del browser
- Riprova il login

## ✅ Sistema Pronto!

Se tutti i test passano, il sistema newsletter è completamente funzionante:

- ✅ **Iscrizioni automatiche** con email di benvenuto
- ✅ **Gestione iscritti** tramite admin panel
- ✅ **Creazione campagne** con editor visuale
- ✅ **Invio email massivo** con template professionale
- ✅ **Statistiche** in tempo reale

## 🎯 Prossimi Passi

1. **Database Production**: Configura un database PostgreSQL di produzione
2. **SMTP Production**: Considera servizi professionali come SendGrid, Mailgun
3. **Domini**: Configura il tuo dominio per l'invio email
4. **Backup**: Implementa backup regolari degli iscritti

---

**Il tuo sistema newsletter è pronto per gestire migliaia di iscritti! 🎉** 