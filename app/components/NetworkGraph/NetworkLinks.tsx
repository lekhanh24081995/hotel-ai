import { FC, useEffect, useRef } from 'react';
import { select } from 'd3';
import { Link } from '../../lib/types/networkGraph';

type LinksProps = {
  links: Link[];
  colorMap: Record<string, any>;
};

type LinkProps = {
  link: Link;
  lineColor: string;
};

const NetworkLink = ({ link, lineColor }: LinkProps) => {
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    select(lineRef.current).data([link]);
  }, [link]);

  return (
    <line
      ref={lineRef}
      className="link"
      strokeWidth="30"
      strokeLinejoin="round"
      stroke={lineColor}
    />
  );
};

const NetworkLinks: FC<LinksProps> = ({ links = [], colorMap }) => {
  return (
    <g className="links">
      {links?.map((link, index) => (
        <NetworkLink key={index} link={link} lineColor={colorMap[link.group]} />
      ))}
    </g>
  );
};

export default NetworkLinks;
