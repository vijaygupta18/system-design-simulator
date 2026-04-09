# System Design Simulator - Project Summary

## Overview
SystemSim is a comprehensive system design simulator that helps users learn, practice, and improve their system design skills through interactive canvas-based design, simulation, and AI-powered analysis.

## Core Features

### 1. Interactive Design Canvas
- **Drag-and-drop interface** for system components
- **Component library** with realistic system elements (databases, caches, load balancers, etc.)
- **Visual connections** between components
- **Multi-tab support** for comparing designs
- **Text annotations** for documentation

### 2. Simulation Engine
- **Performance simulation** with configurable load parameters
- **Real-time metrics** (utilization, latency, throughput)
- **Bottleneck identification** with visual indicators
- **Component status tracking** (healthy, critical, degraded)

### 3. AI-Powered Analysis (New Feature)
- **Intelligent recommendations** based on system design patterns
- **Bottleneck detection** with specific component-level insights
- **Architecture improvement suggestions** with reasoning
- **Visual diagram hints** for design optimization
- **Structured JSON response** format

### 4. Learning & Practice Tools
- **Interview practice mode** with timer and guided questions
- **Design scoring** based on best practices
- **Reference solutions** for comparison
- **Custom problem creation** for targeted practice

## Technical Architecture

### Frontend Stack
- **Next.js 15** with App Router
- **React** with TypeScript
- **ReactFlow** for canvas rendering
- **Zustand** for state management
- **TailwindCSS** for styling
- **Lucide React** for icons

### Backend Integration
- **OpenAI API** for AI analysis
- **RESTful API** endpoints
- **Local storage** for design persistence
- **JSON-based data structures**

### Key Components

#### Data Flow
```
Canvas Components -> Hashmap Structure -> API -> LLM -> Structured Response -> UI Display
```

#### Hashmap Structure
```typescript
{
  [componentId]: {
    props: ComponentProperties,
    connections: { [targetId]: number }
  }
}
```

#### AI Response Format
```json
{
  "bottleNecks": [...],
  "recommendations": {
    "component": {
      "action": "...",
      "reason": "..."
    }
  },
  "architectureChanges": [...],
  "updatedDiagramHints": {
    "connections": {
      "from": "...",
      "to": "...", 
      "reason": "..."
    }
  },
  "summary": "..."
}
```

## User Interface

### Main Layout
- **TopBar**: Navigation, problem selection, action buttons (Simulate, Score, Ask AI)
- **Sidebar**: Component library, design tools
- **Canvas**: Main design workspace
- **RightPanel**: Results, scoring, simulation metrics

### AI Analysis Page
- **Dark mode design** with glass morphism effects
- **Color-coded sections** for different analysis types
- **Responsive layout** with proper scrolling
- **Loading states** and error handling

## Key Files & Components

### Core Application
- `src/app/page.tsx` - Main entry point
- `src/components/layout/AppShell.tsx` - Main application shell
- `src/components/layout/TopBar.tsx` - Navigation and controls
- `src/components/canvas/DesignCanvas.tsx` - Interactive canvas

### AI Analysis Feature
- `src/app/config/page.tsx` - AI analysis interface
- `src/app/api/getResponse/route.ts` - API endpoint for LLM integration
- `src/config/prompts/chatPrompt.json` - AI prompt configuration

### Data & State
- `src/store/` - Zustand stores for state management
- `src/data/components.ts` - Component definitions
- `src/engine/simulator.ts` - Simulation engine

## User Workflow

1. **Select Problem** - Choose from predefined or custom system design challenges
2. **Design System** - Drag components to canvas and connect them
3. **Run Simulation** - Test performance under load
4. **Get AI Insights** - Click "Ask AI" for intelligent analysis
5. **Review Recommendations** - Analyze bottlenecks and improvement suggestions
6. **Iterate Design** - Apply suggestions and re-test

## Keyboard Shortcuts
- `Ctrl/Cmd + Enter` - Run simulation
- `Ctrl/Cmd + Shift + S` - Score design
- `Ctrl/Cmd + S` - Save design
- `Ctrl/Cmd + O` - Load design
- `Delete/Backspace` - Delete selected node
- `Escape` - Deselect node

## Recent Enhancements

### AI Analysis Integration (Latest)
- **Added "Ask AI" button** to TopBar with Brain icon
- **Implemented structured data processing** from canvas to LLM
- **Created responsive UI** for displaying AI recommendations
- **Integrated with existing canvas data** seamlessly
- **Non-destructive workflow** - opens analysis in new tab

### Technical Improvements
- **Type-safe data structures** for component properties and connections
- **Error handling** for API failures
- **Loading states** for better UX
- **Responsive design** with proper scrolling
- **Modern UI patterns** with dark mode styling

## Future Enhancements
- **Real-time collaboration** - Multiple users designing together
- **Advanced simulation** - More realistic performance modeling
- **Export/import formats** - Support for various diagram formats
- **AI chat interface** - Interactive design conversations
- **Component templates** - Pre-built design patterns

## Development Notes
- **Component-based architecture** for maintainability
- **TypeScript** for type safety
- **Modular state management** with Zustand
- **Responsive design** principles
- **Accessibility considerations** in UI components

## Conclusion
SystemSim provides a comprehensive platform for learning system design through hands-on practice and AI-powered guidance. The recent integration of AI analysis significantly enhances the learning experience by providing personalized, actionable insights for design improvement.
