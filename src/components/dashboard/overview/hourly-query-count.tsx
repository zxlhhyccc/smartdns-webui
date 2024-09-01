"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme, type SxProps } from '@mui/material/styles';
import { smartdnsServer } from '@/lib/backend/server';
import type { HourlyQueryCount } from '@/lib/backend/server';
import { useUser } from '@/hooks/use-user';
import { CardLoading } from './card-loading';
import { type ActiveElement, Chart, type ChartEvent, registerables } from 'chart.js';
import { useTranslation } from 'react-i18next';
import { MenuOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';

Chart.register(...registerables);
Chart.register(annotationPlugin);

export interface HourlyQueryCountProps {
  queryCount: HourlyQueryCount[];
  setTitle: (title: string) => void;
  setTitleAction: (action: React.ReactNode) => void;
  sx?: SxProps;
}

function HourlyQueryCountTable({ queryCount, setTitle, setTitleAction }: HourlyQueryCountProps): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const myChartRef = React.useRef();
  const [isRangeReady, setIsRangeReady] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<{ start: number, end: number } | null>(null);

  React.useEffect(() => {
    setTitle("Hourly Query Count");
    setTitleAction(
      <IconButton
        onClick={(): void => {

          let start = selectedRange?.start ?? 0;
          let end = selectedRange?.end ?? 0;
          if (start > end) {
            [start, end] = [end, start];
          }

          const endDate = queryCount[end].hour;
          const startDate = queryCount[start].hour;

          const startTimestamp = new Date(startDate).getTime();
          const endTimestamp = new Date(endDate).getTime();
          const url = `${paths.dashboard.queryLog}?timestamp_before=${endTimestamp}&timestamp_after=${startTimestamp}`;

          router.push(url);
        }}
      >
        <MenuOutlined />
      </IconButton>
    );
  }, [setTitle, setTitleAction, selectedRange, router, queryCount]);

  const handleClick = (event: ChartEvent, _elements: ActiveElement[], chart: Chart) : void => {
    const xScale = chart.scales['x'];
    const x = xScale.getValueForPixel(event.x??0) ?? 0;

    if (isRangeReady) {
      setSelectedRange(null);
      setIsRangeReady(false);
      return;
    }

    if (selectedRange === null) {
      setSelectedRange({ start: x, end: x});
      return;
    }

    setSelectedRange({start: selectedRange.start, end: x});
    setIsRangeReady(true);
  };

  return (<Box
    sx={{
      height: '200px',
    }}>
    <Line
      ref={myChartRef} 
      data={{
      labels: queryCount.map((data) => {
        const date = new Date(data.hour);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }),
      datasets: [
        {
          label: t("Query Count"),
          data: queryCount.map((data) => data.query_count),
          fill: false,
          borderColor: theme.palette.primary.main,
          tension: 0.1,
        }
      ],
    }}
      options={{
        animation: {
          duration: 400,
        },
        scales: {
          x: {
            reverse: false
          }
        },
        plugins: {
          legend: {
            display: false
          },
          annotation: {
            annotations: {
              box1: {
                type: 'box',
                display: selectedRange !== null,
                xMin: selectedRange?.start ?? 0,
                xMax: selectedRange?.end ?? 0,
                backgroundColor: 'rgba(30, 30, 30, 0.25)'
              }
            }
          }
        },
        maintainAspectRatio: false,
        onClick: handleClick,
      }}
    />
  </Box>);
}

export function HourlyQueryCountCard(sx: SxProps): React.JSX.Element {
  const { checkSessionError } = useUser();
  const [queryCount, setQueryCount] = React.useState<HourlyQueryCount[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const { t } = useTranslation();
  const [title, setTitle] = React.useState<string>("");
  const [titleAction, setTitleAction] = React.useState<React.ReactNode | null>(null);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await smartdnsServer.GetHourlyQueryCount();
      if (data.error) {
        await checkSessionError?.(data.error);
        setErrorMsg(smartdnsServer.getErrorMessage(data.error));
        return;
      }

      if (data.data === null || data.data === undefined) {
        return;
      }

      setQueryCount(data.data.slice().reverse());
      setLoading(false);
    };

    void fetchData();
  }, [checkSessionError]);

  return (<Box>
    <CardLoading title={t(title)}
      titleAction={titleAction}
      isLoading={loading}
      errorMsg={errorMsg}>
      <HourlyQueryCountTable queryCount={queryCount} sx={sx} setTitle={setTitle} setTitleAction={setTitleAction} />
    </CardLoading>
  </Box>);
}
