# MarkVision : GitHub README Live Previewer

A high-performance, responsive, browser-based GitHub Flavored Markdown (GFM) live editor and previewer built entirely with pure client-side JavaScript. MarkVision delivers an IDE-grade writing experience directly within modern web browsers without requiring backend infrastructure, cloud database dependencies, or build tools.

---

## 📋 Table of Contents

* [Overview](https://www.google.com/search?q=%23overview)
* [Key Features](https://www.google.com/search?q=%23key-features)
* [Architecture & Tech Stack](https://www.google.com/search?q=%23architecture--tech-stack)
* [Project Structure](https://www.google.com/search?q=%23project-structure)
* [Getting Started](https://www.google.com/search?q=%23getting-started)
* [Keyboard Shortcuts](https://www.google.com/search?q=%23keyboard-shortcuts)
* [Security Considerations](https://www.google.com/search?q=%23security-considerations)
* [Contributing](https://www.google.com/search?q=%23contributing)
* [License](https://www.google.com/search?q=%23license)

---

## 📖 Overview

Writing comprehensive GitHub `README.md` files often involves juggling syntax differences, verifying table layouts, formatting mathematical formulas, and embedding screenshots. MarkVision streamlines this workflow by offering a zero-setup, dual-pane workspace with synchronized scrolling, real-time LaTeX parsing, and intelligent asset handling.

Designed with modular JavaScript architecture, MarkVision runs entirely on the client side, ensuring private, local editing and near-instant load times.

---

## ✨ Key Features

### 1. Dual-Pane Synchronized Workspace

* Real-time Markdown parsing powered by **Marked.js**.
* Bidirectional percentage-based scroll synchronization between the raw editor and the rendered output pane.
* Draggable split-divider allowing customized pane width ratios on desktop displays.
* Responsive mobile layout with dedicated tab switching between **Editor** and **Preview**.

### 2. Zero-Clutter Virtual Blob Image Engine

* Native drag-and-drop and clipboard paste (`Ctrl + V`) support for screenshots and local diagrams.
* Uses `URL.createObjectURL` in browser memory to eliminate massive Base64 strings from polluting the textarea editor.
* Automatic conversion of temporary blob links into standard `./assets/` relative file paths upon downloading `README.md`.

### 3. LaTeX Math & Syntax Highlighting

* Full block math (`$$...$$`) and inline math (`$...$`) rendering using **KaTeX**.
* Multi-language syntax highlighting through **Highlight.js** with GitHub light and dark color schemes.
* Automatic copy buttons attached to all rendered code blocks.

### 4. Custom Badge & TOC Generators

* **Custom Badge Modal (`Alt + B`)**: Real-time generation of custom Shields.io badges with label, color picker, and style toggles.
* **One-Click Table of Contents (`Alt + C`)**: Scans document headings, computes relative indentation levels, generates clean GitHub-compatible anchor slugs, and updates TOC blocks seamlessly.

### 5. IDE-Grade Editing & History Tracking

* Custom multi-step undo/redo stack (`Ctrl + Z` / `Ctrl + Y`) preserving cursor selection positions.
* Automatic quote and bracket pair matching (`()`, `[]`, `{}`, `""`, `''`, ```).
* Smart list continuation on Enter for bullet lists, numbered lists, and interactive GitHub checklists (`- [ ]`).
* Interactive preview checkboxes that allow ticking task items directly in the rendered view to update raw Markdown.

### 6. Distraction-Free Zen Mode

* **Zen Editor Mode (`F10`)**: Hides top navigations and preview panels for focused writing.
* **Zen Preview Mode (`Shift + F10`)**: Expands rendered Markdown to full-width reading view.
* Quick exit back to split view via `Esc`.

---

## 🛠️ Architecture & Tech Stack

* **Markup & Styling**: HTML5, Bootstrap 5, Bootstrap Icons, GitHub Markdown CSS (`github-markdown-css`).
* **Core Markdown Parsing**: Marked.js (GFM compliant).
* **Sanitization & Security**: DOMPurify (configured with explicit URI regex rules for virtual blob handling).
* **Mathematics Engine**: KaTeX.
* **Syntax Highlighting**: Highlight.js.
* **State & Storage**: Pure Vanilla JavaScript (ES6+), Web Storage API (`localStorage`), Blob Memory API.

---

## 📂 Project Structure

```text
Readme_Previewer/
├── index.html            # Main markup, responsive offcanvas drawer, and modal dialogs
├── style.css             # Custom workspace layouts, resizer styles, and Zen mode overrides
├── app.js                # Core editor logic, DOMPurify configuration, and scroll sync engine
├── editorfeatures.js     # Drag-and-drop and clipboard Virtual Blob Image Engine
├── badgegenerator.js     # Shields.io custom badge modal controller and shortcut handler
├── tocgenerator.js       # Relative hierarchy Table of Contents parsing engine
├── zenmode.js            # Fullscreen distraction-free layout state controller
├── aifeatures.js         # Client-side AI interface and prompt handler
├── api/
│   └── gemini.js         # Serverless API endpoint handler (for proxying secure requests)
└── favicon.svg           # Application vector branding icon

```

---

## 🚀 Getting Started

Because MarkVision is built without build systems, node modules, or compile steps, running the application locally is straightforward.

### Prerequisites

A modern web browser supporting ES6 JavaScript (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).

### Local Execution

1. Clone the repository:
```bash
git clone https://github.com/Shivam16a/MarkVision.git
cd MarkVision

```


2. Open `index.html` using a lightweight HTTP server to ensure local module loading and blob assets function as expected:
* **Using Python 3:**
```bash
python3 -m http.server 5500

```


* **Using Node.js (`http-server`):**
```bash
npx http-server -p 5500

```


* **Using VS Code:** Install the **Live Server** extension and click **Go Live**.


3. Navigate to `http://localhost:5500` in your browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| --- | --- |
| Ctrl + Z | Undo previous change |
| Ctrl + Y / Ctrl + Shift + Z | Redo change |
| Alt + B | Open Custom Badge Generator Modal |
| Alt + C | Generate / Update Table of Contents |
| Alt + T | Insert standard table template |
| F10 | Toggle Zen Mode (Editor Focus) |
| Shift + F10 | Toggle Zen Mode (Preview Focus) |
| Esc | Exit Zen Mode back to standard split view |
| Ctrl + B | Wrap selection with **Bold** |
| Ctrl + I | Wrap selection with *Italic* |
| Ctrl + U | Wrap selection with Underline |
| Ctrl + Shift + X | Wrap selection with ~~Strikethrough~~ |
| Ctrl + Shift + L | Toggle task checklist line (`- [ ]`) |
| Ctrl + 1 / 2 / 3 | Apply Heading Level 1, 2, or 3 |
| Ctrl + K | Insert Hyperlink |
| Ctrl + Shift + K | Insert Image tag |
| Ctrl + E | Insert Code Block or Inline Code |
| Ctrl + M | Insert Inline Math (`$formula$`) |
| Ctrl + Shift + M | Insert Block Math (`$$formula$$`) |
| Ctrl + / | Toggle HTML comment block |
| Ctrl + S | Force Sync and persist to `localStorage` |
| Ctrl + D | Download `README.md` |
| Tab / Shift + Tab | Indent / Outdent 2 spaces |

---

## 🔒 Security Considerations

MarkVision parses raw HTML inputs alongside Markdown syntax. To protect against Cross-Site Scripting (XSS) vectors, all HTML generated by Marked.js passes through **DOMPurify** before injection into the preview DOM.

URI schemes are strictly enforced with custom validation regular expressions to allow legitimate secure resources (`https:`, `mailto:`, inline SVG structures, and memory-safe `blob:` identifiers) while dropping execution payloads.

---

## 🤝 Contributing

Contributions are welcome. If you would like to report an issue or propose an improvement:

1. Fork the repository.
2. Create your feature branch:
```bash
git checkout -b feature/your-feature-name

```


3. Commit your changes:
```bash
git commit -m "feat: add your feature description"

```


4. Push to the branch:
```bash
git push origin feature/your-feature-name

```


5. Open a Pull Request on GitHub.

---

## 📄 License

This project is open-source software licensed under the [MIT License](https://www.google.com/search?q=LICENSE).