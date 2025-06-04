import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme, Theme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const order: Theme[] = ['dark', 'light', 'neon'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };
  
  const icons = {
    dark: <Sun className="h-5 w-5" />,
    light: <Moon className="h-5 w-5" />,
    neon: <Sparkles className="h-5 w-5" />,
  } as const;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
      aria-label="Toggle theme"
    >
      {icons[theme]}
    </Button>
  );
}
