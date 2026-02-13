// js/core-module.js
// Core utility functions and component implementations used by page modules.

// ============================================================================
// DOM Manipulation Utilities
// ============================================================================

/**
 * Setup click handler to center a section element when a button is clicked.
 * @param {string} buttonId - The ID of the button element that triggers the centering
 * @param {string} sectionId - The ID of the section element to be centered
 * @returns {void}
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
 */
export function setupWindowFocusRefresh() {
  window.addEventListener('focus', () => {
    location.reload();
  });
}

/**
 * Setup year element functionality.
 * @returns {void}
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

/**
 * Initializes flip card functionality.
 * Looks for elements with class 'flip-card-inner' and allows toggling via buttons with data-flip-target attribute.
 * @returns {void}
 */
export function enableFlipCards() {
  const triggers = document.querySelectorAll('[data-flip-target]');
  
  if (triggers.length === 0) {
    return;
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-flip-target');
      const target = document.getElementById(targetId);
      
      if (target && target.classList.contains('flip-card-inner')) {
        const action = trigger.getAttribute('data-flip-action'); // 'flip' or 'unflip' or toggle (default)
        
        if (action === 'flip') {
          target.classList.add('is-flipped');
        } else if (action === 'unflip') {
          target.classList.remove('is-flipped');
        } else {
          target.classList.toggle('is-flipped');
        }
      } else {
        console.warn(`[enableFlipCards] Target with ID "${targetId}" not found or missing "flip-card-inner" class.`);
      }
    });
  });
  
  console.log(`[enableFlipCards] Initialized ${triggers.length} flip triggers.`);
}
