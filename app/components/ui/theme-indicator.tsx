import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '~/components/theme-provider';

export function ThemeIndicator() {
  const { theme, resolvedTheme } = useTheme();

  const getIcon = () => {
    switch (resolvedTheme) {
      case 'light':
        return <Sun className="h-3 w-3" />;
      case 'dark':
        return <Moon className="h-3 w-3" />;
      default:
        return <Monitor className="h-3 w-3" />;
    }
  };

  const getStatus = () => {
    if (theme === 'system') {
      return `Auto (${resolvedTheme})`;
    }
    return theme === 'light' ? 'Light' : 'Dark';
  };

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {getIcon()}
      <span>{getStatus()}</span>
    </div>
  );
}
