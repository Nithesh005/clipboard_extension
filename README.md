# 📋 Clipboard Manager

Save and manage your clipboard history with tags, search, and quick access in your Chrome browser.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg)

## 📖 About

**Clipboard Manager** is a lightweight Chrome extension that automatically saves your clipboard history to browser local storage. Never lose important snippets, links, or code again! The extension features a beautiful, modern UI with powerful search capabilities and tagging system to help you organize and retrieve your saved items.

### Key Features:
- 🔄 **Auto-save**: Automatically tracks clipboard changes when the extension opens
- 🏷️ **Tagging System**: Tag items with multiple labels for easy organization
- 🔍 **Smart Search**: Search across tags, IDs, and content
- 📊 **History Management**: Store up to 100 items with timestamp tracking
- 💾 **Local Storage**: All data stored securely in Chrome's local storage (offline access)
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- ⚡ **Fast & Lightweight**: Minimal memory footprint with instant access

## ✨ Features

- **Automatic Clipboard Tracking** – Copy text anywhere, and it appears in your history
- **Add Custom Tags** – Tag items with comma-separated labels for better organization
- **Search & Filter** – Instantly search by tags, ID, or content
- **View Full Content** – Click "View" to see the complete content in a full-screen modal
- **One-Click Copy** – Copy any saved item back to your clipboard instantly
- **Delete Items** – Remove unwanted entries from history
- **Clear All** – Bulk delete entire history when needed
- **Date Grouping** – Items automatically grouped by date (Today, Yesterday, etc.)
- **Status Messages** – Real-time feedback on your actions (saved, copied, deleted)
- **Toast Notifications** – Non-intrusive confirmations for all user actions

## 🛠️ Tech Stack

- **HTML5** – Semantic markup and structure
- **CSS3** – Modern styling with custom CSS variables for theming
- **JavaScript (ES6+)** – Chrome Extension Manifest V3 compatible
- **Chrome Storage API** – Persistent local storage for history and preferences
- **Chrome Clipboard API** – Read/write clipboard access

## 📥 Installation

### Option 1: Clone with Git

```bash
git clone https://github.com/Nithesh005/clipboard_extension.git
cd clipboard_extension
```

### Option 2: Download as ZIP

1. Go to the repository page: `https://github.com/Nithesh005/clipboard_extension`
2. Click the green **Code** button
3. Select **Download ZIP**
4. Extract the ZIP file to a folder on your computer

## 🚀 Quick Start

### Load the Extension in Chrome (Developer Mode)

1. Open Google Chrome and navigate to `chrome://extensions/`
2. Turn on **Developer mode** using the toggle in the top-right corner
3. Click the **Load unpacked** button
4. Select the folder where you cloned/extracted the project (must contain `manifest.json`)
5. The extension will appear in your extensions list. Click the puzzle-piece icon 🧩 to pin it to your toolbar

## ▶️ Usage

### Basic Workflow

1. **Open the Extension** – Click the Clipboard Manager icon in your Chrome toolbar
2. **Copy Text** – Copy any text to your clipboard from any website or application
3. **Auto-Save** – The text automatically appears in your history
4. **Add Tags** – Type comma-separated tags in the input field and click "Save" or press Enter
5. **Search** – Use the search bar to find items by tag, ID, or content
6. **Copy Items** – Click the "Copy" button on any item to copy it back to your clipboard
7. **View Full Content** – Click "View" to see the complete text in a modal window

### Advanced Features

- **Tag-Based Filtering**: Click any tag chip to filter items with that tag
- **Smart Search**: Search works across item IDs (last 6 characters), content, and tags
- **Date Grouping**: Items are automatically grouped into "Today", "Yesterday", and other dates
- **Status Indicators**: The header shows the current count of items or search results
- **Quick Actions**: Each item has Copy, View, and Delete buttons for quick access

## 🔄 Updating

If you make changes to the source code:

1. Save your changes
2. Go to `chrome://extensions/`
3. Click the **Reload** icon (circular arrow) on the Clipboard Manager extension card

## 📁 Project Structure

```
clipboard_extension/
├── manifest.json          # Chrome extension configuration
├── popup.html            # Main UI (400x580px popup)
├── popup.js              # All functionality and event handlers
└── README.md             # This file
```

### File Descriptions

- **manifest.json** – Declares the extension metadata, permissions, and UI entry point
- **popup.html** – Contains the complete UI with semantic HTML and embedded CSS
- **popup.js** – Handles all logic: clipboard reading, storage, search, and interactions

## ⚙️ Permissions

The extension requests the following permissions from Chrome:

| Permission | Purpose |
|-----------|---------|
| `storage` | Save and retrieve clipboard history in local storage |
| `clipboardRead` | Read text from the system clipboard |
| `clipboardWrite` | Write copied items back to the clipboard |

These permissions are necessary for core functionality and are only used within the extension.

## 📊 Data Structure

Each clipboard item is stored with the following structure:

```javascript
{
  id: "CLIP-1688123456789-abc123",    // Unique identifier
  text: "Your copied text here",      // The actual clipboard content
  tags: ["tag1", "tag2"],             // Associated tags (max 6)
  createdAt: "2023-06-30T12:34:56Z"   // ISO timestamp
}
```

### Storage Limits

- **Max Items**: 100 in history (oldest items are automatically removed)
- **Max Tags per Item**: 6 tags
- **Storage Location**: Chrome's local storage (per profile, per device)

## 🐛 Known Issues

- Clipboard access requires explicit user action (paste/save button click) due to Chrome security
- Extension only works within the Chrome browser
- History is stored per Chrome profile and not synced across devices
- Clipboard API may require HTTPS in some contexts

## 🚀 Future Enhancements

- [ ] Sync across devices using Chrome Sync API
- [ ] Export history as JSON/CSV
- [ ] Keyboard shortcuts for quick access
- [ ] Categories and custom organization
- [ ] Dark mode toggle
- [ ] Item favorites/pinning
- [ ] Cloud backup option

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your work (`git commit -m 'Add some feature'`)
5. Push to your branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Developed with ❤️ by **Nithesh**

- 🌐 Website: [nithi.shop](https://nithi.shop)
- 📧 Email: [contact via website](https://nithi.shop)
- 🐙 GitHub: [@Nithesh005](https://github.com/Nithesh005)

## 🎉 Credits

- Icons from Feather Icons
- Design inspired by modern clipboard managers
- Built with Chrome Extension Manifest V3

---

**Happy copying! 📋✨**
