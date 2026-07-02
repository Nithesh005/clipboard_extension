const button = document.getElementById("btn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const clipboardList = document.getElementById("clipboardList");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const tagsInput = document.getElementById("itemTags");
const statusMessage = document.getElementById("statusMessage");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const modalCopy = document.getElementById("modalCopy");
const toast = document.getElementById("toast");

const MAX_ITEMS = 100;
let modalItem = null;
let toastTimer = null;

const ICONS = {
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    view: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`,
};

document.addEventListener("DOMContentLoaded", async () => {
    await ensureCurrentClipboardInHistory();
});

button.addEventListener("click", () => saveCurrentClipboard());

tagsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        saveCurrentClipboard();
    }
});

clearHistoryBtn.addEventListener("click", () => {
    chrome.storage.local.remove(["history"], () => {
        loadClipboardHistory();
        showToast("History cleared");
    });
});

async function saveCurrentClipboard() {
    const tags = parseTags(tagsInput.value);

    try {
        const text = await navigator.clipboard.readText();
        const normalizedText = text.trim();

        if (!normalizedText) {
            showToast("Clipboard is empty");
            return;
        }

        saveHistoryItem({ text: normalizedText, tags });
        tagsInput.value = "";
        showToast("Saved to history");
    } catch (err) {
        console.error(err);
        showToast("Unable to read clipboard");
    }
}

searchInput.addEventListener("input", () => {
    loadClipboardHistory();
});

searchClear.addEventListener("click", () => {
    searchInput.value = "";
    loadClipboardHistory();
    searchInput.focus();
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});

modalCopy.addEventListener("click", async () => {
    if (!modalItem) return;
    await navigator.clipboard.writeText(modalItem.text);
    showToast("Copied to clipboard");
    closeModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

async function ensureCurrentClipboardInHistory() {
    try {
        const text = await navigator.clipboard.readText();
        const normalizedText = text.trim();

        if (!normalizedText) {
            loadClipboardHistory();
            return;
        }

        chrome.storage.local.get(["history"], (result) => {
            let history = result.history || [];
            const existingIndex = history.findIndex(item => item.text === normalizedText);
            const createdAt = new Date().toISOString();

            if (existingIndex !== -1) {
                const existing = history.splice(existingIndex, 1)[0];
                existing.createdAt = createdAt;
                history.unshift(existing);
            } else {
                history.unshift({
                    id: createId(),
                    text: normalizedText,
                    tags: [],
                    createdAt,
                });
            }

            history = history.slice(0, MAX_ITEMS);
            chrome.storage.local.set({ history }, () => loadClipboardHistory());
        });
    } catch {
        loadClipboardHistory();
    }
}

function saveHistoryItem({ text, tags }) {
    chrome.storage.local.get(["history"], (result) => {
        let history = result.history || [];
        const existingIndex = history.findIndex(item => item.text === text);
        const createdAt = new Date().toISOString();

        if (existingIndex !== -1) {
            const existing = history.splice(existingIndex, 1)[0];
            existing.tags = tags.length ? tags : existing.tags;
            existing.createdAt = createdAt;
            history.unshift(existing);
        } else {
            history.unshift({
                id: createId(),
                text,
                tags,
                createdAt,
            });
        }

        history = history.slice(0, MAX_ITEMS);
        chrome.storage.local.set({ history }, () => loadClipboardHistory());
    });
}

function deleteHistoryItem(id) {
    chrome.storage.local.get(["history"], (result) => {
        let history = result.history || [];
        history = history.filter(item => item.id !== id);
        chrome.storage.local.set({ history }, () => {
            loadClipboardHistory();
            showToast("Item deleted");
        });
    });
}

function loadClipboardHistory() {
    chrome.storage.local.get(["history"], (result) => {
        const history = result.history || [];
        const query = searchInput.value.trim().toLowerCase();
        const filtered = history
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .filter(item => matchesSearchQuery(item, query));

        const total = history.length;
        clipboardList.innerHTML = "";

        if (!filtered.length) {
            statusMessage.textContent = query ? "No matches" : "No items yet";
            clipboardList.innerHTML = renderEmptyState(query);
            return;
        }

        statusMessage.textContent = query
            ? `${filtered.length} of ${total} shown`
            : `${filtered.length} in history`;

        const groups = groupHistoryByDate(filtered);

        Object.entries(groups).forEach(([groupLabel, items]) => {
            const groupHeader = document.createElement("div");
            groupHeader.className = "group-heading";
            groupHeader.textContent = groupLabel;
            clipboardList.appendChild(groupHeader);

            items.forEach(item => {
                clipboardList.appendChild(createHistoryItemElement(item));
            });
        });
    });
}

function renderEmptyState(isSearch) {
    if (isSearch) {
        return `
            <div class="empty-state">
                <div class="empty-icon">${ICONS.clipboard}</div>
                <h3>No results</h3>
                <p>Try a different search term or clear the filter.</p>
            </div>`;
    }

    return `
        <div class="empty-state">
            <div class="empty-icon">${ICONS.clipboard}</div>
            <h3>Nothing here yet</h3>
            <p>Copy some text and open this extension — it will appear automatically.</p>
        </div>`;
}

function createHistoryItemElement(item) {
    const element = document.createElement("div");
    element.className = "clipboard-item";

    const previewText = shorten(item.text, 180);
    const formattedDate = formatDateTime(item.createdAt);
    const itemId = item.id.slice(-6).toUpperCase();

    element.innerHTML = `
        <div class="item-header">
            <div class="item-meta">${escapeHtml(formattedDate)}</div>
            <div class="item-id">${escapeHtml(itemId)}</div>
        </div>
        <div class="item-text">${escapeHtml(previewText)}</div>
        ${item.tags.length ? `<div class="tags">${item.tags.map(tag => `<span class="tag-chip" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="action-row">
            <button class="icon-btn copy-button">${ICONS.copy} Copy</button>
            <button class="icon-btn" data-open="full">${ICONS.view} View</button>
            <button class="icon-btn danger delete-button">${ICONS.delete} Delete</button>
        </div>
    `;

    element.querySelector(".copy-button").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        await navigator.clipboard.writeText(item.text);
        btn.classList.add("copied");
        btn.innerHTML = `${ICONS.copy} Copied`;
        setTimeout(() => {
            btn.classList.remove("copied");
            btn.innerHTML = `${ICONS.copy} Copy`;
        }, 1500);
    });

    element.querySelector(".delete-button").addEventListener("click", () => {
        deleteHistoryItem(item.id);
    });

    element.querySelector("button[data-open=full]").addEventListener("click", () => {
        openModal(item);
    });

    element.querySelectorAll(".tag-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            searchInput.value = chip.dataset.tag;
            loadClipboardHistory();
        });
    });

    return element;
}

function openModal(item) {
    modalItem = item;
    modalTitle.textContent = `${formatDateTime(item.createdAt)} · ${item.id.slice(-6).toUpperCase()}`;
    modalContent.textContent = item.text;

    modalMeta.innerHTML = `
        <span>ID ${escapeHtml(item.id.slice(-8).toUpperCase())}</span>
        <span>${escapeHtml(formatDateTime(item.createdAt))}</span>
        ${item.tags.length ? item.tags.map(t => `<span>${escapeHtml(t)}</span>`).join("") : '<span>No tags</span>'}
    `;

    modalOverlay.classList.add("open");
}

function closeModal() {
    modalOverlay.classList.remove("open");
    modalItem = null;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function matchesSearchQuery(item, query) {
    if (!query) return true;

    const haystack = [item.id, item.text, item.tags.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return haystack.includes(query);
}

function groupHistoryByDate(historyItems) {
    return historyItems.reduce((groups, item) => {
        const label = getGroupLabel(item.createdAt);
        if (!groups[label]) groups[label] = [];
        groups[label].push(item);
        return groups;
    }, {});
}

function getGroupLabel(createdAt) {
    const itemDate = new Date(createdAt);
    const now = new Date();
    const day = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((stripTime(now) - stripTime(itemDate)) / day);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return itemDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateTime(createdAt) {
    const date = new Date(createdAt);
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function parseTags(rawTags) {
    return rawTags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean)
        .slice(0, 6);
}

function createId() {
    return `CLIP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function shorten(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "…";
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}
