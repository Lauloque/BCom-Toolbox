![License](https://img.shields.io/github/license/L0Lock/BCom-Toolbox?style=for-the-badge) ![Contributors](https://img.shields.io/github/contributors/L0Lock/BCom-Toolbox?style=for-the-badge) ![Build Status](https://img.shields.io/github/actions/workflow/status/L0Lock/BCom-Toolbox/.github/workflows/add_template.yml?branch=main&style=for-the-badge)


A toolbox to insert pre-written templates in comments on [Blender Community](https://blender.community/#). Because I realised I often had to repeat the same thing and sometimes I did a better job at it than other days. So I started to compile well written and though-out templates I can reuse often.
![image](https://github.com/user-attachments/assets/66975649-13e2-4508-86b8-ce61a9e8d5a5)


You can preview all the available templates in [BCom-Toolbox/templates.md](https://github.com/L0Lock/BCom-Toolbox/blob/main/templates.md)

## Usage

Toggle the toolbox on/off by clicking the 💬 button.

![demoGif](https://github.com/user-attachments/assets/76b65a5c-bc3f-444f-9dc5-f8d3e029f8af)

Templates are searchable. Clicking a template copies it on your clipboard, you are then in control of where to insert it in your comment, and modify it to your liking.

> [!CAUTION]
> Please be aware that these really are just templates. Don't use them as monolithical comments. Instead, use them as a base guide to write tailored comments better and faster. We wouldn't want to be a community of robots exchanging only in prefabs, right? 😉

## Installation

1. You need a userscript extension installed on your web browser:
    - Firefox:   [Greasemonkey – Get this Extension for 🦊 Firefox (en-US)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
    - Chrome: [Tampermonkey - Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. Open the raw [BCon-Toolbox.user.js](https://github.com/L0Lock/BCom-Toolbox/raw/refs/heads/main/BCon-Toolbox.user.js), your userscript extension should detect it and propose you to install it.  
    If not, copy the whole code and refer to your extension's tools to add a script manually.
  

## Contributing to messages

You are free to propose updates of existing message or entirely new messages!

New messages have to be written in Markdown, as supported on blender.community. There isn't an official guide of its supported Markdown, but I invite you to read [Basic writing and formatting syntax - GitHub Docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) which is a standard Markdown and mostly supported on BC.

Each message is made of a descriptive title (which you see in **bold** in the search result) and a body which is what will actually be inserted.

In addition, for parts that need to be adapted in the final message before posting (typically, examples paragraphs), format them as markdown code with single ticks `` ` `` for inlilne and with triple backticks `` ``` `` for a whole block. When giving multiple choices to chose from, you can use long dashes for itemts that need to be chosen. The goal is to make it visually stand out and harder to miss. Example: 

````md
# Blender is actually free and opensource

Blender is free and open source `like Krita`. Cool, right? Here's the cool things it means on your daily life:

```
EXAMPLE ITEMS TO CHOSE FROM OR GET INSPIRED FROM

⸻You can always find it for free, no fees, no royalties, no strings attached
⸻Anyone can make their own Blender. Even you!
⸻You can use Blender however you like. To make free stuff or paid stuff. You can even make your own copy of Blender and sell it!
```
````

Which will be rendered as:

![image](https://github.com/user-attachments/assets/25c9ab47-21c6-4adc-8c3e-c06ef931b92a)

### Sending your template update

You can send templates proposition in two ways: 

1. Post a [Template Proposal](https://github.com/L0Lock/BCom-Toolbox/issues/new?assignees=L0Lock&labels=enhancement&projects=&template=template-proposal.md&title=%5BTemplate%5D+your+new+template), adapted for regular users and to propose a single template
    - Follow the template proposal prefill: describe the proposal, post the code twice so that we can see both raw code and final preview.
    - IF I accept it: I will manually add it to the official message list.
    - ELSE: I might ask for updates, or make changes myself, of deny the contribution.
2. Fork the repository and send a pull request: adapted to send multiple templates at once and for advanced users who know how to use git.
    - Fork the repo and open [templates.md](https://github.com/L0Lock/BCom-Toolbox/raw/refs/heads/main/templates.md).
    - Add your new template  ideally sorter alphabetically with the others.
    - Send your update via pull request, **with a detailed explanation of the changes and why**.
    - IF I accept it: I will trigger the json regeneration with the [Update Templates JSON](https://github.com/L0Lock/BCom-Toolbox/actions/workflows/add_template.yml) Github Action.
    - ELSE: I might ask for updates, or deny the PR.
