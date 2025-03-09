'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/use-user';

type OnActiveItemType = (item: NavItemConfig) => void;

export interface SideNavProps {
  onActiveItem?: OnActiveItemType;
}

export function SideNav({ onActiveItem }: SideNavProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-toolbar-background)',
        '--SideNav-color': 'var(--mui-palette-toolbar-color)',
        '--SideNav-title-color': 'var(--mui-palette-toolbar-title-color)',
        '--SideNav-title-background': 'var(--mui-palette-toolbar-title-background)',
        '--NavItem-color': 'var(--mui-palette-toolbar-navItem-color)',
        '--NavItem-hover-background': 'var(--mui-palette-toolbar-navItem-hoverBackground)',
        '--NavItem-active-background': 'var(--mui-palette-toolbar-navItem-activeBackground)',
        '--NavItem-active-color': 'var(--mui-palette-toolbar-navItem-activeColor)',
        '--NavItem-disabled-color': 'var(--mui-palette-toolbar-navItem-disabledColor)',
        '--NavItem-icon-color': 'var(--mui-palette-toolbar-navItem-iconColor)',
        '--NavItem-icon-active-color': 'var(--mui-palette-toolbar-navItem-iconActiveColor)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-toolbar-navItem-iconDisabledColor)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3, alignItems: 'center' }} direction="row" >
        <Box component={RouterLink} href={paths.home}
          sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={64} width={64} />
        </Box>
        <Typography variant="h5">SmartDNS</Typography>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-divider)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        <RenderNavItems onActiveItem={onActiveItem} pathname={pathname} items={navItems} />
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-divider)' }} />
    </Box>
  );
}

function RenderNavItems({ onActiveItem, items = [], pathname }: { onActiveItem?: OnActiveItemType; items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useUser();

  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, title = "", ...item } = curr;

    if (user && user.sideNavVisibility.has(key) && user.sideNavVisibility.get(key) !== true) {
      acc.push(null);
      return acc;
    }

    acc.push(<NavItem key={key} pathname={pathname} title={t(title)} {...item} />);

    const { disabled, external, href, matcher } = curr;
    const active = isNavItemActive({ disabled, external, href, matcher, pathname });
    if (active && onActiveItem && curr) {
      onActiveItem(curr);
    }

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (<Icon />) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
