// Chargeur de contenu dynamique complet
class ContentLoader {
    constructor() {
        this.parser = window.marked || null;
    }

  // Parse le front matter YAML
    parseFrontMatter(content) {
        const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(regex);
        
        if (!match) {
            console.warn('⚠️ Pas de front matter trouvé');
            return { data: {}, content: content };
        }

        const frontMatterText = match[1];
        const body = match[2];
        const data = {};

        frontMatterText.split('\n').forEach(line => {
            if (!line.trim()) return;
            
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) return;
            
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Enlever les guillemets
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Remplacer \n par de vrais retours
            value = value.replace(/\\n/g, '\n');
            
            data[key] = value;
            
            // 🔍 DEBUG
            console.log(`  ✓ ${key}: "${value}"`);
        });

        console.log('📦 Données parsées:', data);
        return { data, content: body };
    }

    // Charge un fichier markdown
    async loadMarkdown(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${path}`);
            }
            const text = await response.text();
            return this.parseFrontMatter(text);
        } catch (error) {
            console.error(`❌ Erreur chargement ${path}:`, error);
            return null;
        }
    }

    // Convertit Markdown simple en HTML
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Gras **texte**
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italique *texte*
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Listes à puces (lignes commençant par -)
        const lines = html.split('\n');
        let inList = false;
        let result = [];
        
        lines.forEach(line => {
            if (line.trim().startsWith('- ')) {
                if (!inList) {
                    result.push('<ul class="expertise-list">');
                    inList = true;
                }
                const text = line.trim().substring(2);
                result.push(`<li><i class="fas fa-check-circle"></i><span>${text}</span></li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (line.trim()) {
                    result.push(`<p class="mb-4">${line}</p>`);
                }
            }
        });
        
        if (inList) {
            result.push('</ul>');
        }
        
        return result.join('\n');
    }

    // Charge Hero
    async loadHero() {
        const hero = await this.loadMarkdown('/content/hero.md');
        if (!hero) return;

        const { data } = hero;
        
        const titleEl = document.querySelector('.hero h1');
        if (titleEl && data.title) {
            titleEl.textContent = data.title;
        }

        const subtitleEl = document.querySelector('.hero .tagline');
        if (subtitleEl && data.subtitle) {
            subtitleEl.textContent = data.subtitle;
        }

        const contentEl = document.querySelector('.hero-text');
        if (contentEl && data.welcome_text) {
            contentEl.innerHTML = this.markdownToHtml(data.welcome_text);
        }

        const buttonEl = document.querySelector('.hero .btn-corporate');
        if (buttonEl && data.button_text) {
            buttonEl.innerHTML = `${data.button_text} <i class="fas fa-arrow-right ms-2"></i>`;
        }

        console.log('✅ Hero chargé');
    }

    // Charge About
    async loadAbout() {
        const about = await this.loadMarkdown('/content/about.md');
        if (!about) return;

        const { data, content } = about;

        // Titre principal
        const titleEl = document.querySelector('#about .section-title h2');
        if (titleEl && data.title) {
            titleEl.textContent = data.title;
        }

        // Sous-titre
        const subtitleEl = document.querySelector('#about .section-title p');
        if (subtitleEl && data.subtitle) {
            subtitleEl.textContent = data.subtitle;
        }

        // Titre de section
        const sectionTitleEl = document.querySelector('#about h3');
        if (sectionTitleEl && data.section_title) {
            sectionTitleEl.textContent = data.section_title;
        }

        // Liste d'expertises
        const listEl = document.querySelector('#about .expertise-list');
        if (listEl && content) {
            listEl.outerHTML = this.markdownToHtml(content);
        }

        // Citation
        const quoteEl = document.querySelector('#about .lead');
        if (quoteEl && data.quote) {
            quoteEl.textContent = `"${data.quote}"`;
        }

        console.log('✅ About chargé');
    }

    // Charge Stats
    async loadStats() {
        const stats = await this.loadMarkdown('/content/stats.md');
        if (!stats) return;

        const { data } = stats;

        // Stat 1
        const stat1Num = document.querySelector('.stats-section .stat-item:nth-child(1) .stat-number');
        const stat1Label = document.querySelector('.stats-section .stat-item:nth-child(1) .stat-label');
        if (stat1Num && data.stat1_number) stat1Num.textContent = data.stat1_number;
        if (stat1Label && data.stat1_label) stat1Label.textContent = data.stat1_label;

        // Stat 2
        const stat2Num = document.querySelector('.stats-section .stat-item:nth-child(2) .stat-number');
        const stat2Label = document.querySelector('.stats-section .stat-item:nth-child(2) .stat-label');
        if (stat2Num && data.stat2_number) stat2Num.textContent = data.stat2_number;
        if (stat2Label && data.stat2_label) stat2Label.textContent = data.stat2_label;

        // Stat 3
        const stat3Num = document.querySelector('.stats-section .stat-item:nth-child(3) .stat-number');
        const stat3Label = document.querySelector('.stats-section .stat-item:nth-child(3) .stat-label');
        if (stat3Num && data.stat3_number) stat3Num.textContent = data.stat3_number;
        if (stat3Label && data.stat3_label) stat3Label.textContent = data.stat3_label;

        // Stat 4
        const stat4Num = document.querySelector('.stats-section .stat-item:nth-child(4) .stat-number');
        const stat4Label = document.querySelector('.stats-section .stat-item:nth-child(4) .stat-label');
        if (stat4Num && data.stat4_number) stat4Num.textContent = data.stat4_number;
        if (stat4Label && data.stat4_label) stat4Label.textContent = data.stat4_label;

        console.log('✅ Stats chargées');
    }

    // Charge Solutions
    async loadSolutions() {
        const solutionFiles = [
            'charging-stations.md',
            'smart-grid.md',
            'solar-solutions.md',
            'electrical-cabinets.md',
            'industrial-cabinets.md'
        ];

        const solutions = [];
        
        for (const file of solutionFiles) {
            const solution = await this.loadMarkdown(`/content/solutions/${file}`);
            if (solution) {
                solutions.push({
                    ...solution.data,
                    content: solution.content,
                    filename: file
                });
            }
        }

        if (solutions.length === 0) {
            console.warn('⚠️ Aucune solution trouvée');
            return;
        }

        solutions.sort((a, b) => (parseInt(a.order) || 999) - (parseInt(b.order) || 999));
        this.renderSolutions(solutions);
        
        console.log(`✅ ${solutions.length} solutions chargées`);
    }

    // Génère le HTML des solutions
    renderSolutions(solutions) {
        const container = document.querySelector('#solutions .container');
        if (!container) return;

        const sectionTitle = container.querySelector('.section-title');
        container.innerHTML = '';
        if (sectionTitle) {
            container.appendChild(sectionTitle);
        }

        solutions.forEach((solution, index) => {
            const isReversed = index % 2 === 1;
            const solutionHTML = this.createSolutionHTML(solution, isReversed);
            container.insertAdjacentHTML('beforeend', solutionHTML);
        });
    }

    // Crée le HTML d'une solution
    createSolutionHTML(solution, reversed) {
        const icon = solution.icon || 'fa-cog';
        const title = solution.title || 'Solution';
        const image = solution.image || null;  // ⭐ RÉCUPÈRE L'IMAGE
        const html = this.markdownToHtml(solution.content || '');

        // 🔍 DEBUG (optionnel, tu peux l'enlever après)
        console.log('🖼️ Solution:', title, '| Image:', image);

        // ⭐ AFFICHE L'IMAGE SI ELLE EXISTE, SINON L'ICÔNE
        const visualContent = image 
            ? `<img src="${image}" alt="${title}" class="solution-image-photo">`
            : `<i class="fas ${icon}"></i>`;

        return `
            <div class="row mb-5">
                <div class="col-lg-6 ${reversed ? 'order-lg-2' : ''}">
                    <div class="solution-image">
                        ${visualContent}
                    </div>
                </div>
                <div class="col-lg-6 ${reversed ? 'order-lg-1' : ''}">
                    <div class="solution-card">
                        <div class="solution-icon">
                            <i class="fas ${icon}"></i>
                        </div>
                        <h3>${title}</h3>
                        ${html}
                    </div>
                </div>
            </div>
        `;
    }

    // Charge Contact
    async loadContact() {
        const contact = await this.loadMarkdown('/content/contact.md');
        if (!contact) return;

        const { data } = contact;

        const titleEl = document.querySelector('#contact .section-title h2');
        if (titleEl && data.title) {
            titleEl.textContent = data.title;
        }

        const subtitleEl = document.querySelector('#contact .section-title p');
        if (subtitleEl && data.subtitle) {
            subtitleEl.textContent = data.subtitle;
        }

        const ctaTitleEl = document.querySelector('#contact .solution-card h3');
        if (ctaTitleEl && data.cta_title) {
            ctaTitleEl.textContent = data.cta_title;
        }

        const ctaTextEl = document.querySelector('#contact .solution-card > p:first-of-type');
        if (ctaTextEl && data.cta_text) {
            ctaTextEl.textContent = data.cta_text;
        }

        const emailEl = document.querySelector('#contact .btn-corporate');
        if (emailEl && data.email) {
            emailEl.innerHTML = `<i class="fas fa-envelope me-2"></i> ${data.email}`;
            emailEl.href = `mailto:${data.email}`;
        }

        const messageEl = document.querySelector('#contact .text-muted');
        if (messageEl && data.message) {
            messageEl.textContent = data.message;
        }

        console.log('✅ Contact chargé');
    }

    // Charge Footer
    async loadFooter() {
        const footer = await this.loadMarkdown('/content/footer.md');
        if (!footer) return;

        const { data } = footer;

        const companyNameEl = document.querySelector('footer h5:first-of-type');
        if (companyNameEl && data.company_name) {
            companyNameEl.textContent = data.company_name;
        }

        const taglineEl = document.querySelector('footer .col-lg-4:first-child p:first-of-type');
        if (taglineEl && data.tagline) {
            taglineEl.textContent = data.tagline;
        }

        const descEl = document.querySelector('footer .col-lg-4:first-child p:nth-of-type(2)');
        if (descEl && data.description) {
            descEl.textContent = data.description;
        }

        const emailEl = document.querySelector('footer .col-lg-4:nth-child(3) p');
        if (emailEl && data.email) {
            emailEl.innerHTML = `<i class="fas fa-envelope me-2"></i> ${data.email}`;
        }

        const copyrightEl = document.querySelector('footer .text-center');
        if (copyrightEl && data.copyright) {
            copyrightEl.textContent = `© ${data.copyright}`;
        }

        console.log('✅ Footer chargé');
    }

    // Initialise tout le contenu dynamique
    async init() {
        console.log('🚀 Chargement du contenu dynamique...');
        
        await this.loadHero();
        await this.loadAbout();
        await this.loadStats();
        await this.loadSolutions();
        await this.loadContact();
        await this.loadFooter();
        
        console.log('✅ Tout le contenu est chargé !');
    }
}

// Auto-initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const loader = new ContentLoader();
        loader.init();
    });
} else {
    const loader = new ContentLoader();
    loader.init();
}