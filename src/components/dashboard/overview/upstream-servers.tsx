"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { smartdnsServer } from '@/lib/backend/server';
import type { UpStreamServers } from '@/lib/backend/server';
import { useUser } from '@/hooks/use-user';
import { CardLoading } from './card-loading';
import { paths } from '@/paths';
import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface UpStreamServersProps {
  servers: UpStreamServers[];
  sx?: SxProps;
}

function UpstreamServersTable({ servers }: UpStreamServersProps): React.JSX.Element {

  const { t } = useTranslation();

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 100 }}>
        <TableHead>
          <TableRow>
            <TableCell>{t('Server')}</TableCell>
            <TableCell>{t('Status')}</TableCell>
            <TableCell>{t('Avg Time')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map((server) => {
            const serverIp = encodeURIComponent(server.ip);
            const key = server.ip + server.server_type;
            return (
              <TableRow key={key}>
                <TableCell><Link href={`${paths.dashboard.queryLog}?client=${serverIp}`} >{server.ip}</Link></TableCell>
                <TableCell>{server.status}</TableCell>
                <TableCell>{server.avg_time}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}

export function UpStreamServersCard(sx: SxProps): React.JSX.Element {
  const { checkSessionError } = useUser();
  const [servers, setServers] = React.useState<UpStreamServers[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await smartdnsServer.GetUpstreamServers();
      if (data.error) {
        await checkSessionError?.(data.error);
        setErrorMsg(smartdnsServer.getErrorMessage(data.error));
        return;
      }

      if (data.data === null || data.data === undefined) {
        return;
      }

      setServers(data.data);
      setLoading(false);
    };

    void fetchData();
  }, [checkSessionError]);

  return (
    <CardLoading title={t("Upstream Servers")} isLoading={loading} errorMsg={errorMsg}>
      <UpstreamServersTable servers={servers} sx={sx} />
    </CardLoading>
  );
}
