// ==UserScript==
// @name         BCom Toolbox
// @namespace    https://blender.community/*
// @version      1.1
// @description  A toolbox to insert pre-written templates in comments on blender.community.
// @author       Loïc "Lauloque" Dautry
// @match        https://blender.community/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    const MAX_HEIGHT = 400; // Max height of the toolbox in px
    const TEMPLATES_URL = 'https://raw.githubusercontent.com/L0Lock/BCom-Toolbox/refs/heads/main/templates.json';

    // Function to fetch templates
    function fetchTemplates(callback) {
        fetch(TEMPLATES_URL)
            .then(response => response.json())
            .then(data => callback(Array.isArray(data) ? data : []))
            .catch(error => console.error('Error fetching templates:', error));
    }

    function createToolbox(commentButton, templates) {
        // Get site colors
        const style = getComputedStyle(document.documentElement);
        const backgroundSecondary = style.getPropertyValue('--background-secondary').trim();
        const backgroundPage = style.getPropertyValue('--background-page').trim();
        const textColor = style.getPropertyValue('--text-primary').trim();
        const borderRadius = style.getPropertyValue('--border-radius').trim();
        const borderWidth = style.getPropertyValue('--border-width').trim();
        const borderColor = style.getPropertyValue('--input-border-color').trim();
        const lightDark = style.getPropertyValue('--lightDark').trim();
        const fontSize = style.getPropertyValue('--comment-content-font-size').trim();

        // Create the toolbox container
        const toolbox = document.createElement('div');
        toolbox.style.display = 'none';
        toolbox.style.width = '100%';
        toolbox.style.maxHeight = `${MAX_HEIGHT}px`;
        toolbox.style.overflowY = 'auto';
        toolbox.style.backgroundColor = backgroundSecondary;
        toolbox.style.color = textColor;
        toolbox.style.padding = '10px';
        toolbox.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.1)';
        toolbox.style.marginTop = '5px';

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
                templateDiv.classList.add('blink-green');
                setTimeout(() => templateDiv.classList.remove('blink-green'), 500);
            });

            templateList.appendChild(templateDiv);
        });

        toolbox.appendChild(templateList);

        // Create the 💬 icon
        const icon = document.createElement('span');
        icon.textContent = '💬';
        icon.style.cursor = 'pointer';
        icon.style.color = '#0078D7';
        icon.style.fontSize = '16px';
        icon.title = 'Toggle template toolbox';

        icon.addEventListener('click', () => {
            const isVisible = searchContainer.style.visibility === 'visible';
            searchContainer.style.visibility = isVisible ? 'hidden' : 'visible';
            toolbox.style.display = isVisible ? 'none' : 'block';
        });

        // Create the search bar
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search templates...';
        searchInput.style.flex = '1';
        searchInput.style.padding = '5px';
        searchInput.style.marginLeft = '8px';
        searchInput.style.backgroundColor = backgroundPage;
        searchInput.style.borderRadius = borderRadius;
        searchInput.style.borderWidth = borderWidth;
        searchInput.style.borderColor = borderColor;
        searchInput.style.borderStyle = 'solid';
        searchInput.style.fontSize = fontSize;
        searchInput.style.textSize = '12px';

        searchInput.addEventListener("focus", function () {
            searchInput.style.borderColor = lightDark;
        });

        const clearButton = document.createElement('button');
        clearButton.textContent = '❌';
        clearButton.style.marginLeft = '5px';
        clearButton.style.padding = '5px';

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            Array.from(templateList.children).forEach(div => {
                const matches = div.textContent.toLowerCase().includes(searchTerm);
                div.style.display = matches ? 'block' : 'none';
            });
        });

        // Create a wrapper to hold the toggle-related elements
        const toggleWrapper = document.createElement('div');
        toggleWrapper.style.display = 'flex';
        toggleWrapper.style.alignItems = 'center';
        toggleWrapper.style.width = '100%';

        toggleWrapper.appendChild(icon);

        // Add search input and clear button to a sub-container
        const searchContainer = document.createElement('div');
        searchContainer.style.display = 'flex';
        searchContainer.style.flex = '1'; // Take the remaining width
        searchContainer.style.gap = '5px'; // Space between elements
        searchContainer.style.visibility = 'hidden'; // Initially hidden

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearButton);

        toggleWrapper.appendChild(searchContainer);

        // Insert elements into the toolbar row
        commentButton.parentNode.insertBefore(toggleWrapper, commentButton);
        commentButton.parentNode.appendChild(toolbox);

        // Move the comment button to the end and ensure alignment
        commentButton.style.marginLeft = 'auto'; // Push it to the far right
        toggleWrapper.appendChild(commentButton);
    }

    function initToolbox() {
        console.log("Initializing Toolbox...");
        fetchTemplates(templates => {
            console.log(`Found ${templates.length} templates.`);

            const observer = new MutationObserver(() => {
                const commentButtons = document.querySelectorAll('button.btn-comment');
                commentButtons.forEach(commentButton => {
                    if (!commentButton.dataset.toolboxInitialized) {
                        createToolbox(commentButton, templates);
                        commentButton.dataset.toolboxInitialized = 'true';
                    }
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });

            const existingCommentButtons = document.querySelectorAll('button.btn-comment');
            existingCommentButtons.forEach(commentButton => {
                createToolbox(commentButton, templates);
                commentButton.dataset.toolboxInitialized = 'true';
            });
        });
    }

    const style = document.createElement('style');
    style.innerHTML = `
      .blink-green {
        animation: blink-green 1s ease-in-out 1;
      }

      @keyframes blink-green {
        0% { background-color: rgb(47, 64, 42); }
        50% { background-color: transparent; }
        100% { background-color: rgb(47, 64, 42); }
      }
    `;
    document.head.appendChild(style);

    initToolbox();
})();
