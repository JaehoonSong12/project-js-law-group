// js/core-module.js
// Core utility functions and component implementations used by page modules.

// ============================================================================
// DOM Manipulation Utilities
// ============================================================================





// js/core-module.js
// Core utility functions and component implementations used by page modules.

/**
 * Setup click handler to center a section element when a button is clicked.
 * @param {string} buttonId - The ID of the button element that triggers the centering
 * @param {string} sectionId - The ID of the section element to be centered
 * @returns {void}
 * 
 * @example
 * // Setup centering for a button and section
 * clickToCenter('center-btn', 'content-section');
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   renderHeading('Welcome');
 *   
 *   // Setup centering functionality
 *   clickToCenter('center-button', 'main-content');
 * }
 * 
 * // HTML structure needed:
 * // <button id="center-button">Center Content</button>
 * // <section id="main-content">Content to be centered</section>
 * 
 * @throws {Error} Throws an error if the button element is not found
 * @throws {Error} Throws an error if the section element is not found
 */
export function clickToCenter(buttonId, sectionId) {
  // another button to center any elements by IDs
  const centerButton = document.getElementById(buttonId);
  if (!centerButton) {
      console.error(`[clickToCenter] Error: Element with ID "${buttonId}" not found in document.`);
      throw new Error(`Element with ID "${buttonId}" not found.`);
  }
  
  centerButton.addEventListener('click', () => {
      const loadedSections = document.getElementById(sectionId);
      if (!loadedSections) {
          console.error(`[clickToCenter] Error: Element with ID "${sectionId}" not found in document.`);
          throw new Error(`Element with ID "${sectionId}" not found.`);
      }
      console.log(loadedSections);
      loadedSections.style.textAlign = "center";
  });
}

/**
 * Enable redirect functionality for all elements with a specified class name.
 * When clicked, elements will navigate to their href attribute value, or 'index.html' if no href is present.
 * @param {string} className - The class name of elements to enable redirect functionality
 * @returns {void}
 * 
 * @example
 * // Enable redirect for all navigation buttons
 * enableButtonRedirect('nav-button');
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   renderHeading('Navigation');
 *   
 *   // Enable redirect for all menu items
 *   enableButtonRedirect('menu-link');
 * }
 * 
 * // HTML structure needed:
 * // <a href="/about.html" class="menu-link">About</a>
 * // <a href="/contact.html" class="menu-link">Contact</a>
 * // <a class="menu-link">Home</a> (will redirect to index.html)
 * 
 * @throws {Error} Throws an error if className is not a string
 * @throws {Error} Throws an error if no elements with the specified class are found
 */
export function enableButtonRedirect(className) {
  // Accept a class name and enable redirect functionality for all buttons with that class
  if (typeof className !== 'string') {
      console.error(`[enableButtonRedirect] Error: Expected a class name (string), but received: ${typeof className}`);
      throw new Error(`Expected a class name (string), but received: ${typeof className}`);
  }
  
  const buttons = document.getElementsByClassName(className);
  if (buttons.length === 0) {
      console.warn(`[enableButtonRedirect] Warning: No elements found with class "${className}" in document.`);
      return;
  }
  
  Array.from(buttons).forEach((button) => {
      button.addEventListener('click', () => {
          let href = button.getAttribute('href');
          if (href == null) {
              href = 'index.html';
          }
          window.location.href = href;
      });
  });
}





// ============================================================================
// Component Functions
// ============================================================================

/**
 * Fetches an HTML fragment and injects it into the page.
 * @param {string} containerId - ID of container element to fill
 * @param {string} url - Path to the HTML fragment
 * @returns {Promise<void>} Promise that resolves when fragment is loaded
 * 
 * @example
 * // Load a navigation fragment
 * await loadFragment('nav-container', './fragments/navigation.html');
 * 
 * // Load content into main area
 * await loadFragment('main-content', './fragments/article-content.html');
 * 
 * // Handle loading with error handling
 * try {
 *   await loadFragment('sidebar', './fragments/sidebar.html');
 *   console.log('Sidebar loaded successfully');
 * } catch (error) {
 *   console.error('Failed to load sidebar:', error);
 * }
 * 
 * // Load multiple fragments
 * await Promise.all([
 *   loadFragment('header', './fragments/header.html'),
 *   loadFragment('footer', './fragments/footer.html')
 * ]);
 * 
 * @throws {Error} Throws an error if the container element is not found
 */
