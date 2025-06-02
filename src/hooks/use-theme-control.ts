import { useEffect } from 'react';
import { useTheme } from 'next-themes';

import useMounted from '@/hooks/use-mounted';

export default function useThemeControl() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const isMounted = useMounted();

  const isDarkTheme = resolvedTheme === 'dark';

  const toggleTheme = () => {
    const targetTheme = systemTheme === 'dark' ? 'light' : 'dark';

    setTheme(theme === 'system' ? targetTheme : 'system');
  };

  useEffect(() => {
    if (isMounted && theme !== 'system' && systemTheme === resolvedTheme) {
      setTheme('system');
    }
  }, [isMounted, theme, systemTheme, resolvedTheme, setTheme]);

  return { isDarkTheme, toggleTheme };
}
