"use client";

import { useState, useCallback, useEffect } from "react";
import {
  X,
  Brain,
  AlertTriangle,
  Lightbulb,
  Layers,
  GitBranch,
  FileText,
  RefreshCw,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";

interface AiFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Recommendation {
  action: string;
  reason: string;
}

interface Connection {
  from: string;
  to: string;
  reason: string;
}

interface AiResponse {
  bottleNecks?: string | string[];
  recommendations?: Record<string, Recommendation>;
  architectureChanges?: string[];
  updatedDiagramHints?: { connections?: Record<string, Connection> };
  summary?: string;
}

function buildEdgesInfo(nodes: ReturnType<typeof useCanvasStore.getState>["nodes"], edges: ReturnType<typeof useCanvasStore.getState>["edges"]) {
  const hashmap: Record<string, { props: Record<string, unknown>; connections: Record<string, number> }> = {};

  for (const node of nodes) {
    if (node.type === "text") continue;
    const nodeName = node.id.replace(/-[a-f0-9-]{36}$/, "").replace(/-\d+$/, "");
    hashmap[nodeName] = { props: { ...(node.data as Record<string, unknown>) }, connections: {} };
  }

  for (const edge of edges) {
    const source = edge.source.replace(/-[a-f0-9-]{36}$/, "").replace(/-\d+$/, "");
    const target = edge.target.replace(/-[a-f0-9-]{36}$/, "").replace(/-\d+$/, "");
    if (!hashmap[source]) hashmap[source] = { props: {}, connections: {} };
    if (!hashmap[target]) hashmap[target] = { props: {}, connections: {} };
    hashmap[source].connections[target] = 1;
    hashmap[target].connections[source] = 1;
  }

  return hashmap;
}

export function AiFeedbackDialog({ open, onClose }: AiFeedbackDialogProps) {
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);

  const analyze = useCallback(async () => {
    const componentNodes = nodes.filter((n) => n.type !== "text");
    if (componentNodes.length === 0) {
      setError("Add some components to your canvas first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const edgesInfo = buildEdgesInfo(componentNodes, edges);
      const res = await fetch("/api/getResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: { edgesInfo, problemName: selectedProblemId } }),
      });

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      const parsed: AiResponse = typeof data.response === "string" ? JSON.parse(data.response) : data.response;
      setResponse(parsed);
    } catch {
      setError("Failed to get AI feedback. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }, [nodes, edges, selectedProblemId]);

  // Auto-analyze when dialog opens
  useEffect(() => {
    if (open && !response && !loading) {
      analyze();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const bottlenecks = response?.bottleNecks
    ? Array.isArray(response.bottleNecks)
      ? response.bottleNecks
      : [response.bottleNecks]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/30">
              <Brain className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100">AI Design Review</p>
              <p className="text-[10px] text-zinc-500">{selectedProblemId || "No problem selected"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={analyze}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-40"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              Re-analyze
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-500/30">
                  <Zap className="h-5 w-5 text-violet-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-300">Analyzing your design...</p>
                <p className="mt-1 text-xs text-zinc-500">This usually takes a few seconds</p>
              </div>
              <div className="w-48 space-y-2">
                {["Mapping components", "Tracing data flow", "Detecting bottlenecks"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-violet-500/50 animate-pulse"
                        style={{ width: `${60 + i * 15}%`, animationDelay: `${i * 200}ms` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <div>
                <p className="text-sm font-medium text-rose-300">Analysis failed</p>
                <p className="mt-0.5 text-xs text-rose-400/80">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {response && !loading && (
            <>
              {/* Bottlenecks */}
              {bottlenecks.length > 0 && (
                <Section
                  icon={<AlertTriangle className="h-3.5 w-3.5 text-rose-400" />}
                  iconBg="bg-rose-500/10 ring-rose-500/20"
                  title="Bottlenecks"
                  count={bottlenecks.length}
                  countColor="bg-rose-500/10 text-rose-400"
                >
                  <div className="space-y-2">
                    {bottlenecks.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 rounded-lg bg-zinc-900 px-3 py-2.5 ring-1 ring-zinc-800">
                        <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                        <p className="text-xs leading-relaxed text-zinc-300">{b}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Recommendations */}
              {response.recommendations && Object.keys(response.recommendations).length > 0 && (
                <Section
                  icon={<Lightbulb className="h-3.5 w-3.5 text-amber-400" />}
                  iconBg="bg-amber-500/10 ring-amber-500/20"
                  title="Recommendations"
                  count={Object.keys(response.recommendations).length}
                  countColor="bg-amber-500/10 text-amber-400"
                >
                  <div className="space-y-2">
                    {Object.entries(response.recommendations).map(([component, rec]) => (
                      <div key={component} className="rounded-lg bg-zinc-900 p-3 ring-1 ring-zinc-800">
                        <div className="mb-2 flex items-center gap-1.5">
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-amber-400 ring-1 ring-zinc-700">
                            {component}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Action</span>
                            <p className="text-xs text-zinc-300">{rec.action}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Why</span>
                            <p className="text-xs text-zinc-400">{rec.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Architecture Changes */}
              {response.architectureChanges && response.architectureChanges.length > 0 && (
                <Section
                  icon={<Layers className="h-3.5 w-3.5 text-violet-400" />}
                  iconBg="bg-violet-500/10 ring-violet-500/20"
                  title="Architecture Changes"
                  count={response.architectureChanges.length}
                  countColor="bg-violet-500/10 text-violet-400"
                >
                  <div className="space-y-1.5">
                    {response.architectureChanges.map((change, i) => (
                      <div key={i} className="flex items-start gap-2.5 rounded-lg bg-zinc-900 px-3 py-2.5 ring-1 ring-zinc-800">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-violet-500/20 text-[9px] font-bold text-violet-400">
                          {i + 1}
                        </span>
                        <p className="text-xs leading-relaxed text-zinc-300">{change}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Diagram Hints */}
              {response.updatedDiagramHints?.connections &&
                Object.keys(response.updatedDiagramHints.connections).length > 0 && (
                  <Section
                    icon={<GitBranch className="h-3.5 w-3.5 text-cyan-400" />}
                    iconBg="bg-cyan-500/10 ring-cyan-500/20"
                    title="Suggested Connections"
                    count={Object.keys(response.updatedDiagramHints.connections).length}
                    countColor="bg-cyan-500/10 text-cyan-400"
                  >
                    <div className="space-y-2">
                      {Object.entries(response.updatedDiagramHints.connections).map(([key, hint]) => (
                        <div key={key} className="rounded-lg bg-zinc-900 p-3 ring-1 ring-zinc-800">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-cyan-400 ring-1 ring-zinc-700">
                              {hint.from}
                            </span>
                            <ChevronRight className="h-3 w-3 text-zinc-600" />
                            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-cyan-400 ring-1 ring-zinc-700">
                              {hint.to}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">{hint.reason}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

              {/* Summary */}
              {response.summary && (
                <Section
                  icon={<FileText className="h-3.5 w-3.5 text-emerald-400" />}
                  iconBg="bg-emerald-500/10 ring-emerald-500/20"
                  title="Summary"
                >
                  <div className="rounded-lg bg-zinc-900 p-4 ring-1 ring-zinc-800">
                    <p className="text-xs leading-relaxed text-zinc-300">{response.summary}</p>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* Empty state */}
          {!loading && !error && !response && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 ring-1 ring-zinc-700">
                <Brain className="h-6 w-6 text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-400">Click Re-analyze to get AI feedback on your design</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  iconBg,
  title,
  count,
  countColor,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  count?: number;
  countColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ring-1 ${iconBg}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-zinc-200">{title}</span>
        {count !== undefined && (
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${countColor}`}>
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
