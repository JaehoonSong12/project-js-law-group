// js/ext-module-i18n.js
// Internationalization (i18n) module for locale management and translations.

let translations = {};


/**
 * Loads a locale JSON file from the specified directory.
 * @param {string} locale - The locale code (e.g., 'en-US', 'ko-KR', 'ja-JP')
 * @param {string} [dir='locales'] - The directory containing locale files
 * @returns {Promise<Object>} Promise that resolves to the locale data object
 * 
 * @example
 * // Load English locale from default 'locales' directory
 * const enData = await loadLocale('en-US');
 * 
 * // Load Korean locale from custom directory
 * const krData = await loadLocale('ko-KR', 'i18n');
 * 
 * @throws {Error} Throws an error if the locale file cannot be loaded
 * @throws {Error} Throws an error if the locale file format is invalid
 */
async function loadLocale(locale, dir = 'locales') {
  const url = `${dir}/${locale}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load locale file "${url}". Status: ${res.status}. Locale "${locale}" is not available.`);
  const data = await res.json();
  if (!data || typeof data !== 'object') throw new Error(`Invalid locale file format for "${locale}"`);
  return data;
}


/**
 * Switches the current locale by loading the locale file and updating translations.
 * @param {string} locale - The locale code to switch to (e.g., 'en-US', 'ko-KR', 'ja-JP')
 * @param {string} [dir='locales'] - The directory containing locale files
 * @returns {Promise<void>} Promise that resolves when the locale is switched
 * 
 * @example
 * // Switch to English locale
 * await switchLocale('en-US');
 * 
 * // Switch to Korean locale from custom directory
 * await switchLocale('ko-KR', 'i18n');
 * 
 * @throws {Error} Throws an error if the locale file cannot be loaded
 */
export async function switchLocale(locale, dir = 'locales') {
    const data = await loadLocale(locale, dir);
    translations = data || {};
    document.documentElement.lang = locale;
    try { 
      localStorage.setItem('locale', locale); 
      localStorage.setItem('localeDir', dir);
    } catch (e) {}
  }
  









/**
 * Resolves a nested object key path (e.g., "user.profile.name") to its value.
 * @param {Object} obj - The object to search in
 * @param {string} keyPath - The dot-notation key path to resolve
 * @returns {*} The value at the key path, or undefined if not found
 * 
 * @example
 * const data = { user: { profile: { name: "John" } } };
 * resolveKey(data, "user.profile.name"); // Returns "John"
 * resolveKey(data, "user.profile.age"); // Returns undefined
 */
function resolveKey(obj, keyPath) {
    if (!obj || !keyPath) return undefined;
    return keyPath.split('.').reduce((o, k) => (o && Object.prototype.hasOwnProperty.call(o, k)) ? o[k] : undefined, obj);
  }


/**
 * Translates a key to its corresponding value from the loaded locale data.
 * @param {string} translationKey - The dot-notation key path (e.g., "user.greeting")
 * @returns {string} The translated string, or the key itself if translation is not found
 * 
 * @example
 * // After loading locale data with { user: { greeting: "Hello" } }
 * translate("user.greeting"); // Returns "Hello"
 * translate("missing.key"); // Returns "missing.key"
 */
export function translate(translationKey) {
  const translationValue = resolveKey(translations, translationKey);
  if (translationValue === undefined) return translationKey;
  if (typeof translationValue === 'object') return String(translationValue);
  return String(translationValue);
}











/**
 * Applies translations to all elements with i18n attributes within the document.
 * @param {string} [i18nAttr='data-i18n'] - The attribute name for HTML translations
 * @param {string} [locale='en-US'] - The locale code to display in the locale label
 * @returns {void}
 * 
 * @example
 * // Apply translations with a custom attribute name
 * applyTranslations('data-translate', 'en-US');
 * 
 * // HTML structure needed:
 * // <p data-i18n="user.greeting">Hello</p>
 * // <div data-i18n="user.bio">Bio text</div>
 */
export function applyTranslations(i18nAttr = 'data-i18n', locale = 'en-US') {
  document.querySelectorAll(`[${i18nAttr}]`).forEach(el => {
    const key = el.getAttribute(i18nAttr);
    if (!key) return;
    const html = translate(key);
    el.innerHTML = html;
  });
}








/**
 * Switches the language by loading the locale and applying translations to the document.
 * This is a convenience function that combines switchLocale() and applyTranslations().
 * @param {string} localeCode - The locale code to switch to (e.g., 'en-US', 'ko-KR', 'ja-JP')
 * @param {string} [dir='locales'] - The directory containing locale files
 * @param {string} [i18nAttr='data-i18n'] - The attribute name for HTML translations
 * @returns {Promise<void>} Promise that resolves when the language is switched and translations are applied
 * 
 * @example
 * // Switch to English locale and apply translations
 * await switchLanguage('en-US');
 * 
 * // Switch to Korean locale from custom directory
 * await switchLanguage('ko-KR', 'i18n');
 * 
 * @throws {Error} Throws an error if the locale file cannot be loaded
 */
export async function switchLanguage(localeCode, dir = 'locales', i18nAttr = 'data-i18n') {
  try {
    await switchLocale(localeCode, dir);
    applyTranslations(i18nAttr, localeCode);
  } catch (error) {
    console.error(`[exi18n] Error: Failed to switch to locale "${localeCode}":`, error);
    throw error;
  }
}

/**
 * Initializes the i18n system by loading the specified locale.
 * @param {string} locale - The locale code to initialize with (e.g., 'en-US', 'ko-KR', 'ja-JP')
 * @param {string} [dir='locales'] - The directory containing locale files
 * @returns {Promise<void>} Promise that resolves when initialization is complete
 * 
 * @example
 * // Initialize with English locale
 * await initI18n('en-US');
 * 
 * // Initialize with Korean locale from custom directory
 * await initI18n('ko-KR', 'i18n');
 * 
 * @throws {Error} Throws an error if the locale file cannot be loaded
 */
export async function initI18n(locale, dir = 'locales') {
  await switchLocale(locale, dir);
}

/**
 * Returns the base locale code used as fallback.
 * @returns {string} The base locale code (default: 'en-US')
 * 
 * @example
 * const base = getBaseLocale(); // Returns 'en-US'
 */
export function getBaseLocale() {
  return 'en-US';
}

// here to add isDebugMode function
