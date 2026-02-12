// event-driven programming
import * as multiLang from '../ext-module-i18n.js';
import * as Bootstrap from '../ext-module-bs.js';
import * as Util from '../core-module.js';
import * as FontAwesome from '../ext-module-fa.js';

/**
 * Initializes the i18n page with default locale and wires up UI controls.
 * @returns {Promise<void>} Promise that resolves when initialization is complete
 */
export default async function main() {
    console.log('[src/js/index.js] Main function execution started');

    const navElement = document.getElementById('nav');
    const footerElement = document.getElementById('footer');

    // If neither nav nor footer placeholders exist, run basic i18n and wire language switcher (wizard / simple page)
    if (!navElement && !footerElement) {
        const locale = multiLang.getBaseLocale();
        try {
            await multiLang.initI18n(locale);
            multiLang.applyTranslations('data-i18n', locale);
            console.log('[exi18n] Wizard/simple page: i18n applied.');
        } catch (error) {
            console.error('[exi18n] Error: Failed to initialize i18n:', error);
        }
        // Wire floating language switcher (wizard has i18n001, i18n002, i18n005, i18n006)
        const wizardSwitcherIds = ['i18n001', 'i18n002', 'i18n005', 'i18n006'];
        wizardSwitcherIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = el.getAttribute('value-i18n');
                    if (localeCode) multiLang.switchLanguage(localeCode);
                });
            }
        });
        return;
    }

    Util.setupWindowFocusRefresh();
    
    // Only enable button redirect if elements with class 'btn-redirect' exist
    if (document.getElementsByClassName('btn-redirect').length > 0) {
        Util.enableButtonRedirect('btn-redirect');
    }

    // Load fragments conditionally using Promises
    const navPromise = navElement ? Util.loadFragment('nav', '/static/nav.html') : Promise.resolve();

    navPromise.then(() => {
        const footerPromise = footerElement ? Util.loadFragment('footer', '/static/footer.html') : Promise.resolve();

        footerPromise.then(async () => {
            FontAwesome.initThemeIcons(['cthm001', 'cthm002']);
            document.addEventListener('click', (e) => {
                if (e.target.closest('#cthm001') || e.target.closest('#cthm002')) {
                    e.preventDefault();
                    Bootstrap.switchTheme();
                    FontAwesome.updateThemeIcons();
                }
            });

            // Enable debug mode only if the flag is present on the body
            if (document.body.getAttribute('debug-i18n') === 'true') {
                Util.enableDebugMode('debug-i18n', 'data-i18n');
            }

            // Contact form submit handler
            const contactForm = document.getElementById('contactForm');
            const contactContext = document.getElementById('contactFormContext');
            const contactContextLabel = contactContext ? contactContext.querySelector('span') : null;
            const contactModalElement = document.getElementById('contactModal');
            if (contactModalElement) {
                contactModalElement.addEventListener('show.bs.modal', (event) => {
                    const trigger = event.relatedTarget;
                    const formType = trigger?.getAttribute('data-form-type') || 'general';
                    const formLabelKey = trigger?.getAttribute('data-form-label-i18n');
                    const formLabel = formLabelKey ? multiLang.translate(formLabelKey) : trigger?.getAttribute('data-form-label');
                    const presetMap = {
                        general: 'default',
                        pi: 'pi',
                        cd: 'cd'
                    };
                    const fallbackLabelKeys = {
                        general: 'fab.generalInquiry',
                        pi: 'fab.personalInjury',
                        cd: 'fab.criminalDefense'
                    };
                    const translateFallback = (type) => {
                        const key = fallbackLabelKeys[type];
                        return key ? multiLang.translate(key) : '';
                    };
                    const inquirySelect = document.getElementById('inquiryType');
                    if (inquirySelect) {
                        inquirySelect.value = presetMap[formType] || presetMap.general;
                    }
                    if (contactContext && contactContextLabel) {
                        const fallbackLabel = translateFallback(formType) || translateFallback('general');
                        const label = formLabel || fallbackLabel;
                        contactContextLabel.textContent = label;
                        contactContext.hidden = !label;
                    }
                });
                contactModalElement.addEventListener('hidden.bs.modal', () => {
                    if (contactContext && contactContextLabel) {
                        contactContext.hidden = true;
                        contactContextLabel.textContent = '';
                    }
                });
            }
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const firstName = document.getElementById('modalFirstName').value;
                    const lastName = document.getElementById('modalLastName').value;
                    const email = document.getElementById('modalEmail').value;
                    const phone = document.getElementById('modalPhone').value;
                    const inquiryType = document.getElementById('inquiryType').value;
                    const message = document.getElementById('modalMessage').value;

                    const emailBody = `New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Inquiry Type: ${inquiryType}

Message:
${message}`;

                    const mailtoLink = `mailto:Jsuh@jslawgroup.net?subject=Contact Form Submission from ${firstName} ${lastName}&body=${encodeURIComponent(emailBody)}`;
                    window.location.href = mailtoLink;

                    // Close modal and reset form
                    const modalElement = document.getElementById('contactModal');
                    if (modalElement && window.bootstrap) {
                        const modal = window.bootstrap.Modal.getInstance(modalElement);
                        if (modal) modal.hide();
                    }
                    contactForm.reset();
                    if (contactContext && contactContextLabel) {
                        contactContext.hidden = true;
                        contactContextLabel.textContent = '';
                    }
                });
            }

            // Helper functions to safely apply styles only if element exists
            const safeStyleCard = (id) => { if (document.getElementById(id)) Bootstrap.setStyleCard(id); };
            const safeStyleArticle = (id) => { if (document.getElementById(id)) Bootstrap.setStyleArticle(id); };
            const safeStyleCentered = (id) => { if (document.getElementById(id)) Bootstrap.setStyleCentered(id); };
            const safeStyleHeader = (id) => { if (document.getElementById(id)) Bootstrap.setStyleHeader(id); };
            const safeStyleProfile = (id) => { if (document.getElementById(id)) Bootstrap.setStyleProfile(id); };
            const safeStyleContact = (id) => { if (document.getElementById(id)) Bootstrap.setStyleContact(id); };

            // Initialize with default locale (English)
            try {
                await multiLang.initI18n(multiLang.getBaseLocale());
                multiLang.applyTranslations("data-i18n", multiLang.getBaseLocale());
                
                // Apply appropriate styles after translations
                safeStyleCard('pi-content');
                safeStyleArticle('pi-article-content');
                safeStyleCard('cd-content');
                safeStyleArticle('cd-article-content');
                safeStyleCard('about-content');
                
                safeStyleCentered('careers-content');
                safeStyleHeader('team-header');
                safeStyleProfile('attorney-content');
                
                safeStyleContact('contactinfo-address');
                safeStyleContact('contactinfo-contact');
                safeStyleContact('contactinfo-hours');
            } catch (error) {
                console.error('[exi18n] Error: Failed to initialize i18n:', error);
                // Don't return, let other listeners execute
            }

            // Helper function to switch language and apply appropriate styles
            const switchLanguageWithStyles = async (localeCode) => {
                await multiLang.switchLanguage(localeCode);
                
                safeStyleCard('pi-content');
                safeStyleArticle('pi-article-content');
                safeStyleCard('cd-content');
                safeStyleArticle('cd-article-content');
                safeStyleCard('about-content');
                
                safeStyleCentered('careers-content');
                safeStyleHeader('team-header');
                safeStyleProfile('attorney-content');
                
                safeStyleContact('contactinfo-address');
                safeStyleContact('contactinfo-contact');
                safeStyleContact('contactinfo-hours');
            };

            // Wire up desktop language dropdown - English
            const enDesktop = document.getElementById('i18n001');
            if (enDesktop) {
                enDesktop.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = enDesktop.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n001" not found.');
            }

            // Wire up desktop language dropdown - Korean
            const koDesktop = document.getElementById('i18n002');
            if (koDesktop) {
                koDesktop.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = koDesktop.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n002" not found.');
            }

            // Wire up mobile language dropdown - English
            const enMobile = document.getElementById('i18n003');
            if (enMobile) {
                enMobile.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = enMobile.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n003" not found.');
            }

            // Wire up mobile language dropdown - Korean
            const koMobile = document.getElementById('i18n004');
            if (koMobile) {
                koMobile.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = koMobile.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n004" not found.');
            }

            // Wire up desktop language dropdown - Japanese
            const jaDesktop = document.getElementById('i18n005');
            if (jaDesktop) {
                jaDesktop.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = jaDesktop.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n005" not found.');
            }

            // Wire up desktop language dropdown - Spanish
            const esDesktop = document.getElementById('i18n006');
            if (esDesktop) {
                esDesktop.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = esDesktop.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n006" not found.');
            }

            // Wire up mobile language dropdown - Japanese
            const jaMobile = document.getElementById('i18n007');
            if (jaMobile) {
                jaMobile.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = jaMobile.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n007" not found.');
            }

            // Wire up mobile language dropdown - Spanish
            const esMobile = document.getElementById('i18n008');
            if (esMobile) {
                esMobile.addEventListener('click', (e) => {
                    e.preventDefault();
                    const localeCode = esMobile.getAttribute('value-i18n');
                    if (localeCode) switchLanguageWithStyles(localeCode);
                });
            } else {
                if (navElement) console.warn('[exi18n] Warning: Element with ID "i18n008" not found.');
            }
        });
    });
}

// Do not call main() here — the dispatcher (static/index.js) calls it via await module.default().