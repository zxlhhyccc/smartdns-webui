export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in'},
  dashboard: {
    dashboard: '/dashboard',
    queryLog: '/dashboard/query-log',
    upstreamServers: '/dashboard/upstream-servers',
    settings: '/dashboard/settings',
    log: '/dashboard/log',
    term: '/dashboard/term',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
