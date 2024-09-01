"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { QueryLogTable } from '@/components/dashboard/query-log/query-log-table';
import { useTranslation } from 'react-i18next';

export default function Page(): React.JSX.Element {
  const { t} = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Query Log')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Stack spacing={2}>
      <QueryLogTable />
    </Stack>
  );
}
