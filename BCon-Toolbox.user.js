// ==UserScript==
// @name         BCom Toolbox
// @namespace    https://blender.community/
// @version      1.2
// @description  A toolbox to insert pre-written templates in comments on blender.community.
// @author       Lauloque
// @match        https://blender.community/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
    'use strict';

    const MAX_HEIGHT = 400; // Max height of the toolbox in px
    const TEMPLATES_URL = 'https://raw.githubusercontent.com/L0Lock/BSE-Toolbox/main/templates.json';

    function fetchTemplates(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: TEMPLATES_URL,
            onload: (response) => {
                if (response.status === 200) {
                    const templates = JSON.parse(response.responseText);
                    callback(templates);
                } else {
                    console.error('Failed to load templates:', response.status, response.statusText);
                }
            },
            onerror: (error) => {
                console.error('Error fetching templates:', error);
            },
        });
    }

    function createToolbox(textarea, templates) {
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
        toolbox.style.backgroundColor = '#f9f9f9';
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
                alert('Template copied to clipboard!');
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

    function initToolbox() {
        fetchTemplates(templates => {
            document.querySelectorAll('textarea[placeholder="Write a comment..."]').forEach(textarea => {
                createToolbox(textarea, templates);
            });
        });
    }

    initToolbox();
})();
