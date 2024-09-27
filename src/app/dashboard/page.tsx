"use client";

import * as React from 'react';
import Grid from '@mui/material/Grid2';

import { config } from '@/config';
import { TopClientsCard } from '@/components/dashboard/overview/top-clients';
import { TopDomainsCard } from '@/components/dashboard/overview/top-domain';
import { HourlyQueryCountCard } from '@/components/dashboard/overview/hourly-query-count';
import { useTranslation } from 'react-i18next';
import { DailyQueryCountCard } from '@/components/dashboard/overview/daily-query-count';
import { MetricsCards } from '@/components/dashboard/overview/metrics-cards';

export default function Page(): React.JSX.Element {

  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Overview')} | ${t('Dashboard')} | ${config.site.name}`;
  }, [t]);

  return (
    <Grid container spacing={3}>
      <Grid size={{lg:12, xs:12}}>
        <MetricsCards />
      </Grid>
      <Grid size={{lg:12, xs:12}}>
        <HourlyQueryCountCard sx={{ height: '100%', width: '100%' }} />
      </Grid>
      <Grid size={{lg:12, xs:12}}>
        <DailyQueryCountCard sx={{ height: '100%', width: '100%' }} />
      </Grid>
      {/* <Grid size={{lg:6, md:12, xs:12}}>
        <OverViewCard sx={{ height: '100%', width: '100%' }} />
      </Grid> */}
      <Grid size={{lg:6, md:12, xs:12}}>
        <TopClientsCard sx={{ height: '100%', width: '100%' }} />
      </Grid>
      <Grid size={{lg:6, md:12, xs:12}}>
        <TopDomainsCard sx={{ height: '100%', width: '100%' }} />
      </Grid>
    </Grid>
  );
}
