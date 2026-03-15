// Internationalization (i18n) Module for Crime Reporting System

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = window.translations || {};
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Set language and update page
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not found`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updatePageContent();
        this.updateLanguageSelector();
    }

    // Get translation for a key
    t(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        if (!translation) {
            console.warn(`Translation not found for key: ${key} in language: ${this.currentLanguage}`);
            return this.translations['en']?.[key] || key;
        }
        return translation;
    }

    // Update all elements with data-i18n attribute
    updatePageContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Update based on element type
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.value = translation;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                // Preserve any icons or HTML structure
                const icon = element.querySelector('i');
                if (icon) {
                    element.innerHTML = '';
                    element.appendChild(icon.cloneNode(true));
                    element.appendChild(document.createTextNode(' ' + translation));
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update page title if it has data-i18n-title
        const titleElement = document.querySelector('[data-i18n-title]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n-title');
            document.title = this.t(key);
        }
    }

    // Update language selector active state
    updateLanguageSelector() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Initialize language selector in navbar
    initLanguageSelector(navbarElement) {
        const selectorHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-globe"></i> <span id="current-lang-text">${this.getLanguageName(this.currentLanguage)}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                    <li>
                        <a class="dropdown-item lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}" 
                           href="#" data-lang="en">
                            🇬🇧 English
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item lang-btn ${this.currentLanguage === 'te' ? 'active' : ''}" 
                           href="#" data-lang="te">
                            🇮🇳 తెలుగు (Telugu)
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item lang-btn ${this.currentLanguage === 'hi' ? 'active' : ''}" 
                           href="#" data-lang="hi">
                            🇮🇳 हिंदी (Hindi)
                        </a>
                    </li>
                </ul>
            </li>
        `;

        // Insert before the last nav item (usually logout or register)
        const navList = navbarElement.querySelector('.navbar-nav');
        if (navList) {
            const lastItem = navList.lastElementChild;
            if (lastItem) {
                lastItem.insertAdjacentHTML('beforebegin', selectorHTML);
            } else {
                navList.innerHTML = selectorHTML;
            }
        }

        // Add event listeners to language buttons
        this.attachLanguageListeners();
    }

    // Get display name for language
    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'te': 'తెలుగు',
            'hi': 'हिंदी'
        };
        return names[lang] || 'English';
    }

    // Attach click listeners to language buttons
    attachLanguageListeners() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);

                // Update the dropdown text
                const currentLangText = document.getElementById('current-lang-text');
                if (currentLangText) {
                    currentLangText.textContent = this.getLanguageName(lang);
                }
            });
        });
    }

    // Initialize i18n on page load
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updatePageContent();
            });
        } else {
            this.updatePageContent();
        }
    }
}

// Create global i18n instance
const i18n = new I18n();

// Auto-initialize
i18n.init();

// Expose globally for easy access
window.i18n = i18n;
window.t = (key) => i18n.t(key);
