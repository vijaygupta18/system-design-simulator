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
    };
    response();
  };
  }, []);
  

  return (
    <div>
      <h1>Config</h1>
      <h2>Problem Name: {name}</h2>
      <h2>Adjacency List (Graph Format):</h2>
      {graphData &&
        Object.entries(graphData).map(([nodeId, nodeData]) => (
          <div key={nodeId}>
            <strong>{nodeId}:</strong>
            <div style={{marginLeft: '20px'}}>
              <div><strong>Props:</strong> {JSON.stringify(nodeData.props)}</div>
              <div><strong>Connections:</strong> {JSON.stringify(Object.keys(nodeData.connections))}</div>
            </div>
            <br />
          </div>
        ))}

      {/* <h2>Node Details:</h2>
      {data?.state?.nodes?.map((node) => (
        <div key={node.id}>
          <div>
            {node.data.componentId} ({node.id})
          </div>
          <div>
            Category: {node.data.category} | Replicas: {node.data.replicas}
          </div>
          <div>
            Max QPS: {node.data.maxQPS?.toLocaleString()} | Latency: {node.data.latencyMs}ms
          </div>
          <div>
            Status: {node.data.status} | Utilization: {((node.data.utilization || 0) * 100).toFixed(1)}%
            {node.data.isBottleneck && ' BOTTLENECK'}
          </div>
          <br />
        </div>
      ))} */}
    </div>
  );
};

export default ConfigData;
