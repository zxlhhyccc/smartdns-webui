import { ArticleOutlined, SettingsOutlined, DnsOutlined, type SvgIconComponent, QueryStatsOutlined, EventNoteOutlined, TerminalOutlined, DevicesOutlined } from '@mui/icons-material';

export const navIcons = {
  'QueryStats': QueryStatsOutlined,
  'EventNote': EventNoteOutlined,
  "Dns": DnsOutlined,
  "Devices": DevicesOutlined,
  'Article': ArticleOutlined,
  'Settings': SettingsOutlined,
  'Terminal': TerminalOutlined,
} as Record<string, SvgIconComponent>;
