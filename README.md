# Diagram Generator

A modern web application that converts natural language prompts into visual diagrams using AI.

## Features

- **Natural Language to Diagrams**: Describe what you want, get a diagram
- **Multiple Diagram Types**: Flowcharts, org charts, decision trees, timelines, architecture diagrams
- **Interactive Canvas**: Drag, zoom, pan, and edit nodes
- **Export Options**: Save diagrams as PNG, SVG, or JSON
- **Minimal Design**: Clean black and white interface

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Flow** - Interactive diagram rendering
- **OpenAI API** - Natural language understanding

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd diagram-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a description of the diagram you want to create
2. Click "Generate Diagram"
3. The AI will analyze your prompt and create a structured diagram
4. Interact with the diagram:
   - Drag nodes to reposition
   - Zoom and pan the canvas
   - Edit node labels by double-clicking
   - Export as PNG, SVG, or JSON

### Example Prompts

- "Create a flowchart for user authentication process"
- "Show an org chart for a tech startup with CEO, CTO, and engineering teams"
- "Decision tree for choosing a cloud provider"
- "Timeline of major web development milestones from 2010 to 2024"
- "System architecture diagram for a microservices e-commerce platform"

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate-diagram/
│   │       └── route.ts          # API endpoint for diagram generation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page component
│   └── globals.css               # Global styles
├── components/
│   ├── PromptInput.tsx           # Landing page with prompt input
│   └── DiagramCanvas.tsx         # Diagram rendering and interaction
├── lib/
│   ├── layoutUtils.ts            # Auto-layout algorithms
│   └── exportUtils.ts            # Export functionality
├── types/
│   └── diagram.ts                # TypeScript type definitions
└── package.json
```

## Supported Diagram Types

1. **Flowchart**: Sequential process flows
2. **Org Chart**: Organizational hierarchies
3. **Decision Tree**: Branching decision paths
4. **Timeline**: Chronological events
5. **Architecture**: System component relationships

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Extending the Application

### Adding New Diagram Types

1. Update the `DiagramType` in `types/diagram.ts`
2. Add layout logic in `lib/layoutUtils.ts`
3. Update the OpenAI prompt in `app/api/generate-diagram/route.ts`

### Customizing Node Styles

Edit the CSS in `app/globals.css` under the `.react-flow__node` selectors.

### Adding Export Formats

Extend `lib/exportUtils.ts` with new export functions.

## Optional Enhancements

To enable full PNG export functionality:

```bash
npm install html2canvas
```

Then uncomment the code in `lib/exportUtils.ts`.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
