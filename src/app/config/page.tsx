"use client";

import { useEffect, useState } from "react";
import axios from 'axios'
interface Edge {
  source: string;
  target: string;
}

interface GraphData {
  state: {
    nodes: { id: string; data: any }[];
    edges: Edge[];
  };
}

const ConfigData = () => {
  const [data, setData] = useState<GraphData | null>(null);
  const [graphData, setGraphData] = useState<{
    [key: string]: { props: any, connections: { [key: string]: number } };
  } | null>(null);
  const [name, setName] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  useEffect(() => {
    console.log("Config page: Loading localStorage data...");

    // const allKeys = [];
    // for (let i = 0; i < localStorage.length; i++) {
    //   allKeys.push(localStorage.key(i));
    // }
    const problemName = JSON.parse(
      localStorage.getItem("systemsim-app") || "{}",
    );
    setName(problemName.state.selectedProblemId || "");
    const canvasDataRaw = localStorage.getItem("systemsim-canvas");
    const nodesInfo = JSON.parse(canvasDataRaw || "{}").state.nodes; 

    const parsedData: GraphData = JSON.parse(canvasDataRaw || "{}");
    setData(parsedData);
    const hashmap: { [key: string]: { props: any, connections: { [key: string]: number } } } = {};

    if (nodesInfo){
        for (const node of nodesInfo) {
            const nodeName = node.id.slice(0,-37);
            hashmap[nodeName] = {
                props: { ...node.data },
                connections: {}
            };
        }
    }
    if (parsedData.state.edges && nodesInfo) {

      parsedData.state.edges.forEach((edge: Edge) => {
        const source = edge.source.slice(0, -37);
        const target = edge.target.slice(0, -37);

        if (!hashmap[source]) {
          hashmap[source] = { props: {}, connections: {} };
        }
        hashmap[source].connections[target] = 1;

        if (!hashmap[target]) {
          hashmap[target] = { props: {}, connections: {} };
        }
        hashmap[target].connections[source] = 1;
      });

      setGraphData(hashmap);
      
    const response = async () => {
      const res = await axios.post("/api/getResponse", {
        message: {
            edgesInfo: hashmap, 
            problemName: problemName.state.selectedProblemId
        },
      });
      console.log(res.data);
      const parsedResponse = JSON.parse(res.data.response);
      console.log(parsedResponse);
      setAiResponse(parsedResponse);
    };
    response();
  };
  }, []);
  

  return (
    <div style={{ 
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#e2e8f0',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 8px 0'
        }}>
          System Design Analysis
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Problem:</span>
          <span style={{ 
            color: '#f1f5f9',
            fontSize: '1.125rem',
            fontWeight: '500',
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '4px 12px',
            borderRadius: '8px'
          }}>
            {name || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {!aiResponse && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              opacity: 0.8,
              transition: 'opacity 0.5s ease-in-out'
            }}></div>
            <p style={{ color: '#94a3b8' }}>Analyzing your system design...</p>
          </div>
        </div>
      )}

      {/* AI Response Section */}
      {aiResponse && (
        <div style={{ display: 'grid', gap: '24px' }}>
          
          {/* Bottlenecks */}
          {aiResponse.bottleNecks && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontWeight: 'bold'
                }}>!</div>
                <h3 style={{ 
                  color: '#f87171',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Critical Bottlenecks
                </h3>
              </div>
              <div style={{ marginLeft: '44px' }}>
                {Array.isArray(aiResponse.bottleNecks) ? 
                  aiResponse.bottleNecks.map((bottleneck: string, index: number) => (
                    <div key={index} style={{
                      background: 'rgba(239, 68, 68, 0.05)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      borderLeft: '3px solid #ef4444'
                    }}>
                      {bottleneck}
                    </div>
                  )) : 
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ef4444'
                  }}>
                    {aiResponse.bottleNecks}
                  </div>
                }
              </div>
            </div>
          )}

          {/* Recommendations */}
          {aiResponse.recommendations && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22c55e',
                  fontWeight: 'bold'
                }}>+</div>
                <h3 style={{ 
                  color: '#4ade80',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Recommendations
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '16px', marginLeft: '44px' }}>
                {Object.entries(aiResponse.recommendations).map(([component, rec]: [string, any]) => (
                  <div key={component} style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h4 style={{ 
                      color: '#60a5fa',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}>
                        {component}
                      </span>
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#94a3b8', minWidth: '80px' }}>Action:</span>
                        <span style={{ color: '#e2e8f0' }}>{rec.action}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#94a3b8', minWidth: '80px' }}>Reason:</span>
                        <span style={{ color: '#e2e8f0', flex: 1 }}>{rec.reason}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture Changes */}
          {aiResponse.architectureChanges && (
            <div style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a855f7',
                  fontWeight: 'bold'
                }}> architects
                </div>
                <h3 style={{ 
                  color: '#c084fc',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Architecture Changes
                </h3>
              </div>
              <div style={{ marginLeft: '44px' }}>
                {aiResponse.architectureChanges.map((change: string, index: number) => (
                  <div key={index} style={{
                    background: 'rgba(168, 85, 247, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    borderLeft: '3px solid #a855f7',
                    color: '#e2e8f0'
                  }}>
                    {change}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Updated Diagram Hints */}
          {aiResponse.updatedDiagramHints?.connections && (
            <div style={{
              background: 'rgba(251, 146, 60, 0.1)',
              border: '1px solid rgba(251, 146, 60, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(251, 146, 60, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(251, 146, 60, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fb923c',
                  fontWeight: 'bold'
                }}> connect
                </div>
                <h3 style={{ 
                  color: '#fdba74',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Diagram Updates
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '16px', marginLeft: '44px' }}>
                {Object.entries(aiResponse.updatedDiagramHints.connections).map(([key, hint]: [string, any]) => (
                  <div key={key} style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#94a3b8', minWidth: '60px' }}>From:</span>
                        <span style={{ color: '#60a5fa' }}>{hint.from}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#94a3b8', minWidth: '60px' }}>To:</span>
                        <span style={{ color: '#60a5fa' }}>{hint.to}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#94a3b8', minWidth: '60px' }}>Why:</span>
                        <span style={{ color: '#e2e8f0', flex: 1 }}>{hint.reason}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {aiResponse.summary && (
            <div style={{
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(14, 165, 233, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0ea5e9',
                  fontWeight: 'bold'
                }}> summary
                </div>
                <h3 style={{ 
                  color: '#38bdf8',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Summary
                </h3>
              </div>
              <div style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                lineHeight: '1.7',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                backdropFilter: 'blur(10px)',
                marginLeft: '44px'
              }}>
                {aiResponse.summary}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

};

export default ConfigData;
