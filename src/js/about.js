// js/pages/about.js
import * as Util from '../core-module.js';
import * as Bootstrap from '../ext-module-bs.js';

export default function initAbout() {
  Util.loadFragment('nav', 'nav-classic.html');
  Util.loadFragment('footer', 'footer-vector.html').then(() => {
    if (document.getElementById('cb014')) Bootstrap.enableSwitchTheme('cb014');
    if (document.getElementsByClassName('btn-redirect').length > 0) Util.enableButtonRedirect('btn-redirect');
    Util.setupYearElement();
  });
  Util.setupWindowFocusRefresh();
}