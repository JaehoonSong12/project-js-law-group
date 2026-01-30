// ext-module-fa.js
// Font Awesome utility functions and icon management.
// Extension module for Font Awesome icon operations and styling.

// ============================================================================
// Font Awesome Theme Icon Utilities
// ============================================================================

/**
 * Injects CSS styles for theme icons (sun/moon) that adapt to light/dark mode.
 * @param {string[]} iconIds - Array of icon button IDs to style
 * @returns {void}
 * 
 * @example
 * // Inject theme icon styles with custom IDs
 * injectThemeIconStyles(['cthm001', 'cthm002']);
 */
export function injectThemeIconStyles(iconIds) {
  // Check if styles already injected
  if (document.getElementById('fa-theme-icon-styles')) {
    return;
  }

  // Generate CSS selectors for icon IDs
  const iconSelectors = iconIds.map(id => `#${id}`).join(',\n    ');
  const iconHoverSelectors = iconIds.map(id => `#${id}:hover`).join(',\n    ');

  const style = document.createElement('style');
  style.id = 'fa-theme-icon-styles';
  style.textContent = `
    .theme-icon-light,
    .theme-icon-dark {
      transition: opacity 0.2s ease;
    }
    [data-bs-theme="light"] .theme-icon-dark,
    [data-bs-theme="dark"] .theme-icon-light {
      display: none !important;
    }
    [data-bs-theme="light"] .theme-icon-light,
    [data-bs-theme="dark"] .theme-icon-dark {
      display: inline-block !important;
    }
    ${iconSelectors} {
      border: none;
      padding: 0;
      text-decoration: none;
    }
    ${iconHoverSelectors} {
      opacity: 0.7;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Updates the visibility of theme icons based on the current theme.
 * @returns {void}
 * 
 * @example
 * // Update theme icons to match current theme
 * updateThemeIcons();
 */
export function updateThemeIcons() {
  const theme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  const isDark = theme === 'dark';
  
  document.querySelectorAll('.theme-icon-light').forEach(icon => {
    icon.style.display = isDark ? 'none' : 'inline-block';
  });
  document.querySelectorAll('.theme-icon-dark').forEach(icon => {
    icon.style.display = isDark ? 'inline-block' : 'none';
  });
}

/**
 * Sets up a MutationObserver to watch for theme changes and update icons automatically.
 * @returns {void}
 * 
 * @example
 * // Watch for theme changes and update icons
 * FontAwesome.watchThemeChanges();
 */
export function watchThemeChanges() {
  const observer = new MutationObserver(() => {
    updateThemeIcons();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-bs-theme']
  });
}

/**
 * Initializes Font Awesome theme icon functionality.
 * Injects CSS styles and sets up theme change observer.
 * @param {string[]} iconIds - Array of icon button IDs to style
 * @returns {void}
 * 
 * @example
 * import * as FontAwesome from './ext-module-fa.js';
 * 
 * // Initialize theme icons with custom IDs
 * FontAwesome.initThemeIcons(['cthm001', 'cthm002']);
 */
export function initThemeIcons(iconIds) {
  injectThemeIconStyles(iconIds);
  updateThemeIcons();
  watchThemeChanges();
}
