const fs = require('fs').promises;
const path = require('path');

async function testArticles() {
    console.log('🔍 Test degli articoli...');
    
    try {
        // Verifica directory content
        const contentPath = path.join('content');
        console.log('📁 Directory content:', contentPath);
        
        try {
            const contentFiles = await fs.readdir(contentPath);
            console.log('✅ Files in content:', contentFiles);
        } catch (error) {
            console.log('❌ Errore reading content:', error.message);
            return;
        }
        
        // Verifica directory articles
        const articlesPath = path.join('content', 'articles');
        console.log('📁 Directory articles:', articlesPath);
        
        try {
            const articleFiles = await fs.readdir(articlesPath);
            const mdFiles = articleFiles.filter(f => f.endsWith('.md'));
            console.log('✅ Article files:', mdFiles);
            
            if (mdFiles.length === 0) {
                console.log('⚠️ Nessun file .md trovato!');
                return;
            }
            
            // Test primo articolo
            const firstFile = mdFiles[0];
            const filePath = path.join(articlesPath, firstFile);
            const content = await fs.readFile(filePath, 'utf-8');
            
            console.log(`📄 Test file: ${firstFile}`);
            console.log(`📊 Size: ${content.length} chars`);
            console.log(`📝 Preview:\n${content.substring(0, 300)}${content.length > 300 ? '...' : ''}`);
            
        } catch (error) {
            console.log('❌ Errore reading articles:', error.message);
        }
        
    } catch (error) {
        console.log('❌ Errore generale:', error.message);
    }
}

testArticles(); 