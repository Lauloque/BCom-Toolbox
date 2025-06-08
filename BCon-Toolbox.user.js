// ==UserScript==
// @name         BCom Toolbox
// @namespace    https://blender.community/*
// @version      1.4.0
// @description  A toolbox to insert pre-written templates in comments on blender.community.
// @author       Loïc "Lauloque" Dautry
// @match        https://blender.community/*
// @grant        GM_setClipboard
// @updateURL    https://github.com/Lauloque/BCom-Toolbox/raw/refs/heads/main/BCon-Toolbox.user.js
// @downloadURL  https://github.com/Lauloque/BCom-Toolbox/raw/refs/heads/main/BCon-Toolbox.user.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_HEIGHT = 400; // Max height of the toolbox in px
    const TEMPLATES_URL = 'https://raw.githubusercontent.com/Lauloque/BCom-Toolbox/refs/heads/main/templates.json';

    // Function to fetch templates
    function fetchTemplates(callback) {
        fetch(TEMPLATES_URL)
            .then(response => response.json())
            .then(data => callback(Array.isArray(data) ? data : []))
            .catch(error => console.error('Error fetching templates:', error));
    }

    // Function to check if text overflows 3 lines and add truncation indicator
    function setupTextTruncation(element, originalText) {
        // Set the text and apply line clamping
        element.textContent = originalText;

        // Use a temporary element to check if text would overflow 3 lines
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = element.style.cssText;
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.height = 'auto';
        tempDiv.style.maxHeight = 'none';
        tempDiv.style.webkitLineClamp = 'none';
        tempDiv.style.overflow = 'visible';
        tempDiv.textContent = originalText;

        document.body.appendChild(tempDiv);

        // Calculate line height and check if content exceeds 3 lines
        const computedStyle = getComputedStyle(tempDiv);
        const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2;
        const contentHeight = tempDiv.scrollHeight;
        const threeLineHeight = lineHeight * 3;

        document.body.removeChild(tempDiv);

        if (contentHeight > threeLineHeight) {
            // Text overflows, so we need to show truncation indicator
            element.textContent = originalText + ' [...]';
        }
    }

    function createToolbox(commentButton, templates) {
        // Get site colors
        const style = getComputedStyle(document.documentElement);
        const backgroundPrimary = style.getPropertyValue('--background-primary').trim();
        const backgroundSecondary = style.getPropertyValue('--background-secondary').trim();
        const backgroundPage = style.getPropertyValue('--background-page').trim();
        const textColor = style.getPropertyValue('--text-primary').trim();
        const borderRadius = style.getPropertyValue('--border-radius').trim();
        const borderWidth = style.getPropertyValue('--border-width').trim();
        const borderColor = style.getPropertyValue('--input-border-color').trim();
        const lightDark = style.getPropertyValue('--lightDark').trim();
        const fontSize = style.getPropertyValue('--comment-content-font-size').trim();
        const fontSizeS = fontSize * 0.8;

        // Create the toolbox container
        const toolbox = document.createElement('div');
        toolbox.style.display = 'none';
        toolbox.style.width = '100%';
        toolbox.style.maxHeight = `${MAX_HEIGHT}px`;
        toolbox.style.overflowY = 'auto';
        toolbox.style.backgroundColor = backgroundSecondary;
        toolbox.style.color = textColor;
        toolbox.style.padding = '10px';
        toolbox.style.marginTop = '5px';
        toolbox.style.borderBottom = '2px solid';
        toolbox.style.borderBottomColor = backgroundPage;
        toolbox.style.fontSize = fontSizeS;

        // Add the templates
        const templateList = document.createElement('div');
        templates.forEach((template, index) => {
            const templateDiv = document.createElement('div');
            templateDiv.style.padding = '10px 0';

            const title = document.createElement('strong');
            title.textContent = template.title;
            title.style.display = 'block';
            title.style.marginBottom = '8px';

            const body = document.createElement('div');
            body.style.whiteSpace = 'pre-line'; // Preserve line breaks
            body.style.display = '-webkit-box';
            body.style.webkitLineClamp = '3';
            body.style.webkitBoxOrient = 'vertical';
            body.style.overflow = 'hidden';
            body.style.lineHeight = '1.2em';

            // Set up truncation with overflow detection
            setupTextTruncation(body, template.body);

            templateDiv.appendChild(title);
            templateDiv.appendChild(body);

            templateDiv.addEventListener('click', () => {
                GM_setClipboard(template.body);
                templateDiv.classList.add('blink-green');
                setTimeout(() => templateDiv.classList.remove('blink-green'), 500);
            });

            templateList.appendChild(templateDiv);

            // Add horizontal rule between templates (except after the last one)
            if (index < templates.length - 1) {
                const hr = document.createElement('hr');
                hr.style.border = 'none';
                hr.style.borderTop = '1px solid';
                hr.style.borderTopColor = borderColor;
                hr.style.margin = '0';
                hr.style.opacity = '0.3';
                templateList.appendChild(hr);
            }
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
        console.log("Initializing BCom Toolbox.");
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
