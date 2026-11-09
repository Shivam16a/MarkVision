// badgegenerator.js - Dynamic Custom Badge Generator with Shortcut Support

(function () {
    const editor = document.getElementById("markdown-input");
    const inputLabel = document.getElementById("badge-custom-label");
    const inputColor = document.getElementById("badge-custom-color");
    const selectStyle = document.getElementById("badge-custom-style");
    const previewContainer = document.getElementById("badge-custom-preview");
    const btnInsert = document.getElementById("btn-insert-custom-badge");

    if (!editor) return;

    // Helper: URL-safe Shields.io Badge URL generator
    function getGeneratedBadgeUrl() {
        const rawLabel = (inputLabel?.value || "MyBadge").trim();
        // Dashes ya special spaces ko properly handle karein
        const label = encodeURIComponent(rawLabel.replace(/-/g, "--").replace(/_/g, "__"));
        const color = (inputColor?.value || "#0d6efd").replace("#", "");
        const style = selectStyle?.value || "for-the-badge";

        return `https://img.shields.io/badge/${label}-${color}?style=${style}`;
    }

    // Live Preview update helper
    function updatePreview() {
        if (!previewContainer) return;
        const url = getGeneratedBadgeUrl();
        const altText = inputLabel?.value.trim() || "Badge Preview";
        previewContainer.innerHTML = `<img src="${url}" alt="${altText}" />`;
    }

    // Badge ko Markdown cursor position par insert karna
    function insertBadgeToEditor() {
        const labelText = inputLabel?.value.trim();
        if (!labelText) {
            showToast("Pehle badge ka name/label likhein!");
            inputLabel?.focus();
            return;
        }

        const badgeUrl = getGeneratedBadgeUrl();
        const badgeMarkdown = ` <img src="${badgeUrl}" alt="${labelText}" /> `;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText(badgeMarkdown, start, end, "end");

        if (typeof renderMarkdown === "function") renderMarkdown();
        if (typeof recordHistoryState === "function") recordHistoryState(editor.value);

        // Modal close karein
        const modalEl = document.getElementById("customBadgeModal");
        if (modalEl && typeof bootstrap !== "undefined") {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }

        showToast(`Badge "${labelText}" inserted! 🏷️`);
    }

    // Event Listeners for inputs
    [inputLabel, inputColor, selectStyle].forEach((el) => {
        if (el) {
            el.addEventListener("input", updatePreview);
            el.addEventListener("change", updatePreview);
        }
    });

    // Enter press karne par direct insert
    inputLabel?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            insertBadgeToEditor();
        }
    });

    btnInsert?.addEventListener("click", insertBadgeToEditor);

    // Modal open hote hi text input par autofocus aur preview ready
    const modalEl = document.getElementById("customBadgeModal");
    if (modalEl) {
        modalEl.addEventListener("shown.bs.modal", () => {
            updatePreview();
            inputLabel?.focus();
            inputLabel?.select();
        });
    }

    // ⌨️ Keyboard Shortcut: Alt + B (Custom Badge Modal Open)
    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "b") {
            e.preventDefault();
            if (modalEl && typeof bootstrap !== "undefined") {
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
        }
    });
})();