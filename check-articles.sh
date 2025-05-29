#!/bin/sh
DEBUG_FILE="/tmp/debug-articles.log"

# Funzione per scrivere sia in console che nel file
log_output() {
    echo "$1" | tee -a "$DEBUG_FILE"
}

log_output "🔍 DEBUG: Verifica presenza articoli"
log_output "=================================="

log_output "📁 Working directory:"
pwd | tee -a "$DEBUG_FILE"

log_output "📁 Contenuto directory /app:"
ls -la /app | tee -a "$DEBUG_FILE"

log_output "📁 Verifica se esiste content/:"
ls -la content/ 2>/dev/null | tee -a "$DEBUG_FILE" || log_output "❌ Directory content/ non trovata"

log_output "📁 Verifica se esiste content/articles/:"
ls -la content/articles/ 2>/dev/null | tee -a "$DEBUG_FILE" || log_output "❌ Directory content/articles/ non trovata"

log_output "🔍 Ricerca file .md nella cartella /app:"
find /app -name "*.md" -type f 2>/dev/null | tee -a "$DEBUG_FILE" || log_output "❌ Nessun file .md trovato"

log_output "🔍 Permessi utente corrente:"
whoami | tee -a "$DEBUG_FILE"
id | tee -a "$DEBUG_FILE"

log_output "=================================="
log_output "✅ Debug completato!"
log_output "Log salvato in: $DEBUG_FILE"

# Poi avvia il server normale così puoi accedere al file via API
echo "Avvio server per accesso ai log..."
exec node dist/index.js 