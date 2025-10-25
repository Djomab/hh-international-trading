// Netlify CMS - Récupération du contenu
async function loadContent() {
    try {
        await loadHero();
        await loadSolutions();
        await loadTestimonials();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Charger le hero
async function loadHero() {
    try {
        const response = await fetch('/content/hero.md');
        if (!response.ok) {
            throw new Error('Hero markdown file not found');
        }
        const content = await response.text();
        
        // Parser le front matter (métadonnées YAML)
        const { attributes } = parseMarkdownFrontMatter(content);
        
        // Mettre à jour le DOM
        if (attributes.title) {
            document.getElementById('hero-title').textContent = attributes.title;
        }
        if (attributes.subtitle) {
            document.getElementById('hero-subtitle').textContent = attributes.subtitle;
        }
        if (attributes.welcome_text) {
            // Utiliser marked pour convertir le markdown en HTML
            document.getElementById('hero-content').innerHTML = marked.parse(attributes.welcome_text);
        }
        if (attributes.button_text) {
            const button = document.getElementById('hero-button');
            if (button) {
                button.textContent = attributes.button_text;
            }
        }
    } catch (error) {
        console.log('Hero content loaded from static fallback');
    }
}

// Charger les solutions
async function loadSolutions() {
    try {
        // On pourrait aussi charger une liste de solutions depuis un index, mais pour l'instant on hardcode
        const solutions = [
            'bornes-recharge',
            'smart-grid', 
            'solutions-solaires'
        ];
        
        let solutionsHTML = '';
        
        for (const slug of solutions) {
            const response = await fetch(`/content/solutions/${slug}.md`);
            if (!response.ok) {
                console.warn(`Solution ${slug} not found`);
                continue;
            }
            const content = await response.text();
            const { attributes } = parseMarkdownFrontMatter(content);
            
            // Vérifier que les attributs nécessaires existent
            if (!attributes.title || !attributes.description) {
                console.warn(`Solution ${slug} is missing required fields`);
                continue;
            }
            
            const featuresHTML = attributes.features ? 
                attributes.features.map(feat => `<li><i class="fas fa-chevron-right"></i> ${feat}</li>`).join('') : '';
            
            solutionsHTML += `
                <div class="col-lg-6 mb-4">
                    <div class="solution-card">
                        <div class="solution-icon">
                            <i class="fas fa-${attributes.icon || 'cog'}"></i>
                        </div>
                        <h3>${attributes.title}</h3>
                        <p>${attributes.description}</p>
                        <ul>${featuresHTML}</ul>
                    </div>
                </div>
            `;
        }
        
        if (solutionsHTML) {
            document.getElementById('solutions-container').innerHTML = solutionsHTML;
        } else {
            document.getElementById('solutions-container').innerHTML = '<p>Nos solutions arrivent bientôt.</p>';
        }
    } catch (error) {
        console.log('Solutions loaded from static fallback');
    }
}

// Charger les témoignages
async function loadTestimonials() {
    // Similaire à loadSolutions
}

// Parser simple pour le front matter
function parseMarkdownFrontMatter(content) {
    try {
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!match) return { attributes: {}, body: content };
        
        const frontMatter = match[1];
        const body = match[2];
        
        // Parser YAML simple (pour des besoins basiques)
        const attributes = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...values] = line.split(':');
            if (key && values.length) {
                let value = values.join(':').trim();
                
                // Gérer les tableaux
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/^['"](.*)['"]$/, '$1'));
                }
                
                // Gérer les strings
                else if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                
                attributes[key.trim()] = value;
            }
        });
        
        return { attributes, body };
    } catch (error) {
        console.error('Error parsing front matter:', error);
        return { attributes: {}, body: content };
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si marked est disponible
    if (typeof marked === 'undefined') {
        console.error('marked is not loaded');
        return;
    }
    
    loadContent();
    
    // Vos animations existantes
    initAnimations();
});

// Vos animations existantes
function initAnimations() {
    // Smooth scroll, animations, etc. (votre code existant)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Animation navbar au scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}