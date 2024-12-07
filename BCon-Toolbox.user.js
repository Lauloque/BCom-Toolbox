// ==UserScript==
// @name         BCom Toolbox
// @namespace    https://blender.community/*
// @version      1.0
// @description  A toolbox to insert pre-written templates in comments on blender.community.
// @author       Loïc "Lauloque" Dautry
// @match        https://blender.community/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
    'use strict';

    const MAX_HEIGHT = 400; // Max height of the toolbox in px
    const TEMPLATES_URL = 'https://raw.githubusercontent.com/L0Lock/BCom-Toolbox/refs/heads/main/templates.json';

    // Function to fetch templates from the correct JSON file using TEMPLATES_URL
    function fetchTemplates(callback) {
        fetch(TEMPLATES_URL)
            .then(response => response.json())
            .then(data => {
                // Ensure templates data is an array
                if (Array.isArray(data)) {
                    callback(data);
                } else {
                    console.error('Templates data is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching templates:', error));
    }

    function createToolbox(textarea, templates) {
        // Get the site’s background and text primary colors using CSS variables
        const style = getComputedStyle(document.documentElement);
        const backgroundColor = style.getPropertyValue('--background-primary').trim();
        const textColor = style.getPropertyValue('--text-primary').trim();

        // Create the 💬 icon
        const icon = document.createElement('span');
        icon.textContent = '💬';
        icon.style.cursor = 'pointer';
        icon.style.marginLeft = '8px';
        icon.style.color = '#0078D7';
        icon.style.fontSize = '16px';
        icon.title = 'Open template toolbox';

        // Create the toolbox container
        const toolbox = document.createElement('div');
        toolbox.style.display = 'none';
        toolbox.style.width = '100%';
        toolbox.style.maxHeight = `${MAX_HEIGHT}px`;
        toolbox.style.overflowY = 'auto';
        toolbox.style.border = '1px solid #ccc';
        toolbox.style.backgroundColor = backgroundColor; // Use background-primary
        toolbox.style.color = textColor; // Use text-primary
        toolbox.style.padding = '10px';
        toolbox.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.1)';
        toolbox.style.marginTop = '5px';

        // Create the search bar
        const searchContainer = document.createElement('div');
        searchContainer.style.display = 'flex';
        searchContainer.style.marginBottom = '10px';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search templates...';
        searchInput.style.flex = '1';
        searchInput.style.padding = '5px';

        const clearButton = document.createElement('button');
        clearButton.textContent = '❌';
        clearButton.style.marginLeft = '5px';
        clearButton.style.padding = '5px';

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearButton);
        toolbox.appendChild(searchContainer);

        // Add the templates
        const templateList = document.createElement('div');
        templates.forEach(template => {
            const templateDiv = document.createElement('div');
            templateDiv.style.borderBottom = '1px solid #ddd';
            templateDiv.style.padding = '5px 0';

            const title = document.createElement('strong');
            title.textContent = template.title;
            title.style.display = 'block';

            const body = document.createElement('div');
            body.textContent = template.body; // Show raw Markdown

            templateDiv.appendChild(title);
            templateDiv.appendChild(body);

            templateDiv.addEventListener('click', () => {
                GM_setClipboard(template.body);

                // Create the blink effect for the template text
                templateDiv.classList.add('blink-green');

                // Remove the blink effect after 1 second
                setTimeout(() => {
                    templateDiv.classList.remove('blink-green');
                }, 1000);
            });

            templateList.appendChild(templateDiv);
        });

        toolbox.appendChild(templateList);

        // Add event listeners for the icon
        icon.addEventListener('click', () => {
            toolbox.style.display = toolbox.style.display === 'none' ? 'block' : 'none';
        });

        // Add functionality to the search bar
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            Array.from(templateList.children).forEach(div => {
                const matches = div.textContent.toLowerCase().includes(searchTerm);
                div.style.display = matches ? 'block' : 'none';
            });
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });

        // Append to the page
        textarea.parentNode.insertBefore(icon, textarea.nextSibling);
        textarea.parentNode.appendChild(toolbox);
    }

    // Adding the blink effect CSS
    const style = document.createElement('style');
    style.innerHTML = `
      .blink-green {
        animation: blink-green 0.5s ease-in-out 2;
      }

      @keyframes blink-green {
        0% { color: green; }
        50% { color: transparent; }
        100% { color: green; }
      }
    `;
    document.head.appendChild(style);

    function initToolbox() {
        console.log("Initializing Toolbox...");
        fetchTemplates(templates => {
            // At this point, templates is guaranteed to be an array
            console.log(`Found ${templates.length} templates.`);

            // Start observing the DOM for dynamically added textareas
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const newTextareas = mutation.target.querySelectorAll('textarea');
                        newTextareas.forEach(textarea => {
                            if (!textarea.dataset.toolboxInitialized) {
                                createToolbox(textarea, templates);
                                textarea.dataset.toolboxInitialized = 'true'; // Mark as initialized
                            }
                        });
                    }
                }
            });

            // Configure the observer to look for added nodes
            observer.observe(document.body, { childList: true, subtree: true });

            // Also check for existing textareas on initial page load
            const existingTextareas = document.querySelectorAll('textarea');
            existingTextareas.forEach(textarea => {
                createToolbox(textarea, templates);
                textarea.dataset.toolboxInitialized = 'true';
            });
        });
    }

    // Initialize the toolbox
    initToolbox();
})();
