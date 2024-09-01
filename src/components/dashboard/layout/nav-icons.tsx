import { ArticleOutlined, SettingsOutlined, DnsOutlined, type SvgIconComponent, QueryStatsOutlined, EventNoteOutlined, TerminalOutlined } from '@mui/icons-material';

export const navIcons = {
  'QueryStats': QueryStatsOutlined,
  'EventNote': EventNoteOutlined,
  "Dns": DnsOutlined,
  'Article': ArticleOutlined,
  'Settings': SettingsOutlined,
  'Terminal': TerminalOutlined,
} as Record<string, SvgIconComponent>;
