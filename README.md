A toolbox to insert pre-written templates in comments on [Blender Community](https://blender.community/#). Because I realised I often had to repeat the same thing and sometimes I did a better job at it than other days. So I started to compile well written and though-out templates I can reuse often.

![image](https://github.com/user-attachments/assets/473b8e11-a79d-4427-93a5-b6d62b7510aa)

Templates are searchable. Clicking a template copies it on your clipboard, you are then in control of where to insert it, and modify it to your liking.

You can see all the available templates in [BCom-Toolbox/templates.md](https://github.com/L0Lock/BCom-Toolbox/blob/main/templates.md)


> [!CAUTION]
> Please be aware that these really are just templates. Don't use them as monolithical comments. Instead, use them as a base guide to write tailored comments better and faster. We wouldn't want to be a community of robots exchanging only in prefabs, right? 😉

## Contribute new messages

New messages have to be written in Markdown, as supported on blender.community. There isn't an official guide of its supported Markdown, but I invite you to read [Basic writing and formatting syntax - GitHub Docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) which is a standard Markdown and mostly supported on BC.

Each message is made of a descriptive title (which you see in **bold** in the search result) and a body which is what will actually be inserted.

You can send templates proposition in two ways: 

1. Post a [Template Proposal](https://github.com/L0Lock/BCom-Toolbox/issues/new?assignees=L0Lock&labels=enhancement&projects=&template=template-proposal.md&title=%5BTemplate%5D+your+new+template), adapted for regular users and to propose a single template
  - Follow the template proposal prefill: describe the proposal, post the code twice so that we can see both raw code and final preview.
2. Fork the repository and send a pull request: adapted to send multiple templates at once and for advanced users who know how to use git.
  - Fork the repo and open [templates.md](https://github.com/L0Lock/BCom-Toolbox/raw/refs/heads/main/templates.md).
  - Add your new template  ideally sorter alphabetically with the others.
  - Send your update via pull request, **with a detailed explanation of the changes and why**.
  - If I accept it, I will trigger the json regeneration with the [Update Templates JSON](https://github.com/L0Lock/BCom-Toolbox/actions/workflows/add_template.yml) Github Action.
