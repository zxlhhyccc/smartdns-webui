import * as React from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { DarkModeSwitch } from '../common/darkmode-switch';
import { LanguageSwitch } from '../common/language-switch';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {

  return (
    <Box
      sx={{
        display: { xs: 'flex' },
        flexDirection: 'column',
        backgroundColor: 'var(--mui-palette-background-paper)',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2,  zIndex: 1, alignItems: 'center'}}>
          <Stack direction='row' spacing={2} >
            <LanguageSwitch size='small' />
            <DarkModeSwitch />
          </Stack>
        </Box>
        <Box sx={{ alignItems: 'center', transform: 'translateY(-10%)', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
