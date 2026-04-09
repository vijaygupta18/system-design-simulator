"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Trophy,
  ChevronDown,
  Zap,
  PanelLeft,
  PanelRight,
  Trash2,
  Download,
  ImageIcon,
  FileCode2,
  FileJson,
  Save,
  FolderOpen,
  StickyNote,
  GraduationCap,
  Plus,
  Brain,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore } from "@/store/canvasStore";
import { PROBLEMS } from "@/data/problems";
import { useCustomProblemsStore } from "@/store/customProblemsStore";
import { type Node, type Edge, useReactFlow } from "@xyflow/react";
import { getComponentById } from "@/data/components";
import type { ComponentNodeData } from "@/store/canvasStore";
import { exportAsPng, exportAsSvg, exportAsJSON } from "@/lib/exportCanvas";

interface TopBarProps {
  onSimulate: () => void;
  onScore: () => void;
  onClearCanvas: () => void;
  onSave: () => void;
  onLoad: () => void;
  onStartInterview: () => void;
  onCreateProblem: () => void;
  onAskAI: () => void;
}

export function TopBar({ onSimulate, onScore, onClearCanvas, onSave, onLoad, onStartInterview, onCreateProblem, onAskAI }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const { getViewport } = useReactFlow();
  const addNode = useCanvasStore((s) => s.addNode);

  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const toggleLeftSidebar = useAppStore((s) => s.toggleLeftSidebar);
  const toggleRightPanel = useAppStore((s) => s.toggleRightPanel);

  const customProblems = useCustomProblemsStore((s) => s.problems);
  const currentProblem =
    PROBLEMS.find((p) => p.id === selectedProblemId) ??
    customProblems.find((p) => p.id === selectedProblemId);

  const addTextNote = useCallback(() => {
    const { x, y, zoom } = getViewport();
    const centerX = (-x + window.innerWidth / 2) / zoom;
    const centerY = (-y + window.innerHeight / 2) / zoom;

    const newNode: Node = {
      id: `text-${crypto.randomUUID()}`,
      type: "text",
      position: { x: centerX, y: centerY },
      data: { text: "" },
      connectable: false,
    };
    addNode(newNode);
  }, [getViewport, addNode]);

  const handleExportPng = useCallback(async () => {
    setExportOpen(false);
    const name = currentProblem?.title ?? "design";
    try {
      await exportAsPng(name);
      useAppStore.getState().showToast("Exported as PNG", "success");
    } catch {
      useAppStore.getState().showToast("Export failed", "error");
    }
  }, [currentProblem]);

  const handleExportSvg = useCallback(async () => {
    setExportOpen(false);
    const name = currentProblem?.title ?? "design";
    try {
      await exportAsSvg(name);
      useAppStore.getState().showToast("Exported as SVG", "success");
    } catch {
      useAppStore.getState().showToast("Export failed", "error");
    }
  }, [currentProblem]);

  const handleExportJson = useCallback(() => {
    setExportOpen(false);
    const name = currentProblem?.title ?? "design";
    const { nodes, edges } = useCanvasStore.getState();
    if (nodes.length === 0) {
      useAppStore.getState().showToast("Nothing to export", "info");
      return;
    }
    exportAsJSON(nodes, edges, name);
    useAppStore.getState().showToast("Exported as JSON", "success");
  }, [currentProblem]);

  // Keyboard shortcut: Ctrl/Cmd+E → Export as PNG
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (e.key === "e" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        handleExportPng();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExportPng]);

  const loadReference = useCallback(() => {
    const problem = PROBLEMS.find((p) => p.id === selectedProblemId);
    if (!problem) return;

    // Build reference nodes
    const nodeIdMap = new Map<string, string>();
    const refNodes: Node<ComponentNodeData>[] = [];

    problem.referenceSolution.nodes.forEach((ref, index) => {
      const comp = getComponentById(ref.componentId);
      if (!comp) return;

      const nodeId = `${comp.id}-ref-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      nodeIdMap.set(`${ref.componentId}-${index}`, nodeId);

      refNodes.push({
        id: nodeId,
        type: "component",
        position: { x: ref.x, y: ref.y },
        data: {
          componentId: comp.id,
          label: comp.label,
          icon: comp.icon,
          category: comp.category,
          replicas: 1,
          maxQPS: comp.maxQPS,
          latencyMs: comp.latencyMs,
          scalable: comp.scalable,
        },
      });
    });

    const refEdges: Edge[] = [];
    for (const ref of problem.referenceSolution.edges) {
      const sourceId = findNodeIdByComponent(nodeIdMap, ref.source);
      const targetId = findNodeIdByComponent(nodeIdMap, ref.target);
      if (sourceId && targetId) {
        refEdges.push({
          id: `e-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: "animated",
        });
      }
    }

    // Open reference in a NEW tab — user's design stays in "My Design" tab
    useCanvasStore.getState().addTab({
      id: `ref-${problem.id}`,
      label: `${problem.title} (Reference)`,
      nodes: refNodes,
      edges: refEdges,
      readOnly: true,
    });

    useAppStore.getState().showToast("Reference opened in new tab — your design is safe", "success");
  }, [selectedProblemId]);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLeftSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-500" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            SystemSim
          </span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">beta</span>
        </div>

        <div className="mx-2 h-4 w-px bg-zinc-800" />

        {/* Problem selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
          >
            {currentProblem?.title ?? "Select Problem"}
            <ChevronDown className="h-3 w-3 text-zinc-500" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-1 max-h-80 w-56 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-800 py-1 shadow-lg">
                {/* Create custom problem */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onCreateProblem();
                  }}
                  className="flex w-full items-center gap-1.5 border-b border-zinc-700 px-3 py-1.5 text-left text-xs font-medium text-violet-400 transition-colors hover:bg-zinc-700"
                >
                  <Plus className="h-3 w-3" />
                  Create Custom Problem
                </button>

                {/* Custom problems */}
                {customProblems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setSelectedProblem(problem.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-zinc-700 ${
                      problem.id === selectedProblemId
                        ? "text-cyan-500"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span className="flex-1 truncate">{problem.title}</span>
                    <span className="shrink-0 rounded bg-violet-500/10 px-1 py-0.5 text-[9px] font-medium text-violet-400">
                      Custom
                    </span>
                  </button>
                ))}

                {customProblems.length > 0 && (
                  <div className="my-0.5 h-px bg-zinc-700" />
                )}

                {/* Predefined problems */}
                {PROBLEMS.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setSelectedProblem(problem.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-zinc-700 ${
                      problem.id === selectedProblemId
                        ? "text-cyan-500"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {problem.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {!selectedProblemId.startsWith("custom-") && (
          <button
            onClick={loadReference}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            title="Load reference solution"
          >
            <Download className="h-3 w-3" />
            Reference
          </button>
        )}

        <div className="mx-1 h-4 w-px bg-zinc-800" />

        <button
          onClick={addTextNote}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="Add text note to canvas"
        >
          <StickyNote className="h-3 w-3" />
          Add Note
        </button>

        <div className="mx-1 h-4 w-px bg-zinc-800" />

        <button
          onClick={onStartInterview}
          className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-[10px] font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
          title="Start a guided interview practice"
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Practice Interview
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="Save design (Ctrl+S)"
        >
          <Save className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          onClick={onLoad}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="Load design (Ctrl+O)"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Load</span>
        </button>

        <div className="h-4 w-px bg-zinc-800" />

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            title="Export design (Ctrl+E)"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="h-2.5 w-2.5 text-zinc-500" />
          </button>

          {exportOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setExportOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-md border border-zinc-700 bg-zinc-900 py-1 shadow-lg">
                <button
                  onClick={handleExportPng}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Export as PNG
                  <kbd className="ml-auto rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 font-mono text-[9px] text-zinc-500">
                    {"\u2318"}E
                  </kbd>
                </button>
                <button
                  onClick={handleExportSvg}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  Export as SVG
                </button>
                <button
                  onClick={handleExportJson}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <FileJson className="h-3.5 w-3.5" />
                  Export as JSON
                </button>
              </div>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <button
          onClick={onClearCanvas}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-rose-400"
          title="Clear canvas"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <Button
          size="sm"
          onClick={onSimulate}
          className="h-7 gap-1.5 bg-cyan-500 px-3 text-xs font-medium text-white hover:bg-cyan-400"
        >
          <Play className="h-3 w-3" />
          Simulate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onAskAI}
          className="h-7 gap-1.5 border border-violet-700/50 bg-violet-500/10 px-3 text-xs font-medium text-violet-300 hover:bg-violet-500/20 hover:text-violet-200"
        >
          <Brain className="h-3 w-3" />
          Ask AI
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onScore}
          className="h-7 gap-1.5 border border-zinc-700 bg-transparent px-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <Trophy className="h-3 w-3" />
          Score
        </Button>

        <button
          onClick={toggleRightPanel}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="Toggle panel"
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

/** Find the first node ID in the map whose key starts with the given componentId. */
function findNodeIdByComponent(nodeIdMap: Map<string, string>, componentId: string): string | undefined {
  for (const [key, value] of nodeIdMap) {
    if (key.startsWith(`${componentId}-`)) return value;
  }
  return undefined;
}
