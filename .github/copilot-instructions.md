# Diagram Generator - AI Coding Instructions

## Project Overview
A Next.js web app that converts natural language prompts into interactive diagrams using OpenAI API and React Flow. Clean black/white design, supporting flowcharts, org charts, decision trees, timelines, and architecture diagrams.

## Architecture

### Data Flow
1. User enters prompt → `PromptInput.tsx`
2. POST to `/api/generate-diagram` → `app/api/generate-diagram/route.ts`
3. OpenAI generates JSON → parsed into `DiagramData` type
4. Converted to React Flow format → `lib/layoutUtils.ts`
5. Rendered in `DiagramCanvas.tsx` with React Flow

### Key Components
- **PromptInput.tsx**: Landing page, rotating placeholder examples every 3s
- **DiagramCanvas.tsx**: Interactive canvas with toolbar (export, regenerate, reset)
- **API Route**: `/api/generate-diagram/route.ts` - OpenAI integration with strict JSON response
- **Layout Engine**: `lib/layoutUtils.ts` - Auto-positions nodes based on diagram type

## Critical Patterns

### Type System
All diagram data uses `types/diagram.ts`:
```typescript
DiagramData { type, nodes: DiagramNode[], edges: DiagramEdge[] }
```
OpenAI must return this exact structure. API validates before sending to client.

### Layout Algorithms
`calculateNodePositions()` in `lib/layoutUtils.ts`:
- **Timeline**: Horizontal layout
- **Org Chart/Decision Tree**: BFS hierarchical top-down
- **Flowchart/Architecture**: Vertical flow from root nodes

Each type has custom spacing constants (NODE_WIDTH=180, VERTICAL_SPACING=120).

### OpenAI Integration
System prompt (in `route.ts`): "You convert user prompts into structured diagram data. Identify the diagram type, extract clear nodes and relationships, keep labels short, ensure logical flow. Output ONLY valid JSON. No explanations."

Uses `response_format: { type: 'json_object' }` to enforce JSON output.

## Developer Workflows

### Running Locally
```bash
npm install
cp .env.local.example .env.local  # Add OPENAI_API_KEY
npm run dev  # http://localhost:3000
```

### Adding Diagram Types
1. Add to `DiagramType` union in `types/diagram.ts`
2. Implement layout logic in `calculateNodePositions()` switch
3. Update OpenAI prompt examples if needed

### Styling Convention
- No colors except black/white/gray
- Tailwind classes: `bg-white`, `text-black`, `border-black`
- React Flow nodes: white bg, 2px black border (see `globals.css`)

## State Management
Main state in `app/page.tsx`:
- `diagramData`: Current diagram or null
- `isGenerating`: Loading state
- Toggles between `PromptInput` and `DiagramCanvas` components

React Flow state in `DiagramCanvas.tsx`:
- `useNodesState` and `useEdgesState` hooks
- Supports manual dragging, edge connections, layout reset

## Export System
`lib/exportUtils.ts` provides:
- **PNG**: Requires `html2canvas` (optional dependency, commented out)
- **SVG**: Clones `.react-flow__edges` element, serializes to file
- **JSON**: Exports nodes/edges array

Currently PNG shows alert - uncomment code after installing html2canvas.

## Environment
Required: `OPENAI_API_KEY` in `.env.local`
Model: `gpt-4-turbo-preview` (can switch to gpt-4o for better JSON)

## Common Tasks

### Modify Node Appearance
Edit `.react-flow__node` styles in `app/globals.css`

### Change Layout Spacing
Update constants in `lib/layoutUtils.ts`:
```typescript
const HORIZONTAL_SPACING = 100
const VERTICAL_SPACING = 120
```

### Adjust OpenAI Temperature
In `route.ts`, modify `temperature: 0.7` (lower = more deterministic)

## Testing Locally
Use example prompts from `PromptInput.tsx`:
- "Create a flowchart for user authentication process"
- "Show an org chart for a tech startup..."
- Test all 5 diagram types to verify layout algorithms

## Important Notes
- App Router only (not Pages Router)
- Client components use `'use client'` directive
- All file paths use `@/*` imports (configured in `tsconfig.json`)
- React Flow requires CSS import in component
- MiniMap and Controls are optional but included for better UX
