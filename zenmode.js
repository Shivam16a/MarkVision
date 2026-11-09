// zenmode.js - Distraction-Free Zen & Fullscreen Focus Mode

(function () {
    const editorPane = document.getElementById("editor-pane");
    const previewPane = document.getElementById("preview-pane");
    const btnZenToggle = document.getElementById("btn-zen-mode");

    // Current Mode state: 'normal' | 'zen-editor' | 'zen-preview'
    let currentMode = "normal";

    function setMode(mode) {
        document.body.classList.remove("zen-editor-active", "zen-preview-active");

        if (mode === "zen-editor") {
            document.body.classList.add("zen-editor-active");
            currentMode = "zen-editor";
            showToast("Zen Mode: Editor Fullscreen (Press Esc to Exit) 🧘");
        } else if (mode === "zen-preview") {
            document.body.classList.add("zen-preview-active");
            currentMode = "zen-preview";
            showToast("Zen Mode: Preview Fullscreen (Press Esc to Exit) 👁️");
        } else {
            currentMode = "normal";
            showToast("Exited Zen Mode");
        }

        updateButtonIcon();
    }

    function toggleZenEditor() {
        if (currentMode === "zen-editor") {
            setMode("normal");
        } else {
            setMode("zen-editor");
        }
    }

    function toggleZenPreview() {
        if (currentMode === "zen-preview") {
            setMode("normal");
        } else {
            setMode("zen-preview");
        }
    }

    function updateButtonIcon() {
        if (!btnZenToggle) return;
        const icon = btnZenToggle.querySelector("i");
        if (!icon) return;

        if (currentMode !== "normal") {
            icon.className = "bi bi-fullscreen-exit text-danger";
            btnZenToggle.setAttribute("title", "Exit Zen Mode (Esc)");
        } else {
            icon.className = "bi bi-arrows-fullscreen text-secondary";
            btnZenToggle.setAttribute("title", "Zen Focus Mode (F10)");
        }
    }

    // Button click: Default editor focus toggle karega
    if (btnZenToggle) {
        btnZenToggle.addEventListener("click", toggleZenEditor);
    }

    // Keyboard Shortcuts:
    // F10: Toggle Zen Editor
    // Shift + F10: Toggle Zen Preview
    // Escape: Exit Zen Mode
    window.addEventListener("keydown", (e) => {
        if (e.key === "F10") {
            e.preventDefault();
            if (e.shiftKey) {
                toggleZenPreview();
            } else {
                toggleZenEditor();
            }
        } else if (e.key === "Escape" && currentMode !== "normal") {
            e.preventDefault();
            setMode("normal");
        }
    });
})();