// Chargeur de contenu Hero
async function loadHeroContent() {
    try {
        console.log('📥 Chargement du Hero...');
        
        // Charger le fichier hero.md
        const response = await fetch('/content/hero.md');
        
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}`);
        }
        
        const text = await response.text();
        console.log('✅ Fichier hero.md chargé');
        
        // Parser le front matter (données entre ---)
        const frontMatter = parseFrontMatter(text);
        console.log('📦 Données extraites:', frontMatter);
        
        // Mettre à jour le HTML
        updateHeroHTML(frontMatter);
        
    } catch (error) {
        console.error('❌ Erreur chargement Hero:', error);
    }
}

// Parse le front matter YAML
// Parse le front matter YAML (version améliorée)
function parseFrontMatter(content) {
    const regex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(regex);
    
    if (!match) {
        console.warn('Pas de front matter trouvé');
        return {};
    }
    
    const frontMatterText = match[1];
    const data = {};
    
    // Parser ligne par ligne avec regex plus précise
    const lines = frontMatterText.split('\n');
    
    lines.forEach(line => {
        // Ignorer les lignes vides
        if (!line.trim()) return;
        
        // Chercher key: value
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Enlever les guillemets si présents
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        
        // Remplacer \n par de vrais retours à la ligne
        value = value.replace(/\\n/g, '\n');
        
        data[key] = value;
    });
    
    return data;
}

// Nettoie les valeurs (enlève guillemets, traite \n)
function cleanValue(value) {
    // Enlever les guillemets
    value = value.replace(/^["']|["']$/g, '');
    
    // Remplacer \n par de vrais retours à la ligne
    value = value.replace(/\\n/g, '\n');
    
    return value;
}

// Met à jour le HTML avec les données
function updateHeroHTML(data) {
    // Titre principal
    const titleEl = document.querySelector('.hero h1');
    if (titleEl && data.title) {
        titleEl.textContent = data.title;
        console.log('✅ Titre mis à jour');
    }
    
    // Sous-titre (tagline)
    const subtitleEl = document.querySelector('.hero .tagline');
    if (subtitleEl && data.subtitle) {
        subtitleEl.textContent = data.subtitle;
        console.log('✅ Sous-titre mis à jour');
    }
    
    // Texte de bienvenue
    const textEl = document.querySelector('.hero-text');
    if (textEl && data.welcome_text) {
        // Convertir le Markdown simple en HTML
        const html = simpleMarkdownToHTML(data.welcome_text);
        textEl.innerHTML = html;
        console.log('✅ Texte mis à jour');
    }
    
    // Texte du bouton
    const buttonEl = document.querySelector('.hero .btn-corporate');
    if (buttonEl && data.button_text) {
        // Garder l'icône, changer seulement le texte
        buttonEl.innerHTML = `${data.button_text} <i class="fas fa-arrow-right ms-2"></i>`;
        console.log('✅ Bouton mis à jour');
    }
}

// Convertit du Markdown simple en HTML
function simpleMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Gras **texte**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italique *texte*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Paragraphes (séparer par \n\n)
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(p => {
        if (p.trim()) {
            return `<p class="mb-4">${p.trim()}</p>`;
        }
        return '';
    }).join('');
    
    return html;
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du chargement de contenu');
    loadHeroContent();
});