// editorfeatures.js - Clean In-Memory Blob Engine (Zero Cloud, Zero Backend, Zero Base64 Clutter)
(function () {
    const editor = document.getElementById("markdown-input");
    const editorPane = document.getElementById("editor-pane");

    if (!editor || !editorPane) return;

    window.markVisionImageStore = window.markVisionImageStore || new Map();
    let imgCounter = 1;

    function handleImageFile(file) {
        if (!file || !file.type.startsWith("image/")) {
            if (typeof showToast === "function") showToast("Sirf image files allowed hain!");
            return;
        }

        // 1. Create clean in-memory Virtual Blob URL
        const blobUrl = URL.createObjectURL(file);

        // Sanitize clean label
        const cleanName = file.name ? file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-") : `image-${imgCounter++}`;

        // Save reference in memory
        window.markVisionImageStore.set(blobUrl, file);

        // 2. Insert clean Markdown tag at cursor
        const cleanMarkdown = `\n![${cleanName}](${blobUrl})\n`;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText(cleanMarkdown, start, end, "end");

        // 3. Dispatch native input event so Marked & DOMPurify parse it immediately
        editor.dispatchEvent(new Event("input", { bubbles: true }));

        if (typeof recordHistoryState === "function") {
            recordHistoryState(editor.value);
        }

        if (typeof showToast === "function") {
            showToast("Image loaded in preview! 🖼️");
        }
    }

    // Paste handling (Ctrl + V)
    editor.addEventListener("paste", (e) => {
        const items = (e.clipboardData || window.clipboardData)?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) handleImageFile(file);
                break;
            }
        }
    });

    // Drag-and-drop support
    ["dragenter", "dragover"].forEach((evt) => {
        editorPane.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorPane.classList.add("drag-active-zone");
        });
    });

    ["dragleave", "drop"].forEach((evt) => {
        editorPane.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorPane.classList.remove("drag-active-zone");
        });
    });

    editorPane.addEventListener("drop", (e) => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleImageFile(files[0]);
        }
    });
})();