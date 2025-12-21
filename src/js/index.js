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

    



    Util.setupWindowFocusRefresh();
    Util.enableButtonRedirect('btn-redirect');

    Util.loadFragment('nav', 'nav-fixed-1col2row.html').then(() => {
    Util.loadFragment('footer', 'footer-classic-office.html').then(async () => {
        FontAwesome.initThemeIcons(['cthm001', 'cthm002']);
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cthm001') || e.target.closest('#cthm002')) {
                e.preventDefault();
                Bootstrap.switchTheme();
                FontAwesome.updateThemeIcons();
            }
        });

        // Enable debug mode for i18n elements
        Util.enableDebugMode('debug-i18n', 'data-i18n');





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
        




        

        // Initialize with default locale (English)
        try {
            await multiLang.initI18n(multiLang.getBaseLocale());
            multiLang.applyTranslations("data-i18n", multiLang.getBaseLocale());
        } catch (error) {
            console.error('[exi18n] Error: Failed to initialize i18n:', error);
            return;
        }

        // Wire up desktop language dropdown - English
        const enDesktop = document.getElementById('i18n001');
        if (enDesktop) {
            enDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = enDesktop.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n001" not found.');
        }

        // Wire up desktop language dropdown - Korean
        const koDesktop = document.getElementById('i18n002');
        if (koDesktop) {
            koDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = koDesktop.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n002" not found.');
        }

        // Wire up mobile language dropdown - English
        const enMobile = document.getElementById('i18n003');
        if (enMobile) {
            enMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = enMobile.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n003" not found.');
        }

        // Wire up mobile language dropdown - Korean
        const koMobile = document.getElementById('i18n004');
        if (koMobile) {
            koMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = koMobile.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n004" not found.');
        }

        // Wire up desktop language dropdown - Japanese
        const jaDesktop = document.getElementById('i18n005');
        if (jaDesktop) {
            jaDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = jaDesktop.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n005" not found.');
        }

        // Wire up desktop language dropdown - Spanish
        const esDesktop = document.getElementById('i18n006');
        if (esDesktop) {
            esDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = esDesktop.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n006" not found.');
        }

        // Wire up mobile language dropdown - Japanese
        const jaMobile = document.getElementById('i18n007');
        if (jaMobile) {
            jaMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = jaMobile.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n007" not found.');
        }

        // Wire up mobile language dropdown - Spanish
        const esMobile = document.getElementById('i18n008');
        if (esMobile) {
            esMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = esMobile.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        } else {
            console.warn('[exi18n] Warning: Element with ID "i18n008" not found.');
        }

        console.log(multiLang.translate("careers.p1"));
        console.log(multiLang.translate("careers.p5"));
    });
    });
}