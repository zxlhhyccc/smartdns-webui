"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { Log } from '@/components/dashboard/log/log';
import { useTranslation } from 'react-i18next';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Log')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Stack spacing={1} height='100%'>
      <Log />
    </Stack>
  );
}
