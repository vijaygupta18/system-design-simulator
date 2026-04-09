"use client";

import { useCallback, useEffect, useState } from "react";
import { ReactFlowProvider, type Node } from "@xyflow/react";
import { TopBar } from "./top-bar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { RightPanel } from "@/components/panel/RightPanel";
import { DesignCanvas } from "@/components/canvas/DesignCanvas";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore, type ComponentNodeData } from "@/store/canvasStore";
import { useSimulationStore } from "@/store/simulationStore";
import { runSimulation } from "@/engine/simulator";
import { scoreDesign } from "@/scoring/scorer";
import { Toast } from "@/components/ui/Toast";
import { SaveDialog } from "@/components/dialogs/SaveDialog";
import { LoadDialog } from "@/components/dialogs/LoadDialog";
import { InterviewBar } from "@/components/interview/InterviewBar";
import { InterviewStartDialog } from "@/components/interview/InterviewStartDialog";
import { CreateProblemDialog } from "@/components/dialogs/CreateProblemDialog";
import { AiFeedbackDialog } from "@/components/dialogs/AiFeedbackDialog";
import { useInterviewStore } from "@/store/interviewStore";

export function AppShell() {
  const leftSidebarOpen = useAppStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = useAppStore((s) => s.rightPanelOpen);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [createProblemDialogOpen, setCreateProblemDialogOpen] = useState(false);
  const [aiFeedbackOpen, setAiFeedbackOpen] = useState(false);
  const interviewMode = useInterviewStore((s) => s.mode);
  const timerRunning = useInterviewStore((s) => s.timerRunning);
  const tickTimer = useInterviewStore((s) => s.tickTimer);

  const handleSave = useCallback(() => setSaveDialogOpen(true), []);
  const handleLoad = useCallback(() => setLoadDialogOpen(true), []);
  const handleSimulate = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();
    const { config } = useSimulationStore.getState();

    // Filter out text annotation nodes — they are not part of the system design
    const componentNodes = nodes.filter((n) => n.type !== "text") as Node<ComponentNodeData>[];

    if (componentNodes.length === 0) {
      useAppStore.getState().showToast("No components to simulate", "info");
      return;
    }

    useSimulationStore.getState().setRunning(true);

    // Use setTimeout to let React render the "Running..." state
    setTimeout(() => {
      const result = runSimulation(componentNodes, edges, config.requestsPerSec);

      // Update node visuals
      const updates = new Map<string, Record<string, unknown>>();
      for (const [nodeId, metrics] of result.nodeMetrics) {
        updates.set(nodeId, {
          utilization: metrics.utilization,
          status: metrics.status,
          isBottleneck: metrics.isBottleneck,
        });
      }
      useCanvasStore.getState().updateAllNodeData(updates);

      useSimulationStore.getState().setResult(result);
      useSimulationStore.getState().setRunning(false);
      useAppStore.getState().showToast("Simulation complete!", "success");
    }, 100);
  }, []);

  const handleScore = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();

    // Filter out text annotation nodes — they are not part of the system design
    const componentNodes = nodes.filter((n) => n.type !== "text") as Node<ComponentNodeData>[];

    if (componentNodes.length === 0) {
      useAppStore.getState().showToast("No components to score", "info");
      return;
    }

    const result = scoreDesign(componentNodes, edges);
    useSimulationStore.getState().setScoreResult(result);
    useSimulationStore.getState().setShowScore(true);
    useAppStore.getState().setActiveRightTab("score");

    useAppStore.getState().showToast("Design scored!", "success");
  }, []);

  const handleClearCanvas = useCallback(() => {
    useCanvasStore.getState().clearCanvas();
    useAppStore.getState().showToast("Canvas cleared", "info");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Delete or Backspace → delete selected node
      if (e.key === "Delete" || e.key === "Backspace") {
        const { selectedNodeId, deleteNode } = useCanvasStore.getState();
        if (selectedNodeId) {
          e.preventDefault();
          deleteNode(selectedNodeId);
        }
      }

      // Ctrl/Cmd + Enter → run simulation
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSimulate();
      }

      // Ctrl/Cmd + Shift + S → run scoring
      if (e.key === "s" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        handleScore();
      }

      // Ctrl/Cmd + S → save design dialog
      if (e.key === "s" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        setSaveDialogOpen(true);
      }

      // Ctrl/Cmd + O → load design dialog
      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoadDialogOpen(true);
      }

      // Escape → deselect node
      if (e.key === "Escape") {
        useCanvasStore.getState().setSelectedNode(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSimulate, handleScore]);

  // Interview timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, tickTimer]);

  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        {interviewMode === "interview" && <InterviewBar />}
        <TopBar onSimulate={handleSimulate} onScore={handleScore} onClearCanvas={handleClearCanvas} onSave={handleSave} onLoad={handleLoad} onStartInterview={() => setInterviewDialogOpen(true)} onCreateProblem={() => setCreateProblemDialogOpen(true)} onAskAI={() => setAiFeedbackOpen(true)} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar open={leftSidebarOpen} onCreateProblem={() => setCreateProblemDialogOpen(true)} />
          <DesignCanvas />
          <RightPanel open={rightPanelOpen} onSimulate={handleSimulate} />
        </div>

        <Toast />

        <SaveDialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} />
        <LoadDialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)} />
        <InterviewStartDialog open={interviewDialogOpen} onClose={() => setInterviewDialogOpen(false)} />
        <CreateProblemDialog open={createProblemDialogOpen} onClose={() => setCreateProblemDialogOpen(false)} />
        <AiFeedbackDialog open={aiFeedbackOpen} onClose={() => setAiFeedbackOpen(false)} />
      </div>
    </ReactFlowProvider>
  );
}
