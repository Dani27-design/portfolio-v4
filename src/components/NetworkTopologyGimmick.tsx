import { motion } from "motion/react";

export const NetworkTopologyGimmick = () => {
  // Generate a semi-random network of nodes
  const nodes = [
    { id: 1, x: 20, y: 30, size: 4 },
    { id: 2, x: 45, y: 15, size: 6 },
    { id: 3, x: 75, y: 25, size: 3 },
    { id: 4, x: 30, y: 70, size: 5 },
    { id: 5, x: 60, y: 85, size: 4 },
    { id: 6, x: 85, y: 65, size: 6 },
    { id: 7, x: 50, y: 50, size: 8 },
  ];

  // Define connections between nodes
  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 6 },
    { from: 6, to: 5 },
    { from: 5, to: 4 },
    { from: 4, to: 1 },
    { from: 7, to: 2 },
    { from: 7, to: 4 },
    { from: 7, to: 6 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connection Edges */}
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from)!;
          const toNode = nodes.find(n => n.id === conn.to)!;
          
          return (
            <g key={`conn-${i}`}>
              <line 
                x1={fromNode.x} y1={fromNode.y} 
                x2={toNode.x} y2={toNode.y} 
                stroke="url(#gimmickGradientAbout)" 
                className="stroke-[0.2] opacity-40" 
              />
              <defs>
                <linearGradient id="gimmickGradientAbout" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              {/* Animated Data Packets */}
              <motion.circle
                r="0.5"
                fill="#06b6d4"
                animate={{
                  cx: [fromNode.x, toNode.x],
                  cy: [fromNode.y, toNode.y],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 3
                }}
              />
            </g>
          );
        })}

        {/* Vertices/Nodes */}
        {nodes.map((node) => (
          <motion.g key={`node-${node.id}`} filter="url(#nodeGlow)">
            <circle 
              cx={node.x} cy={node.y} r={node.size / 10} 
              className="fill-indigo-500/40 stroke-indigo-500/60 stroke-[0.1]" 
            />
            <motion.circle 
              cx={node.x} cy={node.y} r={node.size / 7} 
              className="fill-cyan-500/30"
              animate={{ 
                scale: [1, 1.8, 1], 
                opacity: [0.3, 0.6, 0.3] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: node.id * 0.7,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        ))}
      </svg>

      {/* Floating Network Metadata */}
      <div className="absolute top-10 left-10 font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest hidden lg:block bg-cyan-950/20 px-2 py-0.5 border-l-2 border-cyan-500">
        Topology_Map: Node_Cluster_Delta
      </div>
      
      <div className="absolute bottom-20 right-20 font-mono text-[8px] text-indigo-400 font-medium uppercase space-y-2 hidden xl:block">
        <div className="flex items-center gap-2">
          <span className="w-2 h-[1px] bg-indigo-500"></span>
          Lat: 0.12ms
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-[1px] bg-cyan-500"></span>
          Cluster: Sync_Active
        </div>
      </div>
    </div>
  );
};
