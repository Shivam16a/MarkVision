// Default Sample Markdown with Badges, Math & AI Instructions
const DEFAULT_MARKDOWN = `# 🚀 README Demo Project

A complete README example demonstrating common **Markdown/GitHub README features**.

> 💡 **MarkVision AI Tip:** You can enhance this README or fix formatting issues instantly by clicking the **"Enhance"** or **"Fix Errors"** button.
> Need specific changes (e.g., *"Add Docker setup"*, *"Rename project to MyProject"*, or *"Add MIT License"* )? Simply drop your instructions inside the comment block below!

<!-- 🤖 AI INSTRUCTION (Optional): 
Write your custom instructions here, for example:
- "Rename this project to MarkVision and include a live deployment link"
- "Add a dedicated Troubleshooting and FAQ section"
- "Update tech stack with Tailwind CSS and TypeScript"
The AI will prioritize and apply these changes directly!
-->

---

## 📋 Table of Contents

1. [About](#-about)
2. [Features](#-features)
3. [Mathematical Formulas](#-mathematical-formulas)
4. [Installation](#-installation)
5. [Code Examples](#-code-examples)
6. [File Links](#-file-links)
7. [Table](#-table)
8. [Checklist](#-checklist)
9. [License](#-license)

---

## 📖 About

This is a **demo project** showing different README/Markdown features.

You can use **bold text**, *italic text*, ~~strikethrough~~, and
<u>underlined text</u>.

### 🎯 Project Goals

- Demonstrate Markdown syntax
- Provide reusable README examples
- Show code blocks with syntax highlighting
- Show tables and lists
- Show links and assets

---

## ✨ Features

- ✅ Easy to understand
- ⚡ Fast and lightweight
- 🔧 Easy to customize
- 📦 Simple project structure
- 🌐 Link support
- 📝 Markdown & Math (LaTeX) support

### Feature Details

1. **Headings**
2. **Lists**
3. **Tables**
4. **Code blocks**
5. **Links**
6. **Images**
7. **Checklists**

---

## 🧮 Mathematical Formulas

If you mean the **summation formulas involving $n$**:

- $\\displaystyle \\sum_{k=1}^{n} 1 = n$
- $\\displaystyle \\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$
- $\\displaystyle \\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}$
- $\\displaystyle \\sum_{k=1}^{n} k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$

---

## 📥 Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/username/demo-project.git
\`\`\`

# JavaScript code
\`\`\`javascript
console.log("shivam");
\`\`\`

<!-- Tech Stack & Project Badges -->
<p>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=semver&logoColor=white" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>
`;

// DOM Elements
const markdownInput = document.getElementById("markdown-input");
const markdownPreview = document.getElementById("markdown-preview");
const previewScrollArea = document.querySelector(".preview-scroll-area");
const editorStats = document.getElementById("editor-stats");

const btnTheme = document.getElementById("btn-theme");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");
const hljsThemeLink = document.getElementById("hljs-theme");

const btnClear = document.getElementById("btn-clear");
const btnSample = document.getElementById("btn-sample");
const btnCopyMd = document.getElementById("btn-copy-md");
const btnDownload = document.getElementById("btn-download");
const btnDownloadMobile = document.getElementById("btn-download-mobile");

const dragResizer = document.getElementById("drag-resizer");
const editorPane = document.getElementById("editor-pane");
const previewPane = document.getElementById("preview-pane");

const tabEditor = document.getElementById("tab-editor");
const tabPreview = document.getElementById("tab-preview");

// Configure Marked.js for GitHub Flavored Markdown (GFM)
marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false,
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
    },
});

