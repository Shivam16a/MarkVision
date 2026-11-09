// tocgenerator.js - Fixed Clean Relative Table of Contents Generator

(function () {
    const editor = document.getElementById("markdown-input");
    const btnToc = document.getElementById("btn-generate-toc");

    if (!editor) return;

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/<[^>]*>/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function generateTableOfContents() {
        const content = editor.value;
        if (!content.trim()) {
            showToast("Pehle editor me content aur headings likhein!");
            return;
        }

        const lines = content.split('\n');
        const rawHeadings = [];
        let inCodeBlock = false;

        // Step 1: Headings scan karein aur code blocks ko ignore karein
        for (let line of lines) {
            const trimmed = line.trim();

            if (trimmed.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                continue;
            }
            if (inCodeBlock) continue;

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const rawTitle = headingMatch[2].trim();

                // Skip TOC heading itself
                if (/^table of contents$/i.test(rawTitle)) {
                    continue;
                }

                rawHeadings.push({ level, title: rawTitle });
            }
        }

        if (rawHeadings.length === 0) {
            showToast("Koi Markdown Headings (# ya ##) nahi mili!");
            return;
        }

        // Step 2: Minimum level find karein (e.g., agar sabse chhoti heading ### hai toh wahi base banegi)
        const minLevel = Math.min(...rawHeadings.map(h => h.level));

        // Step 3: Clean Relative Indented TOC banayein
        const tocItems = rawHeadings.map(h => {
            const relativeLevel = h.level - minLevel;
            const indent = "  ".repeat(relativeLevel);
            const slug = slugify(h.title);
            return `${indent}- [${h.title}](#${slug})`;
        });

        const tocMarkdown = `## 📋 Table of Contents\n\n${tocItems.join('\n')}\n\n---\n`;

        // Step 4: Existing TOC ko replace karein ya top par inject karein
        const existingTocRegex = /##\s*📋?\s*Table of Contents[\s\S]*?(?=(^##|\n---|\n#\s|$))/i;

        if (existingTocRegex.test(editor.value)) {
            editor.value = editor.value.replace(existingTocRegex, tocMarkdown);
        } else {
            const firstHeadingMatch = editor.value.match(/^#\s+.+\n+/);
            if (firstHeadingMatch) {
                const insertIndex = firstHeadingMatch[0].length;
                editor.value = editor.value.slice(0, insertIndex) + `\n${tocMarkdown}\n` + editor.value.slice(insertIndex);
            } else {
                const start = editor.selectionStart;
                editor.setRangeText(`\n${tocMarkdown}\n`, start, start, "end");
            }
        }

        if (typeof renderMarkdown === "function") renderMarkdown();
        if (typeof recordHistoryState === "function") recordHistoryState(editor.value);

        showToast("Clean Table of Contents generated! 📋");
    }

    if (btnToc) {
        btnToc.addEventListener("click", generateTableOfContents);
    }

    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "c") {
            e.preventDefault();
            generateTableOfContents();
        }
    });
})();