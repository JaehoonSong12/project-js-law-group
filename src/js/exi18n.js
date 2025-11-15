// event-driven programming
import * as multiLang from '../ext-module-i18n.js';

/**
 * Initializes the i18n page with default locale and wires up UI controls.
 * @returns {Promise<void>} Promise that resolves when initialization is complete
 */
export default async function main() {
    // Initialize with default locale (English)
    try {
        await multiLang.initI18n(multiLang.getBaseLocale() );
        multiLang.applyTranslations("data-i18n", multiLang.getBaseLocale());
    } catch (error) {
        console.error('[exi18n] Error: Failed to initialize i18n:', error);
        return;
    }


    


    // Wire up English button
    const enButton = document.getElementById('i18n001');
    if (enButton) {
        enButton.addEventListener('click', async () => {
            try {
                await multiLang.switchLocale('en-US');
                multiLang.applyTranslations("data-i18n", 'en-US');
            } catch (error) {
                console.error('[exi18n] Error: Failed to switch to English locale', error);
            }
        });
    } else {
        console.warn(`[exi18n] Warning: Element with ID "i18n001" not found.`);
    }

    // Wire up Korean button
    const krButton = document.getElementById('i18n002');
    if (krButton) {
        krButton.addEventListener('click', async () => {
            try {
                await multiLang.switchLocale('ko-KR');
                multiLang.applyTranslations("data-i18n", 'ko-KR');
            } catch (error) {
                console.error('[exi18n] Error: Failed to switch to Korean locale', error);
            }
        });
    } else {
        console.warn(`[exi18n] Warning: Element with ID "i18n002" not found.`);
    }

    // Wire up Japanese button
    const jaButton = document.getElementById('i18n005');
    if (jaButton) {
        jaButton.addEventListener('click', async () => {
            try {
                await multiLang.switchLocale('ja-JP');
                multiLang.applyTranslations("data-i18n", 'ja-JP');
            } catch (error) {
                console.error('[exi18n] Error: Failed to switch to Japanese locale', error);
            }
        });
    } else {
        console.warn(`[exi18n] Warning: Element with ID "i18n005" not found.`);
    }

    // Wire up Auto button
    const autoButton = document.getElementById('i18n003');
    if (autoButton) {
        autoButton.addEventListener('click', async () => {
            try {
                const nav = navigator.language || navigator.userLanguage || multiLang.getBaseLocale();
                // Try to load navigator language, if it fails, fall back to base locale
                try {
                    await multiLang.switchLocale(nav);
                    multiLang.applyTranslations("data-i18n", nav);
                } catch (error) {
                    // Navigator language not available, use base locale
                    const base = multiLang.getBaseLocale();
                    await multiLang.switchLocale(base);
                    multiLang.applyTranslations("data-i18n", base);
                }
            } catch (error) {
                console.error('[exi18n] Error: Failed to switch to auto-detected locale', error);
            }
        });
    } else {
        console.warn(`[exi18n] Warning: Element with ID "i18n003" not found.`);
    }









    
    // Wire up select dropdown
    const select = document.getElementById('i18n004');
    if (select) {
        select.value = multiLang.getBaseLocale();
        select.addEventListener('change', async (e) => {
            try {
                await multiLang.switchLocale(e.target.value);
                multiLang.applyTranslations("data-i18n", e.target.value);
            } catch (error) {
                console.error('[exi18n] Error: Failed to switch locale from select', error);
            }
        });
    } else {
        console.warn(`[exi18n] Warning: Element with ID "i18n004" not found.`);
    }
}