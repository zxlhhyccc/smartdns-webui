'use client';

import { LanguageSwitch } from '@/components/common/language-switch';
import { Card, CardContent } from '@mui/material';
import * as React from 'react';

export function ChangeLang(): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <LanguageSwitch/>
      </CardContent>
    </Card>
  );
}

