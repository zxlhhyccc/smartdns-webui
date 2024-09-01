"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { TerminalTab } from '@/components/dashboard/term/xterm-tab';
import { useTranslation } from 'react-i18next';


export default function Page(): React.JSX.Element {

  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Terminal')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Stack spacing={1} height='100%'>
      <TerminalTab />
    </Stack>
  );
}
