"use client";

import { Box, Stack } from "@mui/material";
import * as React from 'react';
import { TerminalTable } from "./xterm";


export function TerminalTab(): React.JSX.Element {
    return (
        <Stack spacing={1}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 'var(--MainNav-height)',
                    left: {
                        lg: 'var(--SideNav-width)',
                        xs: 0,
                    },
                    right: 0,
                    height: {
                        lg: 'calc(100% - var(--MainNav-height) - var(--Footer-height))',
                        xs: 'calc(100% - var(--MainNav-height) - var(--Footer-height-mobile))',
                    },
                    width: {
                        lg: 'calc(100% - var(--SideNav-width))',
                        xs: '100%',
                    },
                }}
            >
                <TerminalTable />
            </Box>
        </Stack>
    )
}