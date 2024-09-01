"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { UpstreamServersTable } from '@/components/dashboard/upstream-servers/upstream-servers-table';
import { useTranslation } from 'react-i18next';

export default function Page(): React.JSX.Element {
  const { t} = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Upstream Servers')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Stack spacing={2}>
      <UpstreamServersTable />
    </Stack>
  );
}
