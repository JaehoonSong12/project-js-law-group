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

// ============================================================================
// Content Styling Functions
// ============================================================================

/**
 * Dynamically applies Bootstrap classes to article content elements.
 * For long-form article content with headings, paragraphs, blockquotes, etc.
 * @param {string} articleId - The ID of the container element containing the article content
 * @returns {void}
 * 
 * @example
 * // Apply article styles
 * setStyleArticle('pi-article-content');
 */
export function setStyleArticle(articleId) {
    const article = document.getElementById(articleId);
    if (!article) {
        console.error(`[setStyleArticle] Error: Element with ID "${articleId}" not found in document.`);
        throw new Error(`Element with ID "${articleId}" not found.`);
    }

    // Style headings
    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        const tag = heading.tagName.toLowerCase();
        heading.classList.remove('fw-bold', 'fw-normal', 'text-primary', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        
        if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
            heading.classList.add('fw-bold', 'mb-4');
        } else if (tag === 'h4' || tag === 'h5') {
            heading.classList.add('text-primary', 'mb-3');
        } else {
            heading.classList.add('fw-bold', 'mb-2');
        }
    });

    // Style paragraphs
    const paragraphs = article.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        p.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        if (!p.classList.contains('text-primary') && !p.classList.contains('text-danger') && 
            !p.classList.contains('text-success') && !p.classList.contains('text-warning')) {
            p.classList.add('text-muted');
        }
        if (index === paragraphs.length - 1) {
            p.classList.add('mb-0');
        } else {
            p.classList.add('mb-3');
        }
    });

    // Style lists
    const lists = article.querySelectorAll('ul, ol');
    lists.forEach(list => {
        list.classList.add('text-muted', 'mb-3');
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            if (!item.classList.contains('mb-2')) {
                item.classList.add('mb-2');
            }
        });
    });

    // Style blockquotes
    const blockquotes = article.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
        blockquote.classList.add('border-start', 'border-primary', 'border-3', 'ps-3', 'py-2', 'mb-3', 'fst-italic');
    });

    // Style links
    const links = article.querySelectorAll('a');
    links.forEach(link => {
        if (!link.classList.contains('btn') && !link.classList.contains('nav-link')) {
            link.classList.add('text-primary', 'text-decoration-none');
        }
    });

    // Style horizontal rules
    const hrElements = article.querySelectorAll('hr');
    hrElements.forEach(hr => {
        hr.classList.add('my-4');
    });
}

/**
 * Dynamically applies Bootstrap classes to card-like content sections.
 * For sections with title, description, and feature lists (like pi, cd, about).
 * @param {string} cardId - The ID of the container element
 * @returns {void}
 * 
 * @example
 * // Apply card styles
 * setStyleCard('pi-content');
 */
export function setStyleCard(cardId) {
    const card = document.getElementById(cardId);
    if (!card) {
        console.error(`[setStyleCard] Error: Element with ID "${cardId}" not found in document.`);
        throw new Error(`Element with ID "${cardId}" not found.`);
    }

    // Style headings (h2 for card titles) - preserve existing classes where appropriate
    const headings = card.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        const tag = heading.tagName.toLowerCase();
        // Only remove margin classes, preserve font-weight and color if already set
        heading.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        
        if (tag === 'h2') {
            if (!heading.classList.contains('fw-bold') && !heading.classList.contains('fw-normal')) {
                heading.classList.add('fw-bold');
            }
            heading.classList.add('mb-3');
        } else if (tag === 'h3' || tag === 'h4' || tag === 'h5') {
            if (!heading.classList.contains('fw-bold') && !heading.classList.contains('fw-normal')) {
                heading.classList.add('fw-bold');
            }
            heading.classList.add('mb-2');
        }
    });

    // Style paragraphs (descriptions)
    const paragraphs = card.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        p.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        p.classList.add('text-muted');
        if (index === paragraphs.length - 1) {
            p.classList.add('mb-4');
        } else {
            p.classList.add('mb-3');
        }
    });

    // Style lists (feature lists) - add Bootstrap classes and style icons
    const lists = card.querySelectorAll('ul, ol');
    lists.forEach(list => {
        // Add Bootstrap classes for lists
        list.classList.add('list-unstyled', 'text-muted', 'fs-5');
        
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            // Add margin to list items
            item.classList.add('mb-2');
            
            // Style checkmark icons if present
            const icons = item.querySelectorAll('i.fa-check-circle, i.fa-solid.fa-check-circle');
            icons.forEach(icon => {
                icon.classList.add('text-primary', 'me-2');
            });
        });
    });

    // Style links
    const links = card.querySelectorAll('a');
    links.forEach(link => {
        if (!link.classList.contains('btn') && !link.classList.contains('nav-link')) {
            link.classList.add('text-primary', 'text-decoration-none');
        }
    });
}

/**
 * Dynamically applies Bootstrap classes to header sections.
 * For simple title + subtitle sections (like partners-header, team-header).
 * @param {string} headerId - The ID of the container element
 * @returns {void}
 * 
 * @example
 * // Apply header styles
 * setStyleHeader('partners-header');
 */
