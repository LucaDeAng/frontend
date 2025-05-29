#!/bin/sh
echo "🔍 DEBUG: Verifica presenza articoli"
echo "=================================="

echo "📁 Working directory:"
pwd

echo "📁 Contenuto directory /app:"
ls -la /app

echo "📁 Verifica se esiste content/:"
ls -la content/ 2>/dev/null || echo "❌ Directory content/ non trovata"

echo "📁 Verifica se esiste content/articles/:"
ls -la content/articles/ 2>/dev/null || echo "❌ Directory content/articles/ non trovata"

echo "🔍 Ricerca file .md nella cartella /app:"
find /app -name "*.md" -type f 2>/dev/null || echo "❌ Nessun file .md trovato"

echo "🔍 Permessi utente corrente:"
whoami
id

echo "=================================="
echo "✅ Debug completato!" 