'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { MobileNav } from './mobile-nav';
import { MainToolBar } from './main-toolbar';
import { Typography } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';

interface MainNavProps {
  pageTitle: string;
}

export function MainNav({ pageTitle }: MainNavProps): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          color: 'var(--mui-palette-toolbar-title-color)',
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-toolbar-title-background)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <MenuOutlined />
            </IconButton>
            <Stack>
              <Typography variant="h5">{pageTitle}</Typography>
            </Stack>
          </Stack>
          <MainToolBar />
        </Stack>
      </Box>
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
        OnClickItem={() => {
          setOpenNav(false);
        }}
      />
    </React.Fragment>
  );
}
