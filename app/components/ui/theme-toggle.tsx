import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useTheme, type Theme } from '~/components/theme-provider';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabels?: boolean;
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  showLabels = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Light';
    }
  };

  const getDescription = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
      case 'system':
        return 'Switch to light mode';
      default:
        return 'Switch theme';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={cycleTheme}
      aria-label={getDescription()}
      title={getDescription()}
      className={showLabels ? 'gap-2' : ''}
    >
      {getIcon()}
      {showLabels && (
        <span className="text-sm font-medium">{getLabel()}</span>
      )}
    </Button>
  );
}

interface ThemeMenuProps {
  onSelect?: (theme: Theme) => void;
}

export function ThemeMenu({ onSelect }: ThemeMenuProps) {
  const { theme, setTheme } = useTheme();

  const themes: {
    value: Theme;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="h-4 w-4" />,
      description: 'Light mode',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="h-4 w-4" />,
      description: 'Dark mode',
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="h-4 w-4" />,
      description: 'System preference',
    },
  ];

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    onSelect?.(newTheme);
  };

  return (
    <div className="grid gap-1">
      {themes.map((themeOption) => (
        <Button
          key={themeOption.value}
          variant={theme === themeOption.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleThemeSelect(themeOption.value)}
          className="justify-start gap-2 w-full"
        >
          {themeOption.icon}
          <div className="text-left">
            <div className="font-medium">{themeOption.label}</div>
            <div className="text-xs text-muted-foreground">
              {themeOption.description}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}
