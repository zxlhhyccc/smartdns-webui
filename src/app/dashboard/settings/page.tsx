"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import SettingsTab from '@/components/dashboard/settings/settings-tab';
import { useTranslation } from 'react-i18next';

export default function Page(): React.JSX.Element {
  const { t} = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Settings')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Stack spacing={3}>
      <SettingsTab />
    </Stack>
  );
}