// Sanitize Configuration using DOMPurify (Allowing blob: and data: for images)
const purifyConfig = {
    ADD_TAGS: [
        "iframe", "details", "summary", "u", "input", "del", "ins",
        "math", "mrow", "mi", "mo", "mn", "msup", "msub", "mfrac", "mpadded", "mphantom",
        "semantics", "annotation", "svg", "path", "line", "rect", "circle", "span"
    ],
    ADD_ATTR: [
        "target", "align", "valign", "type", "checked", "disabled",
        "src", "alt", "width", "height", "style", "viewBox", "d", "class", "aria-hidden",
        "data-line-index"
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
};

// ========================================================
// 🔄 ADVANCED UNDO / REDO HISTORY ENGINE (With Cursor Tracking)
// ========================================================
const historyStack = [];
let historyIndex = -1;
const MAX_HISTORY = 60;
let isUndoRedoOperation = false;

function recordHistoryState(text = markdownInput.value, cursorPosition = { start: markdownInput.selectionStart, end: markdownInput.selectionEnd }) {
    if (isUndoRedoOperation) return;

    if (historyIndex < historyStack.length - 1) {
        historyStack.splice(historyIndex + 1);
    }

    if (historyStack.length > 0 && historyStack[historyStack.length - 1].text === text) {
        return;
    }

    historyStack.push({ text, cursor: cursorPosition });
    if (historyStack.length > MAX_HISTORY) {
        historyStack.shift();
    } else {
        historyIndex++;
    }
}

// Global scope export for modular scripts (aifeatures.js, editorfeatures.js, etc.)
window.recordHistoryState = recordHistoryState;

function performUndo() {
    if (historyIndex > 0) {
        historyIndex--;
        isUndoRedoOperation = true;
        const state = historyStack[historyIndex];
        markdownInput.value = state.text;
        renderMarkdown();
        if (state.cursor) {
            markdownInput.setSelectionRange(state.cursor.start, state.cursor.end);
        }
        isUndoRedoOperation = false;
        showToast("Undo ↩️");
    } else {
        showToast("Nothing to undo");
    }
}

function performRedo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        isUndoRedoOperation = true;
        const state = historyStack[historyIndex];
        markdownInput.value = state.text;
        renderMarkdown();
        if (state.cursor) {
            markdownInput.setSelectionRange(state.cursor.start, state.cursor.end);
        }
        isUndoRedoOperation = false;
        showToast("Redo ↪️");
    } else {
        showToast("Nothing to redo");
    }
}