export function setStyleHeader(headerId) {
    const header = document.getElementById(headerId);
    if (!header) {
        console.error(`[setStyleHeader] Error: Element with ID "${headerId}" not found in document.`);
        throw new Error(`Element with ID "${headerId}" not found.`);
    }

    // Style headings (title)
    const headings = header.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        const tag = heading.tagName.toLowerCase();
        heading.classList.remove('fw-bold', 'fw-normal', 'text-primary', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'display-5');
        
        if (tag === 'h2') {
            heading.classList.add('display-5', 'fw-bold');
        } else {
            heading.classList.add('fw-bold');
        }
    });

    // Style paragraphs (subtitle)
    const paragraphs = header.querySelectorAll('p');
    paragraphs.forEach((p) => {
        p.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'lead');
        p.classList.add('lead', 'text-muted');
    });
}

/**
 * Dynamically applies Bootstrap classes to contact info sections.
 * For contact boxes with h5 headings and content (like address, contact, hours).
 * @param {string} contactId - The ID of the container element
 * @returns {void}
 * 
 * @example
 * // Apply contact styles
 * setStyleContact('contactinfo-address');
 */
export function setStyleContact(contactId) {
    const contact = document.getElementById(contactId);
    if (!contact) {
        console.error(`[setStyleContact] Error: Element with ID "${contactId}" not found in document.`);
        throw new Error(`Element with ID "${contactId}" not found.`);
    }

    // Style h5 headings
    const headings = contact.querySelectorAll('h5');
    headings.forEach((heading) => {
        heading.classList.remove('fw-bold', 'fw-normal', 'text-primary', 'mb-0', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        heading.classList.add('fw-bold', 'mb-0');
    });

    // Style paragraphs and divs (content)
    const contentElements = contact.querySelectorAll('p, div');
    contentElements.forEach((el) => {
        if (el.tagName.toLowerCase() === 'p') {
            el.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
            el.classList.add('text-muted', 'mb-0');
        }
    });

    // Style links
    const links = contact.querySelectorAll('a');
    links.forEach(link => {
        if (!link.classList.contains('btn') && !link.classList.contains('nav-link')) {
            link.classList.add('text-primary', 'text-decoration-none');
        }
    });
}

/**
 * Dynamically applies Bootstrap classes to profile/attorney sections.
 * For sections with h3 name, h5 title, and paragraphs.
 * @param {string} profileId - The ID of the container element
 * @returns {void}
 * 
 * @example
 * // Apply profile styles
 * setStyleProfile('attorney-content');
 */
export function setStyleProfile(profileId) {
    const profile = document.getElementById(profileId);
    if (!profile) {
        console.error(`[setStyleProfile] Error: Element with ID "${profileId}" not found in document.`);
        throw new Error(`Element with ID "${profileId}" not found.`);
    }

    // Style h3 (name)
    const h3s = profile.querySelectorAll('h3');
    h3s.forEach((h3) => {
        h3.classList.remove('fw-bold', 'fw-normal', 'text-primary', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        h3.classList.add('fw-bold', 'mb-2');
    });

    // Style h5 (title)
    const h5s = profile.querySelectorAll('h5');
    h5s.forEach((h5) => {
        h5.classList.remove('fw-bold', 'fw-normal', 'text-primary', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        h5.classList.add('text-primary', 'mb-3');
    });

    // Style paragraphs
    const paragraphs = profile.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        p.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        p.classList.add('text-muted');
        if (index === paragraphs.length - 1) {
            p.classList.add('mb-0');
        } else {
            p.classList.add('mb-3');
        }
    });

    // Style links
    const links = profile.querySelectorAll('a');
    links.forEach(link => {
        if (!link.classList.contains('btn') && !link.classList.contains('nav-link')) {
            link.classList.add('text-primary', 'text-decoration-none');
        }
    });
}

/**
 * Dynamically applies Bootstrap classes to centered text sections.
 * For sections like careers with centered paragraphs.
 * @param {string} centeredId - The ID of the container element
 * @returns {void}
 * 
 * @example
 * // Apply centered styles
 * setStyleCentered('careers-content');
 */
export function setStyleCentered(centeredId) {
    const centered = document.getElementById(centeredId);
    if (!centered) {
        console.error(`[setStyleCentered] Error: Element with ID "${centeredId}" not found in document.`);
        throw new Error(`Element with ID "${centeredId}" not found.`);
    }

    // Style headings
    const headings = centered.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        heading.classList.remove('fw-bold', 'fw-normal', 'text-primary', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        heading.classList.add('fw-bold', 'mb-4');
    });

    // Style paragraphs
    const paragraphs = centered.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        p.classList.remove('mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');
        p.classList.add('text-muted');
        if (index === paragraphs.length - 1) {
            p.classList.add('mb-0');
        } else {
            p.classList.add('mb-3');
        }
    });

    // Style links
    const links = centered.querySelectorAll('a');
    links.forEach(link => {
        if (!link.classList.contains('btn') && !link.classList.contains('nav-link')) {
            link.classList.add('text-primary', 'text-decoration-none');
        }
    });
}