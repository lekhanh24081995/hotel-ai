'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { SimulationNodeDatum } from 'd3';
import NetworkLinks from './NetworkLinks';
import NetworkNodes from './NetworkNodes';
import { Link, Node, NodeDatum } from '../../lib/types/networkGraph';
import { getRandomColor, weighValueByMutiply } from '../../lib/utils/chart';
import { Card } from '../ui/card';

type Props = {
  items?: ILocation[];
};

const generateLinks = (items: ILocation[]) => {
  const links: Link[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];

      // Kiểm tra place_type có chung nhau hay không
      const hasCommonType = item1.place_type.some((type) =>
        item2.place_type.includes(type)
      );

      if (hasCommonType) {
        // Tạo link giữa hai node và chia theo group
        const commonTypes = item1.place_type.filter((type) =>
          item2.place_type.includes(type)
        );
        commonTypes.forEach((type) => {
          links.push({
            group: type, // Chia link theo group là các place_type chung
            source: item1.id,
            target: item2.id,
            name: `Link ${item1.text} - ${item2.text}`
          });
        });
      }
    }
  }
  return links;
};

const NetworkGraph: FC<Props> = ({ items }: Props) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    if (items) {
      const nodes: Node[] = items.map((item) => ({
        id: item.id,
        url: `http://example.com/${item.id}`,
        name: item.text,
        value: Math.floor(Math.random() * 20) + 10
      }));
      const filterNodes = nodes.filter(
        (node, index, self) => index === self.findIndex((n) => n.id === node.id)
      );

      setNodes(filterNodes);

      const links: Link[] = generateLinks(items);
      setLinks(links);
    }
  }, [items]);

  const svgRef = useRef<SVGSVGElement>(null);

  const width = (svgRef.current?.width.animVal.value as number) || 1000;
  const height = (svgRef.current?.height.animVal.value as number) || 1000;

  const noNetworkGraphData =
    !nodes || nodes.length === 0 || !links || links.length === 0;

  const simulation = useMemo(() => {
    return d3
      .forceSimulation(nodes as SimulationNodeDatum[])
      .velocityDecay(0.7)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-400))
      .force(
        'link',
        d3.forceLink(links).id((d: NodeDatum) => d.id as string)
      )
      .force(
        'collide',
        d3
          .forceCollide()
          .radius((d: NodeDatum) => weighValueByMutiply(d.value as number, 50))
      );
  }, [height, links, nodes, width]);

  useEffect(() => {
    if (noNetworkGraphData) return;

    if (svgRef.current) {
      const networkGraphElement = d3.select(svgRef.current);

      const handleZoom = (e: any) =>
        d3.select(svgRef.current).select('g').attr('transform', e.transform);

      const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', handleZoom);
      zoom.scaleExtent([0.1, 5]);
      networkGraphElement.call(zoom);

      const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(0.15);

      networkGraphElement.call(zoom.transform, initialTransform);

      const node = d3.selectAll('.node');
      const link = d3.selectAll('.link');
      const text = d3.selectAll('.text');

      const ticked = () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);
        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
        text.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
      };

      simulation.on('tick', ticked);
    }
  }, [height, noNetworkGraphData, simulation, width]);

  const colorMap: Record<string, string> = links.reduce(
    (acc, link) => {
      if (!acc[link.group]) {
        acc[link.group] = getRandomColor();
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const uniqueGroups = Array.from(new Set(links.map((link) => link.group)));

  return (
    <Card className="relative h-full w-full">
      <div className="absolute right-5 top-5 z-0">
        <h1 className="text-lg font-bold">Place type</h1>
        {uniqueGroups.map((group) => (
          <div key={group} className="flex items-center gap-4">
            <div
              className="h-2 w-10"
              style={{ backgroundColor: colorMap[group] }}
            />
            <h1>{group}</h1>
          </div>
        ))}
      </div>
      <svg ref={svgRef} className="h-full w-full">
        <g className="h-full w-full">
          <NetworkLinks links={links} colorMap={colorMap} />
          <NetworkNodes nodes={nodes} simulation={simulation} />
        </g>
      </svg>
    </Card>
  );
};

export default NetworkGraph;
