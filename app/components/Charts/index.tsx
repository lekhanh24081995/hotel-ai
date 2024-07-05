'use client';
import {
  XAxis,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarGrid,
  BarChart,
  Bar
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Charts = () => {
  return (
    <>
      <section>
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Hotel Occupancy
              </CardTitle>
              <BuildingOfficeIcon className="text-muted-foreground h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-muted-foreground text-xs">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Restaurant Revenue
              </CardTitle>
              <CurrencyDollarIcon className="text-muted-foreground h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,231</div>
              <p className="text-muted-foreground text-xs">
                +12.4% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Customer Satisfaction
              </CardTitle>
              <StarIcon className="text-muted-foreground h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-muted-foreground text-xs">
                +0.2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Staff Performance
              </CardTitle>
              <UsersIcon className="text-muted-foreground h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-muted-foreground text-xs">
                +3% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex grid-cols-1 flex-col gap-4 lg:grid lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hotel Occupancy</CardTitle>
            <CardDescription>
              Occupancy rates for your hotels over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinechartChart className="aspect-[9/4]" />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              Average customer ratings for your hotels and restaurants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadarchartChart className="aspect-[9/4]" />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Restaurant Revenue</CardTitle>
            <CardDescription>
              Total revenue for your restaurants over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarchartChart className="aspect-[9/4]" />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Charts;

function BarchartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: 'Desktop',
            color: 'hsl(var(--app-color-1))'
          }
        }}
        className="min-h-[300px] w-full lg:w-auto"
      >
        <BarChart
          accessibilityLayer
          data={[
            { month: 'January', desktop: 186 },
            { month: 'February', desktop: 305 },
            { month: 'March', desktop: 237 },
            { month: 'April', desktop: 73 },
            { month: 'May', desktop: 209 },
            { month: 'June', desktop: 214 }
          ]}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function LinechartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: 'Desktop',
            color: 'hsl(var(--app-color-1))'
          }
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: 'January', desktop: 186 },
            { month: 'February', desktop: 305 },
            { month: 'March', desktop: 237 },
            { month: 'April', desktop: 73 },
            { month: 'May', desktop: 209 },
            { month: 'June', desktop: 214 }
          ]}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

function RadarchartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: 'Desktop',
            color: 'hsl(var(--app-color-1))'
          }
        }}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadarChart
          data={[
            { month: 'January', desktop: 186 },
            { month: 'February', desktop: 305 },
            { month: 'March', desktop: 237 },
            { month: 'April', desktop: 273 },
            { month: 'May', desktop: 209 },
            { month: 'June', desktop: 214 }
          ]}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar
            dataKey="desktop"
            fill="var(--color-desktop)"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}
