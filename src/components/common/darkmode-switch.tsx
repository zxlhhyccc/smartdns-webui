"use client";

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material';
import { LightModeOutlined, DarkModeOutlined, SettingsBrightnessOutlined } from '@mui/icons-material';
import { NoSsr } from '../core/no-ssr';
import useMediaQuery from '@mui/material/useMediaQuery';

export function DarkModeSwitch(): React.JSX.Element | null {
  const { setColorScheme } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [colorMode, setColorMode] = React.useState('system');

  const doSetColorMode = React.useCallback((mode: string): void => {
    let color = mode;
    let modeSet = mode;
    if (mode !== 'system' && mode !== 'dark' && mode !== 'light') {
      modeSet = 'system';
    }

    if (modeSet === 'system') {
      if (prefersDarkMode) {
        color = 'dark';
      } else {
        color = 'light';
      }
    }

    setColorMode(modeSet);
    setColorScheme(color as 'light' | 'dark');
  }, [prefersDarkMode, setColorScheme]);

  React.useEffect(() => {
    const storedMode = localStorage.getItem('user-color-scheme');
    doSetColorMode(storedMode ?? 'system');
  }, [prefersDarkMode, setColorScheme, doSetColorMode]);


  const handleToggleMode = (): void => {

    let newMode;
    if (colorMode === 'system') {
      newMode = 'dark';
    } else if (colorMode === 'dark') {
      newMode = 'light';
    } else {
      newMode = 'system';
    }

    localStorage.setItem('user-color-scheme', newMode);
    doSetColorMode(newMode);
  };

  return (
    <NoSsr>
      <IconButton sx={{ ml: 1 }} onClick={handleToggleMode}>
        {colorMode === 'light' && <LightModeOutlined />}
        {colorMode === 'dark' && <DarkModeOutlined />}
        {colorMode === 'system' && <SettingsBrightnessOutlined />}
      </IconButton>
    </NoSsr>
  );
}
