'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import useMounted from '@/hooks/use-mounted';
import useThemeControl from '@/hooks/use-theme-control';

import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

const ThemeControlSwitch = () => {
  const mounted = useMounted();

  const { theme, setTheme } = useThemeControl();

  if (!mounted) {
    return null;
  }

  return (
    <ToggleGroup type="single" value={theme} onValueChange={setTheme} size="sm">
      <ToggleGroupItem value="light">
        <SunIcon aria-label="icon-light-mode" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <MonitorIcon aria-label="icon-system-mode" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <MoonIcon aria-label="icon-dark-mode" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ThemeControlSwitch;
