# Diagram Generator

A modern, feature-rich web application that converts natural language prompts into interactive visual diagrams using AI. Create, customize, and export professional diagrams with ease!

## ✨ Features

### 🎨 Visual Customization
- **4 Diagram Themes**: Classic B&W, Modern Blue, Dark Mode, and Nature Green
- **Light/Dark Mode**: Full app-wide theme toggle with persistent preferences
- **Custom Node Colors**: 10+ color options for individual nodes
- **Photo Upload**: Add images to any node via hover menu
- **Dotted Grid Background**: Clean, professional dotted pattern

### 🖱️ Interactive Editing
- **Drag & Drop**: Reposition nodes freely
- **Manual Connections**: Connect nodes by dragging handles
- **Node Editing**: Hover menu for photos, colors, and deletion
- **Multi-Select**: Ctrl+Click to select multiple nodes
- **Zoom & Pan**: Full canvas navigation

### ⌨️ Keyboard Shortcuts
- **Ctrl+Z** / **Ctrl+Y** - Undo/Redo (50-state history)
- **Ctrl+C** / **Ctrl+V** - Copy/Paste nodes
- **Ctrl+A** - Select all
- **Ctrl+N** - Add new node
- **Delete** - Remove selected items
- **Escape** - Deselect all
- **?** - Show shortcuts panel

### 📊 Diagram Types
- **Flowcharts** - Sequential process flows
- **Org Charts** - Organizational hierarchies
- **Decision Trees** - Branching decision paths
- **Timelines** - Chronological events
- **Architecture** - System component relationships

### 💾 Export Options
- **PNG Export** - High-quality 1920x1080 images with proper theming
- **SVG Export** - Vector graphics for scalability
- **JSON Export** - Save diagram structure for later use

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Flow** - Interactive diagram rendering
- **Hugging Face API** - Free AI-powered diagram generation
- **html2canvas** - Professional image export

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Hugging Face API token (free at [huggingface.co](https://huggingface.co))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KRITHIKR007/Flow-chart-maker.git
cd Flow-chart-maker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Hugging Face API token:
```
HUGGINGFACE_API_KEY=hf_your_token_here
```

Get your free token at: https://huggingface.co/settings/tokens

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage Guide

### Creating a Diagram

1. **Name Your Chart** (optional) - Give your diagram a meaningful name
2. **Choose Theme** - Select from 4 beautiful diagram themes
3. **Toggle App Theme** - Switch between light/dark mode (🌙/☀️)
4. **Describe Your Diagram** - Enter a natural language description
5. **Generate** - Let AI create your diagram instantly!

### Editing Your Diagram

**Hover over any node** to see options:
- 📷 **Photo** - Upload an image
- 🎨 **Color** - Choose from 10 colors
- 🗑️ **Delete** - Remove the node

**Connect nodes**: Drag from bottom handle to top handle of another node

**Organize**: Drag nodes anywhere, use "Reset Layout" to restore original positions

### Keyboard Shortcuts

Press **?** anytime to see the full shortcuts panel with:
- Editing shortcuts (copy, paste, undo, redo)
- Selection shortcuts (select all, deselect)
- Navigation tips (zoom, pan)
- Pro tips for power users

### Example Prompts

- "Create a flowchart for user authentication process"
- "Show an org chart for a tech startup with CEO, CTO, and engineering teams"
- "Decision tree for choosing a cloud provider"
- "Timeline of major web development milestones from 2010 to 2024"
- "System architecture diagram for a microservices e-commerce platform"

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── generate-diagram/
│   │       └── route.ts          # Hugging Face API integration
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main app with theme management
│   └── globals.css               # Global styles & animations
├── components/
│   ├── PromptInput.tsx           # Landing page with theme selector
│   ├── DiagramCanvas.tsx         # Interactive canvas with all features
│   └── CustomNode.tsx            # Custom node with hover menu
├── lib/
│   ├── layoutUtils.ts            # Auto-layout algorithms for each diagram type
│   ├── exportUtils.ts            # PNG/SVG/JSON export functions
│   ├── themes.ts                 # 4 diagram theme configurations
│   └── appTheme.ts               # Light/dark mode definitions
├── types/
│   └── diagram.ts                # TypeScript type definitions
└── package.json
```

## 🎨 Themes

### Diagram Themes (Applied to Canvas)
1. **Classic B&W** - Traditional black and white
2. **Modern Blue** - Clean blue accents
3. **Dark Mode** - Dark canvas with light nodes
4. **Nature Green** - Fresh green theme

### App Themes (Full Interface)
- **Light Mode** - Clean white interface
- **Dark Mode** - Modern dark UI with blue accents

## ⚙️ Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🔧 Extending the Application

### Adding New Diagram Types

1. Update `DiagramType` in `types/diagram.ts`
2. Add layout logic in `lib/layoutUtils.ts` → `calculateNodePositions()`
3. Add theme-aware rendering if needed

### Adding New Themes

1. Add to `themes` object in `lib/themes.ts`
2. Include preview square colors
3. Test with all diagram types

### Customizing Node Styles

Edit `.react-flow__node` styles in `app/globals.css`

## 🌟 Key Features Explained

### Undo/Redo System
- Tracks up to 50 states
- Works with all operations (move, delete, color, etc.)
- Smart history management prevents memory bloat

### Copy/Paste
- Copies selected nodes with all properties
- Pastes with automatic offset (50px)
- Preserves colors and images

### Export System
- **PNG**: Uses html2canvas for high-quality export
- Respects selected theme colors
- Filename based on chart name

### Theme Persistence
- Light/dark mode saved in localStorage
- Automatically loads on app start
- Smooth transitions between modes

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### To Contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Hugging Face API errors
- Check your API token is valid
- Ensure it's properly set in `.env.local`
- Restart the dev server after changing env variables

### Export not working
- PNG export requires html2canvas (already installed)
- Check browser console for errors
- Try a different browser

## 🙏 Acknowledgments

- React Flow for the amazing diagramming library
- Hugging Face for free AI API access
- Next.js team for the excellent framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ using Next.js, React Flow, and Hugging Face AI**
