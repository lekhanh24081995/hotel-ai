import { FC, useCallback, useEffect, useRef } from 'react';
import { drag, select, SimulationNodeDatum } from 'd3';
import { fillCircleByValue, weighValueByMutiply } from '../../lib/utils/chart';
import { DragEvent, Node } from '../../lib/types/networkGraph';

type NodesProps = {
  nodes: Node[];
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
};

type NodeProps = {
  node: Node;
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
};

const NetworkNode: FC<NodeProps> = ({ node, simulation }) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  const handleDragging = useCallback(
    (graph: d3.Simulation<SimulationNodeDatum, undefined>) => {
      function dragstarted(e: DragEvent) {
        if (!e.active) graph.alphaTarget(0.3).restart();
        e.subject.fx = e.subject.x;
        e.subject.fy = e.subject.y;
      }

      function dragged(e: DragEvent) {
        e.subject.fx = e.x;
        e.subject.fy = e.y;
      }

      function dragended(e: DragEvent) {
        if (!e.active) graph.alphaTarget(0);
        e.subject.fx = null;
        e.subject.fy = null;
      }

      return drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    },
    []
  );

  useEffect(() => {
    select(circleRef.current)
      .data([node])
      .call(handleDragging(simulation) as any);

    select(textRef.current).data([node]);
  }, [node, handleDragging, simulation]);

  return (
    <g>
      <circle
        className="node"
        r={weighValueByMutiply(node.value, 50)}
        fill={fillCircleByValue(node.value)}
        ref={circleRef}
      />
      <text
        className="text"
        dy="6"
        textAnchor="middle"
        ref={textRef}
        fontSize={Math.min((2 * 1500) / 16, 1500)}
      >
        {node.name}
      </text>
    </g>
  );
};
const NetworkNodes: FC<NodesProps> = ({ nodes, simulation }) => {
  return (
    <g className="nodes">
      {nodes?.map((node: Node, index) => (
        <NetworkNode key={index} node={node} simulation={simulation} />
      ))}
    </g>
  );
};

export default NetworkNodes;
