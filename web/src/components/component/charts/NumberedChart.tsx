"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { twMerge } from "tailwind-merge"

const chartConfig = {
  value: {
    label: "Energy",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export type NumberedChartData = {
  label: string
  value: number
}[]

export interface NumberedChartProps {
  data: NumberedChartData
  config: {
    title: React.ReactNode
    description: React.ReactNode
    footer: React.ReactNode
  }
  classNames?: {
    chartContainer?: string
  }
  roundValues?: boolean
}

export default function NumberedChart({
  data,
  config,
  classNames,
  roundValues = true,
}: NumberedChartProps) {
  const dataPoints = useMemo(
    () =>
      roundValues
        ? data.map(bar => ({ ...bar, value: Math.round(bar.value) }))
        : data,
    [roundValues]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={twMerge("min-h-[200px] w-full", classNames?.chartContainer)}
        >
          <BarChart
            accessibilityLayer
            data={dataPoints}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill={chartConfig.value.color} radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
        {config.footer}
      </CardFooter>
    </Card>
  )
}
