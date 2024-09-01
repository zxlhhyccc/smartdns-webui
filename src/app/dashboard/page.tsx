"use client";

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { TopClientsCard } from '@/components/dashboard/overview/top-clients';
import { TopDomainsCard } from '@/components/dashboard/overview/top-domain';
import { OverViewCard } from '@/components/dashboard/overview/overview';
import { HourlyQueryCountCard } from '@/components/dashboard/overview/hourly-query-count';
import { useTranslation } from 'react-i18next';
import { UpStreamServersCard } from '@/components/dashboard/overview/upstream-servers';

export default function Page(): React.JSX.Element {

  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Overview')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Grid container spacing={3}>
      <Grid lg={12} xs={12}>
        <HourlyQueryCountCard sx={{ height: '100%', width: '100%'}}/>
      </Grid>
      <Grid lg={6} md={12} xs={12}>
        <OverViewCard sx={{ height: '100%', width: '100%'}}/>
      </Grid>
      <Grid lg={6} md={12} xs={12}>
        <UpStreamServersCard sx={{ height: '100%', width: '100%'}}/>
      </Grid>
      <Grid lg={6} md={12} xs={12}>
        <TopClientsCard sx={{ height: '100%', width: '100%'}}/>
      </Grid>
      <Grid lg={6} md={12} xs={12}>
        <TopDomainsCard sx={{ height: '100%', width: '100%'}}/>
      </Grid>
    </Grid>
  );
}
