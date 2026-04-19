# EML Editor

A modern, visual email builder for creating professional HTML emails and exporting them as `.eml` files. Built with React and designed for Outlook compatibility.

![EML Editor](public/favicon.svg)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [Development](#development)
- [Project Structure](#project-structure)

---

## Features

### Visual Email Builder
- **60+ Pre-built Elements**: Headers, heroes, content blocks, images, CTAs, e-commerce sections, cards, buttons, surveys, carousels, and footers
- **Drag & Drop Canvas**: Intuitive interface for arranging email elements
- **Real-time Preview**: See exactly how your email will look before exporting
- **Theme System**: 5 built-in themes (Light, Dark, Tokyo Night, Modern, Natural) with one-click switching

### Import & Export
- **EML Export**: Download emails as standard `.eml` files compatible with Outlook and other email clients
- **EML Import**: Upload existing `.eml` files and edit them visually
- **Image Embedding**: Automatic image embedding for self-contained emails
- **Session Export/Import**: Save and load your work as JSON session files

### Session Management
- **Autosave**: Automatic draft recovery using browser storage
- **Named Sessions**: Save multiple projects with custom names
- **Draft Restoration**: Prompt to restore unsaved work on app reload

### Customization
- **Property Panel**: Rich editing for each element's content, colors, spacing, and layout
- **Global Settings**: Configure email metadata (subject, from, to, cc, bcc), canvas width, background color, and font family
- **Responsive Design**: Emails are built to display correctly across clients

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [@dnd-kit](https://dndkit.com/) | Drag & drop functionality |
| [Lucide React](https://lucide.dev/) | Icon library |
| [html-to-image](https://github.com/bubkoo/html-to-image) | Image generation for exports |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd windsurf-project-4
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to `http://localhost:5173` in your browser

### Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Usage Guide

### Creating an Email

1. **Add Elements**: Click any element from the left sidebar to add it to your canvas
2. **Arrange**: Drag elements to reorder them
3. **Edit Properties**: Select an element and use the right panel to customize it
4. **Configure Email**: Click the email title in the top bar or the **Export .eml** button to set metadata (subject, recipients)

### Managing Sessions

#### Saving Your Work
- **Quick Save**: Use the **Menu → Save session** to download a `.json` file
- **Named Sessions**: Enter a name in the left sidebar's "Name this session" field and click **Save**

#### Loading Previous Work
- **Session Files**: Use **Menu → Load session** to import a `.json` session file
- **Named Sessions**: Click **Load session** on any saved session card in the left sidebar
- **Autosave Recovery**: If you have an unsaved draft, the app will prompt you to restore it on reload

### Importing EML Files

1. Click **Menu → Load .eml file**
2. Select a `.eml` file from your computer
3. The email will be parsed into editable blocks

### Exporting Emails

1. Click **Export .eml** or click the email title in the header
2. Configure email metadata (subject, from, to, cc, bcc)
3. Choose export mode:
   - **Standard**: HTML email with linked images
   - **Image**: Renders email as an embedded image (for complex layouts)
4. Click **Export** to download the `.eml` file

### Using Themes

Select a theme from the left sidebar's theme dropdown to instantly apply:
- Color scheme
- Font family
- Background colors

Available themes: **Light**, **Dark**, **Tokyo Night**, **Modern**, **Natural**

### Keyboard Shortcuts & Tips

- **Select**: Click any element on the canvas to select it
- **Duplicate**: Use the duplicate button in the property panel
- **Delete**: Click the trash icon or use the delete button in the property panel
- **Collapse Panels**: Use the **Left** and **Right** buttons in the header to hide/show panels

---

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Elements   │  │    Canvas    │  │   Property   │      │
│  │   Sidebar    │  │              │  │    Panel     │      │
│  │              │  │  (Elements   │  │              │      │
│  │  - Themes    │  │   rendered   │  │  - Edit      │      │
│  │  - Element   │  │   here)      │  │    properties│      │
│  │    library   │  │              │  │  - Delete    │      │
│  │  - Sessions  │  │              │  │  - Duplicate │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  Modals: EmailMetaModal, PreviewModal, GlobalSettingsModal │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **State Management**: Centralized in `App.jsx` using React hooks
2. **Element Storage**: Elements stored as JSON objects with type and props
3. **Rendering Pipeline**: `htmlRenderer.js` converts elements to email-safe HTML
4. **Persistence**: `sessionPersistence.js` handles localStorage and file operations

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code checks |

### Adding New Elements

Elements are defined in `src/data/elements.js` within the `ELEMENT_TEMPLATES` object. Each element needs:

- `id`: Unique identifier
- `label`: Display name
- `thumbnail`: Thumbnail key for visual representation
- `defaults`: Default property values

### Adding New Themes

Themes are defined in `src/data/themes.js`. Add a new theme to the `THEMES` object:

```javascript
myTheme: {
  id: 'myTheme',
  name: 'My Theme',
  canvasBackground: '#ffffff',
  elementBackground: '#f9fafb',
  textColor: '#111827',
  primaryColor: '#4f46e5',
  fontFamily: 'sans-serif',
  colorPreview: '#f4f4f5',
}
```

---

## Project Structure

```
windsurf-project-4/
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── Canvas.jsx          # Main workspace
│   │   ├── ElementsSidebar.jsx # Element library sidebar
│   │   ├── ElementThumbnail.jsx# Element preview thumbnails
│   │   ├── PropertyPanel.jsx   # Element property editor
│   │   ├── EmailMetaModal.jsx  # Email metadata modal
│   │   ├── PreviewModal.jsx    # Email preview modal
│   │   ├── GlobalSettingsModal.jsx # Global settings modal
│   │   └── SpacingEditor.jsx   # Spacing controls
│   ├── data/
│   │   ├── elements.js         # 60+ element templates
│   │   └── themes.js           # Theme definitions
│   ├── utils/
│   │   ├── emlExporter.js     # Export to .eml format
│   │   ├── emlImporter.js     # Import from .eml files
│   │   ├── htmlRenderer.js    # HTML generation for email
│   │   ├── sessionPersistence.js # Save/load sessions
│   │   └── themeHelper.js     # Theme application utilities
│   ├── App.jsx                # Main application component
│   ├── App.css                # Component styles
│   ├── index.css              # Global styles
│   └── main.jsx               # Application entry point
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
└── eslint.config.js           # ESLint rules
```

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

MIT License - feel free to use this project for personal or commercial purposes.
