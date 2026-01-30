// static/js/index247_demo2.js
import * as multiLang from '../ext-module-i18n.js';
import * as Bootstrap from '../ext-module-bs.js';
import * as Util from '../core-module.js';
import * as FontAwesome from '../ext-module-fa.js';

export default async function main() {
    console.log('[src/js/index247_demo2.js] Main function execution started');

    Util.setupWindowFocusRefresh();

    FontAwesome.initThemeIcons(['cthm001', 'cthm002']);
    document.addEventListener('click', (e) => {
        if (e.target.closest('#cthm001') || e.target.closest('#cthm002')) {
            e.preventDefault();
            Bootstrap.switchTheme();
            FontAwesome.updateThemeIcons();
        }
    });

    Util.enableDebugMode('debug-i18n', 'data-i18n');

    try {
        await multiLang.initI18n(multiLang.getBaseLocale());
        multiLang.applyTranslations("data-i18n", multiLang.getBaseLocale());
    } catch (error) {
        console.error('[tfs] Error: Failed to initialize i18n:', error);
        return;
    }
}

main();