"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { smartdnsServer } from '@/lib/backend/server';
import type { OverViewStats } from '@/lib/backend/server';
import { useUser } from '@/hooks/use-user';
import { CardLoading } from './card-loading';
import { useTranslation } from 'react-i18next';

interface OverView {
  key: string;
  name: string;
  value: string;
}

export interface OverViewStatsProps {
  overview: OverView[];
  sx?: SxProps;
}

function OverViewTable({ overview }: OverViewStatsProps): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 100 }}>
        <TableBody>
          {overview.map((item) => {
            return (
              <TableRow key={item.key}>
                <TableCell>{t(item.name)}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}

const mapOverViewStatsToOverView = (stats: OverViewStats): OverView[] => {
  return [
    { key: 'total_query_count', name: 'Total Query Count', value: stats.total_query_count.toString() },
    { key: 'block_query_count', name: 'Blocked Query Count', value: stats.block_query_count.toString() },
    { key: 'cache_hit_rate', name: 'Cache Hit Rate', value: `${stats.cache_hit_rate.toString()}%` },
    { key: 'cache_number', name: 'Cache Number', value: stats.cache_number.toString() },
    { key: 'avg_query_time', name: 'Average Query Time', value: `${stats.avg_query_time.toString()} ms` },
  ];
};

export function OverViewCard(sx: SxProps): React.JSX.Element {
  const { checkSessionError } = useUser();
  const [overview, setOverview] = React.useState<OverView[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await smartdnsServer.GetOverView();
      if (data.error) {
        await checkSessionError?.(data.error);
        setErrorMsg(smartdnsServer.getErrorMessage(data.error));
        return;
      }

      if (data.data === null || data.data === undefined) {
        return;
      }

      const mappedOverview = mapOverViewStatsToOverView(data.data);
      setOverview(mappedOverview);
      setLoading(false);
    };

    void fetchData();
  }, [checkSessionError]);

  return (
    <CardLoading title={t("Overview")} isLoading={loading} errorMsg={errorMsg}>
      <OverViewTable overview={overview} sx={sx} />
    </CardLoading>
  );
}