export async function loadFragment(containerId, url) {
  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    }

    const html = await resp.text();
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`[loadFragment] Error: Element with ID "${containerId}" not found in document.`);
      throw new Error(`Element with ID "${containerId}" not found.`);
    }

    container.innerHTML = html;
  } catch (err) {
    console.error('Fragment loading error:', err);
  }
}

/**
 * Setup window focus refresh functionality.
 * Refreshes the page when the window gains focus.
 * @returns {void}
 * 
 * @example
 * // Basic usage - refresh on focus
 * setupWindowFocusRefresh();
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   // Setup other page functionality
 *   renderHeading('Welcome');
 *   
 *   // Enable auto-refresh on focus
 *   setupWindowFocusRefresh();
 * }
 * 
 * // Note: This will reload the entire page when window gains focus
 * // Use sparingly and inform users about this behavior
 */
export function setupWindowFocusRefresh() {
  window.addEventListener('focus', () => {
    location.reload();
  });
}






/**
 * Setup year element functionality.
 * @returns {void}
 * 
 * @example
 * // Basic usage - setup year element
 * setupYearElement();
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   // Setup other page functionality
 *   renderHeading('Welcome');
 *   
 *   // Setup year element
 *   setupYearElement();
 * }
 * 
 * // HTML structure needed:
 * // <span id="year"></span>
 */
export function setupYearElement() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}



/**
 * Debug function to highlight elements with a specific attribute when debug mode is enabled.
 * @param {string} debugFlagAttr - The attribute name that flags debug status (e.g., 'debug-i18n')
 * @param {string} targetAttr - The attribute to detect and display (e.g., 'data-i18n')
 * @returns {void}
 * 
 * @example
 * // Enable debug mode for i18n elements
 * enableDebugMode('debug-i18n', 'data-i18n');
 * 
 * // HTML structure needed:
 * // <body debug-i18n="true">
 * // <h1 data-i18n="hero.title">Title</h1>
 * // <p data-i18n="hero.subtitle">Subtitle</p>
 */
export function enableDebugMode(debugFlagAttr, targetAttr) {
  // Check if debug flag is set on body
  const body = document.body;
  if (!body) {
    console.error(`[enableDebugMode] Error: Body element not found.`);
    return;
  }

  const debugFlagValue = body.getAttribute(debugFlagAttr);
  
  if (debugFlagValue !== 'true') {
    console.error(`[enableDebugMode] Error: Debug flag "${debugFlagAttr}" not detected on body element. Expected value: "true", but got: "${debugFlagValue || 'undefined'}"`);
    return;
  }

  // Find all elements with the target attribute
  const elements = document.querySelectorAll(`[${targetAttr}]`);
  
  if (elements.length === 0) {
    console.warn(`[enableDebugMode] Warning: No elements found with attribute "${targetAttr}"`);
    return;
  }

  // Add border and label to each element
  elements.forEach((el) => {
    const attrValue = el.getAttribute(targetAttr);
    
    if (attrValue) {
      // Add border style
      el.style.border = '2px dashed #ff6b6b';
      el.style.position = 'relative';

      // Create and add label
      const label = document.createElement('span');
      label.textContent = attrValue;
      label.style.position = 'absolute';
      label.style.top = '-12px';
      label.style.left = '8px';
      label.style.backgroundColor = '#ff6b6b';
      label.style.color = '#ffffff';
      label.style.fontSize = '10px';
      label.style.fontWeight = 'bold';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '3px';
      label.style.zIndex = '9999';
      label.style.pointerEvents = 'none';
      label.style.whiteSpace = 'nowrap';

      // Append label to element
      el.appendChild(label);

      // Watch for innerHTML changes and re-add label
      const observer = new MutationObserver(() => {
        // Check if label still exists
        if (!el.contains(label)) {
          // Re-add label if it was removed
          el.appendChild(label);
        }
      });

      // Observe changes to the element
      observer.observe(el, {
        childList: true,
        subtree: true
      });
    }
  });

  console.log(`[enableDebugMode] Debug mode enabled for "${targetAttr}". Found ${elements.length} element(s).`);
}