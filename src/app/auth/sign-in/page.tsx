"use client";

import * as React from 'react';
import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignInForm } from '@/components/auth/sign-in-form';
import { useTranslation } from 'react-i18next';


export default function Page(): React.JSX.Element {

  const { t} = useTranslation();

  React.useEffect(() => {
    document.title = `${t('Sign in')} | ${t('Auth')} | ${config.site.name}`;
  }, [t]);

  return (
    <Layout>
      <GuestGuard>
        <SignInForm />
      </GuestGuard>
    </Layout>
  );
}
