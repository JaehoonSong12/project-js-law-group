// ext-module-bs.js
// Bootstrap-specific utility functions and component implementations.
// Extension module that simplifies Bootstrap implementation.

// ============================================================================
// Bootstrap Theme Utilities
// ============================================================================

/**
 * Switch the current Bootstrap theme between light and dark.
 * @returns {void}
 * 
 * @example
 * // Switch theme (light -> dark or dark -> light)
 * switchTheme();
 */
export function switchTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Enable theme switch functionality for a checkbox/switch element.
 * @param {string} switchId - The ID of the checkbox/switch element
 * @returns {void}
 * 
 * @example
 * // Enable theme switch functionality
 * enableSwitchTheme('cb014');
 * 
 * // Use in page initialization
 * export default function initPage() {
 *   enableSwitchTheme('cb014');
 * }
 * 
 * // HTML structure needed:
 * // <input type="checkbox" id="cb014" class="form-check-input">
 * 
 * @throws {Error} Throws an error if the switch element is not found
 */
export function enableSwitchTheme(switchId) {
    const themeSwitch = document.getElementById(switchId);
    if (!themeSwitch) {
        console.error(`[enableSwitchTheme] Error: Element with ID "${switchId}" not found in document.`);
        throw new Error(`Element with ID "${switchId}" not found.`);
    }

    // Initialize theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = storedTheme || systemTheme;
    document.documentElement.setAttribute('data-bs-theme', initialTheme);

    // Set initial switch state
    themeSwitch.checked = (initialTheme === 'dark');

    // Add change event listener to switch theme
    themeSwitch.addEventListener('change', () => {
        switchTheme();
        themeSwitch.checked = (document.documentElement.getAttribute('data-bs-theme') === 'dark');
    });
}

// ============================================================================
// Bootstrap Dropdown Utilities
// ============================================================================

/**
 * Initialize Bootstrap-style dropdowns without requiring Bootstrap JS.
 * @param {string|string[]} dropdownIds - Single dropdown toggle ID or array of dropdown toggle IDs
 * @returns {void}
 * 
 * @example
 * // Initialize a single dropdown
 * initDropdown('languageDropdown');
 * 
 * // Initialize multiple dropdowns
 * initDropdown(['languageDropdown', 'languageDropdownMobile']);
 * 
 * // Use in page initialization after loading fragments
 * export default async function initPage() {
 *   await loadFragment('nav', 'nav.html');
 *   initDropdown(['languageDropdown', 'languageDropdownMobile']);
 * }
 * 
 * // HTML structure needed:
 * // <a id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">Toggle</a>
 * // <ul class="dropdown-menu" aria-labelledby="languageDropdown">
 * //   <li><a class="dropdown-item" href="#">Item 1</a></li>
 * // </ul>
 * 
 * @throws {Error} Throws an error if a dropdown toggle element is not found
 */
