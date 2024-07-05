'use client';

import React from 'react';
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Label
} from 'recharts';

interface GraphData {
  x: number;
  y: number;
  label: string;
  id: string;
  size: number;
  color: string;
  opacity: number;
  place_type: string[];
}

interface Props {
  data: GraphData[];
}

const ReChart = ({ data }: Props) => {
  const customTooltip = (value: any, name: string, props: any) => {
    return [`${value}`, `${name}`];
  };

  const customLabelFormatter = (label: any, props: any) => {
    return `Point: ${props.length > 0 ? props[0].payload.label : label}`;
  };

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to get the color for a place type, ensuring unique colors for each type
  const getColorForPlaceType = (() => {
    const colorMap: { [key: string]: string } = {};
    return (placeType: string): string => {
      if (!colorMap[placeType]) {
        colorMap[placeType] = getRandomColor();
      }
      return colorMap[placeType];
    };
  })();

  const uniquePlaceTypes: string[] = Array.from(
    new Set(data.flatMap((item) => item.place_type))
  );

  const getDataForPlaceType = (
    data: GraphData[],
    placeType: string
  ): GraphData[] => {
    return data.filter((item) => item.place_type.includes(placeType));
  };

  return (
    <div className="canvas-wrapper mt-10 flex min-h-[70vh] w-full flex-col items-center gap-4 bg-gray-100 px-4 py-6">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-sm font-bold md:text-lg lg:text-xl">Place type</h1>
        <div className="flex gap-6">
          {uniquePlaceTypes.map((key) => (
            <div
              key={key}
              className="text-xs font-semibold md:text-base lg:text-lg"
            >
              <span
                style={{ color: getColorForPlaceType(key), marginRight: 10 }}
              >
                ■
              </span>
              {key}
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 1000 }}>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <ScatterChart margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              style={{ stroke: '#B7E9ED' }}
            />
            <XAxis
              dataKey="x"
              name="Longitude"
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(tick) => {
                if (typeof tick === 'number') {
                  return tick.toFixed(1);
                } else {
                  return '';
                }
              }}
              style={{
                stroke: 'none',
                fill: '#6b6b76',
                fontWeight: 600
              }}
            >
              <Label
                value="Longitude"
                position="insideBottom"
                offset={-40}
                fontWeight={600}
              />
            </XAxis>
            <YAxis
              dataKey="y"
              name="Latitude"
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(tick) => {
                if (typeof tick === 'number') {
                  return tick.toFixed(1);
                } else {
                  return '';
                }
              }}
              style={{
                stroke: 'none',
                fill: '#6b6b76',
                fontWeight: 600
              }}
            >
              <Label
                value="Latitude"
                position="insideLeft"
                angle={-90}
                offset={-40}
                fontWeight={600}
              />
            </YAxis>
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={customTooltip}
              labelFormatter={customLabelFormatter}
            />

            {uniquePlaceTypes.map((placeType) => {
              const placeTypeData = getDataForPlaceType(data, placeType);
              return (
                <React.Fragment key={placeType}>
                  {/* Scatter plot */}
                  <Scatter
                    name={placeType.toUpperCase()}
                    data={placeTypeData}
                    fill={getColorForPlaceType(placeType)}
                    shape="circle"
                    line={{
                      stroke: getColorForPlaceType(placeType),
                      strokeWidth: 4,
                      strokeLinejoin: 'round'
                    }}
                  >
                    <LabelList
                      dataKey="label"
                      position="top"
                      style={{ fill: 'black', fontSize: 14 }}
                    />
                  </Scatter>
                </React.Fragment>
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReChart;
