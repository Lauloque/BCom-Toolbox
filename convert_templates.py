import json
import re
from pathlib import Path

# File paths
TEMPLATES_MD = Path('templates.md')
TEMPLATES_JSON = Path('templates.json')

# Regex to match titles (#) and bodies
TITLE_REGEX = re.compile(r'^# (.+)', re.MULTILINE)
BODY_REGEX = re.compile(r'^(?!# ).+', re.MULTILINE)

def parse_markdown(md_content):
    lines = md_content.splitlines()
    templates = []
    title = None
    body_lines = []
    
    for line in lines:
        if line.startswith('# '):  # Title line
            if title:  # Save the previous template
                templates.append({'title': title.strip(), 'body': '\n'.join(body_lines).strip()})
            title = line[2:]  # Strip `# ` from the title
            body_lines = []
        else:
            body_lines.append(line)
    
    # Add the last template if it exists
    if title:
        templates.append({'title': title.strip(), 'body': '\n'.join(body_lines).strip()})
    
    return templates

def main():
    if not TEMPLATES_MD.exists():
        raise FileNotFoundError(f\"'{TEMPLATES_MD}' not found.\")
    
    # Read and parse the markdown file
    with TEMPLATES_MD.open('r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    templates = parse_markdown(markdown_content)
    
    # Write the JSON output
    with TEMPLATES_JSON.open('w', encoding='utf-8') as f:
        json.dump(templates, f, indent=2, ensure_ascii=False)
    
    print(f\"Generated '{TEMPLATES_JSON}' from '{TEMPLATES_MD}'.\")

if __name__ == '__main__':
    main()