export function initDropdown(dropdownIds) {
    // Normalize to array
    const ids = Array.isArray(dropdownIds) ? dropdownIds : [dropdownIds];
    const dropdownToggles = [];
    
    // Find all dropdown toggles by ID
    ids.forEach(id => {
        const toggle = document.getElementById(id);
        if (!toggle) {
            console.error(`[initDropdown] Error: Element with ID "${id}" not found in document.`);
            throw new Error(`Element with ID "${id}" not found.`);
        }
        if (!toggle.hasAttribute('data-bs-toggle') || toggle.getAttribute('data-bs-toggle') !== 'dropdown') {
            console.warn(`[initDropdown] Warning: Element with ID "${id}" does not have data-bs-toggle="dropdown".`);
        }
        dropdownToggles.push(toggle);
    });
    
    if (dropdownToggles.length === 0) {
        return;
    }

    // Close all open dropdowns
    function closeAllDropdowns() {
        dropdownToggles.forEach(toggle => {
            const menu = getDropdownMenu(toggle);
            if (menu) {
                menu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Get the dropdown menu associated with a toggle
    function getDropdownMenu(toggle) {
        const toggleId = toggle.id;
        if (toggleId) {
            // Menu has aria-labelledby pointing to toggle's id
            const menu = document.querySelector(`[aria-labelledby="${toggleId}"]`);
            if (menu && menu.classList.contains('dropdown-menu')) {
                return menu;
            }
        }
        // Fallback: find the next sibling dropdown-menu
        let sibling = toggle.nextElementSibling;
        while (sibling) {
            if (sibling.classList.contains('dropdown-menu')) {
                return sibling;
            }
            sibling = sibling.nextElementSibling;
        }
        // Fallback: find parent dropdown and then menu
        const parentDropdown = toggle.closest('.dropdown');
        if (parentDropdown) {
            return parentDropdown.querySelector('.dropdown-menu');
        }
        return null;
    }

    // Handle toggle click
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const menu = getDropdownMenu(toggle);
            if (!menu) {
                console.warn('[initDropdown] Warning: Dropdown menu not found for toggle:', toggle);
                return;
            }

            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            // Close all dropdowns first
            closeAllDropdowns();
            
            // Toggle this dropdown
            if (!isExpanded) {
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close dropdowns when clicking outside (only add listener once)
    if (!document._dropdownClickHandler) {
        document._dropdownClickHandler = (e) => {
            const clickedToggle = e.target.closest('[data-bs-toggle="dropdown"]');
            const clickedMenu = e.target.closest('.dropdown-menu');
            const clickedItem = e.target.closest('.dropdown-item');
            
            // Don't close if clicking on toggle or menu items
            if (!clickedToggle && !clickedMenu && !clickedItem) {
                // Close all registered dropdowns
                document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(toggle => {
                    const menu = document.querySelector(`[aria-labelledby="${toggle.id}"]`);
                    if (menu && menu.classList.contains('dropdown-menu')) {
                        menu.classList.remove('show');
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        };
        document.addEventListener('click', document._dropdownClickHandler);
    }

    // Close dropdowns when clicking on dropdown items
    dropdownToggles.forEach(toggle => {
        const menu = getDropdownMenu(toggle);
        if (menu) {
            menu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    // Small delay to allow item click handlers to execute first
                    setTimeout(() => {
                        closeAllDropdowns();
                    }, 100);
                });
            });
        }
    });
}

/**
 * Initialize Bootstrap-style collapse functionality without requiring Bootstrap JS.
 * @param {string|string[]} collapseIds - Single collapse toggle ID or array of collapse toggle IDs
 * @returns {void}
 * 
 * @example
 * // Initialize a single collapse
 * initCollapse('navbarToggler');
 * 
 * // Initialize multiple collapses
 * initCollapse(['navbarToggler', 'sidebarToggler']);
 * 
 * // Use in page initialization after loading fragments
 * export default async function initPage() {
 *   await loadFragment('nav', 'nav.html');
 *   initCollapse('navbarToggler');
 * }
 * 
 * // HTML structure needed:
 * // <button id="navbarToggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">Toggle</button>
 * // <div id="navbarNav" class="collapse">Content</div>
 * 
 * @throws {Error} Throws an error if a collapse toggle element is not found
 */
export function initCollapse(collapseIds) {
    // Normalize to array
    const ids = Array.isArray(collapseIds) ? collapseIds : [collapseIds];
    const collapseToggles = [];
    
    // Find all collapse toggles by ID or by data-bs-target
    ids.forEach(id => {
        let toggle = document.getElementById(id);
        if (!toggle) {
            // Try to find by data-bs-target attribute if ID not found (id might be the target ID)
            toggle = document.querySelector(`[data-bs-target="#${id}"]`);
        }
        if (!toggle) {
            console.error(`[initCollapse] Error: Element with ID "${id}" or data-bs-target="#${id}" not found in document.`);
            throw new Error(`Element with ID "${id}" or data-bs-target="#${id}" not found.`);
        }
        if (!toggle.hasAttribute('data-bs-toggle') || toggle.getAttribute('data-bs-toggle') !== 'collapse') {
            console.warn(`[initCollapse] Warning: Element does not have data-bs-toggle="collapse".`);
        }
        collapseToggles.push(toggle);
    });
    
    if (collapseToggles.length === 0) {
        return;
    }

    // Get the collapse element associated with a toggle
    function getCollapseElement(toggle) {
        const target = toggle.getAttribute('data-bs-target');
        if (target) {
            // Remove # if present
            const targetId = target.startsWith('#') ? target.slice(1) : target;
            const collapseElement = document.getElementById(targetId);
            if (collapseElement) {
                return collapseElement;
            }
        }
        return null;
    }

    // Handle toggle click
    collapseToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const collapseElement = getCollapseElement(toggle);
            if (!collapseElement) {
                console.warn('[initCollapse] Warning: Collapse element not found for toggle:', toggle);
                return;
            }

            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const isShowing = collapseElement.classList.contains('show');
            
            // Toggle collapse (Bootstrap uses 'collapse' class with 'show' to expand)
            if (!isShowing || !isExpanded) {
                collapseElement.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                collapseElement.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close collapse when clicking outside the menu or on nav links (but not on menu buttons/controls)
    if (!document._collapseClickHandler) {
        document._collapseClickHandler = (e) => {
            collapseToggles.forEach(toggle => {
                const collapseElement = getCollapseElement(toggle);
                if (!collapseElement) return;

                // Don't close if clicking on the toggle button itself
                if (toggle.contains(e.target)) {
                    return;
                }

                // Check if clicking inside the collapse element (menu area)
                if (collapseElement.contains(e.target)) {
                    // Don't close if clicking on buttons, dropdown toggles, or theme toggles
                    const isButton = e.target.closest('button');
                    const isDropdownToggle = e.target.closest('[data-bs-toggle="dropdown"]');
                    const isThemeToggle = e.target.closest('#cthm001, #cthm002');
                    const isDropdownMenu = e.target.closest('.dropdown-menu');
                    
                    // Keep menu open if clicking on buttons/controls
                    if (isButton || isDropdownToggle || isThemeToggle || isDropdownMenu) {
                        return;
                    }
                    
                    // Close menu if clicking on regular nav links
                    const isNavLink = e.target.closest('.nav-link');
                    if (isNavLink) {
                        if (collapseElement.classList.contains('show')) {
                            collapseElement.classList.remove('show');
                            toggle.setAttribute('aria-expanded', 'false');
                        }
                        return;
                    }
                } else {
                    // Clicking outside the menu - close it
                    if (collapseElement.classList.contains('show')) {
                        collapseElement.classList.remove('show');
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        };
        document.addEventListener('click', document._collapseClickHandler);
    }
}