// ========================================================
// 🧮 MATH & MARKDOWN PROCESSING ENGINE
// ========================================================
function processMarkdownWithMath(rawText) {
    if (typeof katex === "undefined") {
        return marked.parse(rawText);
    }

    const codeTokens = [];
    const mathTokens = [];

    // Step A: Protect code blocks and inline code
    let text = rawText.replace(/(```[\s\S]*?```|`[^`\n]+?`)/g, (match) => {
        const token = `%%PROTECTEDCODE_${codeTokens.length}%%`;
        codeTokens.push({ token, replacement: match });
        return token;
    });

    // Step B: Block Math ($$...$$)
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
        try {
            const rendered = katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
            const token = `%%MATHBLOCK_${mathTokens.length}%%`;
            mathTokens.push({ token, replacement: rendered });
            return token;
        } catch (e) {
            return match;
        }
    });

    // Step C: Inline Math ($...$) - Exclude currency symbols ($10, $20)
    text = text.replace(/(^|[^\\])\$([^\$\n\s](?:[^\$\n]*?[^\$\n\s])?)\$/g, (match, prefix, expr) => {
        if (/^\d+(\.\d+)?$/.test(expr)) return match;
        try {
            const rendered = katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
            const token = `%%MATHINLINE_${mathTokens.length}%%`;
            mathTokens.push({ token, replacement: `${prefix}${rendered}` });
            return token;
        } catch (e) {
            return match;
        }
    });

    // Step D: Restore protected code blocks
    codeTokens.forEach(({ token, replacement }) => {
        text = text.replace(token, replacement);
    });

    // Step E: Standard Marked parse
    let html = marked.parse(text);

    // Step F: Re-inject rendered math HTML
    mathTokens.forEach(({ token, replacement }) => {
        html = html.replace(token, replacement);
    });

    return html;
}

// Function to add GitHub-style Copy Buttons to all <pre> blocks
function attachCodeCopyButtons() {
    const codeBlocks = markdownPreview.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
        if (pre.querySelector(".code-copy-btn")) return;

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "code-copy-btn";
        copyBtn.setAttribute("aria-label", "Copy code to clipboard");
        copyBtn.innerHTML = `<i class="bi bi-copy"></i><span>Copy</span>`;

        copyBtn.addEventListener("click", async () => {
            const codeElement = pre.querySelector("code");
            const codeText = codeElement ? codeElement.innerText : pre.innerText;

            try {
                await navigator.clipboard.writeText(codeText);

                copyBtn.classList.add("copied");
                copyBtn.innerHTML = `<i class="bi bi-check2"></i><span>Copied!</span>`;

                setTimeout(() => {
                    copyBtn.classList.remove("copied");
                    copyBtn.innerHTML = `<i class="bi bi-copy"></i><span>Copy</span>`;
                }, 2000);
            } catch (err) {
                showToast("Failed to copy code");
            }
        });

        pre.appendChild(copyBtn);
    });
}

// Interactive Task-List Checkboxes: Toggle directly from Preview to Editor
function enableInteractiveChecklists() {
    const checkboxes = markdownPreview.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
        cb.removeAttribute("disabled");
        cb.style.cursor = "pointer";

        cb.addEventListener("change", () => {
            const labelText = cb.parentElement ? cb.parentElement.innerText.trim() : "";
            if (!labelText) return;

            const val = markdownInput.value;
            const targetChar = cb.checked ? "[x]" : "[ ]";
            const oppositeChar = cb.checked ? "[ ]" : "[x]";

            const lines = val.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(oppositeChar) && lines[i].includes(labelText.substring(0, 20))) {
                    lines[i] = lines[i].replace(oppositeChar, targetChar);
                    break;
                }
            }

            markdownInput.value = lines.join("\n");
            renderMarkdown();
            recordHistoryState(markdownInput.value);
            showToast("Task updated in markdown! ✅");
        });
    });
}

// Main Render Function
function renderMarkdown() {
    const rawText = markdownInput.value;

    // Update Metrics
    const charCount = rawText.length;
    const words = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
    const lines = rawText ? rawText.split("\n").length : 0;
    if (editorStats) {
        editorStats.textContent = `Lines: ${lines} | Words: ${words} | Chars: ${charCount}`;
    }

    // Process Markdown + LaTeX Math
    const parsedHtml = processMarkdownWithMath(rawText);
    const cleanHtml = DOMPurify.sanitize(parsedHtml, purifyConfig);

    // Render to DOM
    markdownPreview.innerHTML = cleanHtml;

    // Syntax highlighting
    markdownPreview.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
    });

    // Attach Interactive Elements
    attachCodeCopyButtons();
    enableInteractiveChecklists();
}
window.renderMarkdown = renderMarkdown;

// Toast Helper Function
function showToast(message) {
    const toastEl = document.getElementById("liveToast");
    const msgEl = document.getElementById("toast-message");
    if (!toastEl || !msgEl) return;

    msgEl.textContent = message;

    if (typeof bootstrap !== "undefined" && bootstrap.Toast) {
        const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
        toast.show();
    } else {
        toastEl.classList.add("show");
        setTimeout(() => toastEl.classList.remove("show"), 2000);
    }
}
window.showToast = showToast;

// Synchronized Scrolling
let isSyncingEditor = false;
let isSyncingPreview = false;

markdownInput.addEventListener("scroll", () => {
    if (!isSyncingPreview && previewScrollArea) {
        isSyncingEditor = true;
        const scrollPercentage =
            markdownInput.scrollTop /
            (markdownInput.scrollHeight - markdownInput.clientHeight || 1);
        previewScrollArea.scrollTop =
            scrollPercentage *
            (previewScrollArea.scrollHeight - previewScrollArea.clientHeight);
    }
    isSyncingPreview = false;
});

if (previewScrollArea) {
    previewScrollArea.addEventListener("scroll", () => {
        if (!isSyncingEditor) {
            isSyncingPreview = true;
            const scrollPercentage =
                previewScrollArea.scrollTop /
                (previewScrollArea.scrollHeight - previewScrollArea.clientHeight || 1);
            markdownInput.scrollTop =
                scrollPercentage *
                (markdownInput.scrollHeight - markdownInput.clientHeight);
        }
        isSyncingEditor = false;
    });
}

// Realtime Input with Debounced History Recording
let typingTimer = null;
markdownInput.addEventListener("input", () => {
    renderMarkdown();
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        recordHistoryState(markdownInput.value);
    }, 400);
});

// ========================================================
// 🧰 TOOLBAR & DROPDOWN ACTIONS
// ========================================================

// 1. Direct Toolbar Buttons
if (btnClear) {
    btnClear.addEventListener("click", () => {
        if (markdownInput.value.trim() !== "") {
            markdownInput.value = "";
            renderMarkdown();
            recordHistoryState(markdownInput.value);
            showToast("Editor cleared");
        }
    });
}

if (btnSample) {
    btnSample.addEventListener("click", () => {
        markdownInput.value = DEFAULT_MARKDOWN;
        renderMarkdown();
        recordHistoryState(markdownInput.value);
        showToast("Demo README loaded");
    });
}

if (btnCopyMd) {
    btnCopyMd.addEventListener("click", () => {
        navigator.clipboard.writeText(markdownInput.value).then(() => {
            showToast("Markdown copied to clipboard!");
        });
    });
}

// 2. Responsive Dropdown Menu Triggers
const dropCopyMd = document.getElementById("dropdown-copy-md");
const dropSample = document.getElementById("dropdown-sample");
const dropClear = document.getElementById("dropdown-clear");

if (dropCopyMd) {
    dropCopyMd.addEventListener("click", () => {
        navigator.clipboard.writeText(markdownInput.value).then(() => {
            showToast("Markdown copied to clipboard!");
        });
    });
}

if (dropSample) {
    dropSample.addEventListener("click", () => {
        markdownInput.value = DEFAULT_MARKDOWN;
        renderMarkdown();
        recordHistoryState(markdownInput.value);
        showToast("Demo README loaded");
    });
}

if (dropClear) {
    dropClear.addEventListener("click", () => {
        if (markdownInput.value.trim() !== "") {
            markdownInput.value = "";
            renderMarkdown();
            recordHistoryState(markdownInput.value);
            showToast("Editor cleared");
        }
    });
}

// 3. Download README.md logic
function triggerDownload() {
    let exportContent = markdownInput.value;

    // Replace internal blob URLs with clean GitHub relative paths
    if (window.markVisionImageStore && window.markVisionImageStore.size > 0) {
        window.markVisionImageStore.forEach((file, blobUrl) => {
            const fileName = file.name || "diagram.png";
            exportContent = exportContent.replaceAll(blobUrl, `./assets/${fileName}`);
        });
    }

    const blob = new Blob([exportContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("README.md exported! 📦");
}

if (btnDownload) {
    btnDownload.addEventListener("click", triggerDownload);
}

if (btnDownloadMobile) {
    btnDownloadMobile.addEventListener("click", triggerDownload);
}

// 4. Mobile Offcanvas Drawer Action Listeners
document.getElementById("m-btn-ai-enhance")?.addEventListener("click", () => {
    document.getElementById("btn-ai-enhance")?.click();
});
document.getElementById("m-btn-ai-fix")?.addEventListener("click", () => {
    document.getElementById("btn-ai-fix")?.click();
});
document.getElementById("m-btn-toc")?.addEventListener("click", () => {
    document.getElementById("btn-generate-toc")?.click();
});
document.getElementById("m-btn-theme")?.addEventListener("click", () => {
    btnTheme?.click();
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const mThemeState = document.getElementById("m-theme-state");
    if (mThemeState) mThemeState.textContent = currentTheme === "dark" ? "Dark" : "Light";
});
document.getElementById("m-btn-copy")?.addEventListener("click", () => {
    navigator.clipboard.writeText(markdownInput.value).then(() => showToast("Markdown copied!"));
});
document.getElementById("m-btn-sample")?.addEventListener("click", () => {
    markdownInput.value = DEFAULT_MARKDOWN;
    renderMarkdown();
    recordHistoryState(markdownInput.value);
    showToast("Demo README loaded");
});
document.getElementById("m-btn-clear")?.addEventListener("click", () => {
    if (markdownInput.value.trim() !== "") {
        markdownInput.value = "";
        renderMarkdown();
        recordHistoryState(markdownInput.value);
        showToast("Editor cleared");
    }
});

// Theme Switcher Function
function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.setAttribute("data-color-mode", theme);

    if (theme === "light") {
        if (themeIcon) themeIcon.className = "bi bi-moon-stars-fill";
        if (themeText) themeText.textContent = "Dark";
        if (hljsThemeLink) hljsThemeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    } else {
        if (themeIcon) themeIcon.className = "bi bi-sun-fill";
        if (themeText) themeText.textContent = "Light";
        if (hljsThemeLink) hljsThemeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    }

    renderMarkdown();
}

if (btnTheme) {
    btnTheme.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-bs-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    });
}

// Desktop Resizer Logic
let isDragging = false;

if (dragResizer) {
    dragResizer.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragResizer.classList.add("resizing");
        document.body.style.cursor = "col-resize";
        e.preventDefault();
    });
}

window.addEventListener("mousemove", (e) => {
    if (!isDragging || !dragResizer) return;
    const containerOffsetLeft = dragResizer.parentElement.offsetLeft;
    const containerWidth = dragResizer.parentElement.clientWidth;
    const pointerRelativeX = e.clientX - containerOffsetLeft;

    const minWidth = 260;
    if (
        pointerRelativeX > minWidth &&
        pointerRelativeX < containerWidth - minWidth
    ) {
        const leftPercentage = (pointerRelativeX / containerWidth) * 100;
        editorPane.style.flex = `0 0 ${leftPercentage}%`;
        previewPane.style.flex = `0 0 ${100 - leftPercentage}%`;
    }
});

window.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        if (dragResizer) dragResizer.classList.remove("resizing");
        document.body.style.cursor = "default";
    }
});

// Mobile Tabs Switcher
if (tabEditor && tabPreview) {
    tabEditor.addEventListener("click", () => {
        tabEditor.classList.add("active");
        tabPreview.classList.remove("active");
        editorPane.classList.add("active-mobile-pane");
        previewPane.classList.remove("active-mobile-pane");
    });

    tabPreview.addEventListener("click", () => {
        tabPreview.classList.add("active");
        tabEditor.classList.remove("active");
        previewPane.classList.add("active-mobile-pane");
        editorPane.classList.remove("active-mobile-pane");
    });
}

// ========================================================
// ⌨️ KEYBOARD SHORTCUTS & SMART EDITING ENGINE
// ========================================================
function wrapSelection(before, after = before, defaultText = "text") {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const value = markdownInput.value;
    const selected = value.substring(start, end);

    const replacement = `${before}${selected || defaultText}${after}`;
    markdownInput.setRangeText(replacement, start, end, "select");
    renderMarkdown();

    if (!selected) {
        markdownInput.selectionStart = start + before.length;
        markdownInput.selectionEnd = start + before.length + defaultText.length;
    }

    recordHistoryState(markdownInput.value);
}

function insertAtCursor(textToInsert) {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    markdownInput.setRangeText(textToInsert, start, end, "end");
    renderMarkdown();
    recordHistoryState(markdownInput.value);
}

function toggleLinePrefix(prefix) {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const value = markdownInput.value;

    let lineStart = value.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = value.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = value.length;

    const lineText = value.substring(lineStart, lineEnd);

    if (lineText.startsWith(prefix)) {
        markdownInput.setRangeText(lineText.replace(prefix, ""), lineStart, lineEnd, "select");
    } else {
        markdownInput.setRangeText(prefix + lineText, lineStart, lineEnd, "select");
    }
    renderMarkdown();
    recordHistoryState(markdownInput.value);
}

function toggleComment() {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const value = markdownInput.value;

    let lineStart = value.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = value.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = value.length;

    const currentBlock = value.substring(lineStart, lineEnd);

    if (currentBlock.startsWith("<!-- ") && currentBlock.endsWith(" -->")) {
        const uncommented = currentBlock.slice(5, -4);
        markdownInput.setRangeText(uncommented, lineStart, lineEnd, "select");
    } else {
        const commented = `<!-- ${currentBlock} -->`;
        markdownInput.setRangeText(commented, lineStart, lineEnd, "select");
    }
    renderMarkdown();
    recordHistoryState(markdownInput.value);
}

// Auto Close Brackets & Quotes
const PAIRS = {
    "(": ")",
    "[": "]",
    "{": "}",
    '"': '"',
    "'": "'",
    "`": "`"
};

markdownInput.addEventListener("keydown", (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const value = markdownInput.value;

    // 1. Smart Enter: Auto list & checklist continuation
    if (e.key === "Enter" && !isCtrl) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const currentLine = value.substring(lineStart, start);

        const taskMatch = currentLine.match(/^(\s*[-*]\s[[ x]]\s)/);
        if (taskMatch) {
            e.preventDefault();
            if (currentLine.trim() === "- [ ]" || currentLine.trim() === "- [x]") {
                markdownInput.setRangeText("", lineStart, start, "end");
            } else {
                markdownInput.setRangeText("\n" + taskMatch[1].replace("[x]", "[ ]"), start, end, "end");
            }
            renderMarkdown();
            recordHistoryState(markdownInput.value);
            return;
        }

        const listMatch = currentLine.match(/^(\s*[-*]\s)/);
        if (listMatch) {
            e.preventDefault();
            if (currentLine.trim() === "-" || currentLine.trim() === "*") {
                markdownInput.setRangeText("", lineStart, start, "end");
            } else {
                markdownInput.setRangeText("\n" + listMatch[1], start, end, "end");
            }
            renderMarkdown();
            recordHistoryState(markdownInput.value);
            return;
        }

        const numMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
        if (numMatch) {
            e.preventDefault();
            if (currentLine.trim() === `${numMatch[2]}.`) {
                markdownInput.setRangeText("", lineStart, start, "end");
            } else {
                const nextNum = parseInt(numMatch[2], 10) + 1;
                markdownInput.setRangeText(`\n${numMatch[1]}${nextNum}. `, start, end, "end");
            }
            renderMarkdown();
            recordHistoryState(markdownInput.value);
            return;
        }
    }

    // 2. Auto-Closing Pairs
    if (PAIRS[e.key] && !isCtrl) {
        const closePair = PAIRS[e.key];
        const selected = value.substring(start, end);

        if (selected) {
            e.preventDefault();
            wrapSelection(e.key, closePair, selected);
            return;
        } else if (e.key === closePair && value.charAt(start) === closePair) {
            e.preventDefault();
            markdownInput.selectionStart = markdownInput.selectionEnd = start + 1;
            return;
        }
    }

    // 3. Tab / Shift + Tab Indentation
    if (e.key === "Tab") {
        e.preventDefault();
        if (isShift) {
            if (value.substring(start - 2, start) === "  ") {
                markdownInput.setRangeText("", start - 2, start, "end");
            }
        } else {
            markdownInput.setRangeText("  ", start, end, "end");
        }
        renderMarkdown();
        recordHistoryState(markdownInput.value);
        return;
    }

    // 4. Keyboard Shortcuts Hub
    if (isCtrl) {
        // Ctrl + Z (Undo)
        if (e.key.toLowerCase() === "z" && !isShift) {
            e.preventDefault();
            performUndo();
            return;
        }

        // Ctrl + Y or Ctrl + Shift + Z (Redo)
        if (e.key.toLowerCase() === "y" || (isShift && e.key.toLowerCase() === "z")) {
            e.preventDefault();
            performRedo();
            return;
        }

        // Ctrl + / or Ctrl + ? : Toggle Comment
        if (e.key === "/" || e.key === "?") {
            e.preventDefault();
            toggleComment();
            return;
        }

        // Ctrl + S : Save & Sync
        if (e.key.toLowerCase() === "s") {
            e.preventDefault();
            renderMarkdown();
            localStorage.setItem("MARKVISION_AUTOSAVE", markdownInput.value);
            showToast("Saved & Preview Synced! 💾");
            return;
        }

        // Text Styles
        if (e.key.toLowerCase() === "b") { e.preventDefault(); wrapSelection("**", "**", "bold text"); return; }
        if (e.key.toLowerCase() === "i") { e.preventDefault(); wrapSelection("*", "*", "italic text"); return; }
        if (e.key.toLowerCase() === "u") { e.preventDefault(); wrapSelection("<u>", "</u>", "underlined text"); return; }
        if (isShift && e.key.toLowerCase() === "x") { e.preventDefault(); wrapSelection("~~", "~~", "strikethrough text"); return; }

        // Task Checklist (Ctrl + Shift + L)
        if (isShift && e.key.toLowerCase() === "l") {
            e.preventDefault();
            toggleLinePrefix("- [ ] ");
            return;
        }

        // Headings: Ctrl + 1, 2, 3
        if (e.key === "1") { e.preventDefault(); toggleLinePrefix("# "); return; }
        if (e.key === "2") { e.preventDefault(); toggleLinePrefix("## "); return; }
        if (e.key === "3") { e.preventDefault(); toggleLinePrefix("### "); return; }

        // Links & Images
        if (e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (isShift) {
                wrapSelection("![alt text](", ")", "https://via.placeholder.com/150");
            } else {
                wrapSelection("[", "](https://example.com)", "link title");
            }
            return;
        }

        // Code Block / Inline Code
        if (e.key.toLowerCase() === "e") {
            e.preventDefault();
            const selected = markdownInput.value.substring(start, end);
            if (selected.includes("\n")) {
                wrapSelection("```javascript\n", "\n```", "console.log('code');");
            } else {
                wrapSelection("`", "`", "code");
            }
            return;
        }

        // Math Formulas
        if (e.key.toLowerCase() === "m") {
            e.preventDefault();
            if (isShift) {
                wrapSelection("$$\n", "\n$$", "\\displaystyle \\sum_{k=1}^{n} k");
            } else {
                wrapSelection("$", "$", "E = mc^2");
            }
            return;
        }

        // Quick Download (Ctrl + D)
        if (e.key.toLowerCase() === "d") {
            e.preventDefault();
            triggerDownload();
            return;
        }
    }

    // 5. Universal Table Template (Alt + T or Ctrl + Shift + T)
    const isTableShortcut = (e.altKey && e.key.toLowerCase() === "t") ||
        (isCtrl && isShift && e.key.toLowerCase() === "t");

    if (isTableShortcut) {
        e.preventDefault();
        e.stopPropagation();
        const tableTemplate = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item A | Value 1 | $10.00 |\n| Item B | Value 2 | $20.00 |\n`;
        insertAtCursor(tableTemplate);
        showToast("Table template inserted! 📊");
        return;
    }
});

// Global Shortcuts (Ctrl+H for Help Dialog)
window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "h") {
        e.preventDefault();
        const modalEl = document.getElementById("shortcutsModal");
        if (modalEl && typeof bootstrap !== "undefined") {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        }
    }
});

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("MARKVISION_AUTOSAVE");
    markdownInput.value = saved ? saved : DEFAULT_MARKDOWN;
    if (editorPane) editorPane.classList.add("active-mobile-pane");
    applyTheme("dark");

    recordHistoryState(markdownInput.value);
});