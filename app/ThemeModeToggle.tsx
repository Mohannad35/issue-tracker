'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Dropdown className='min-w-0 w-fit'>
      <DropdownTrigger>
        <Button isIconOnly variant='light'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        selectionMode='single'
        selectedKeys={[theme!]}
        disabledKeys={[theme!]}
        hideSelectedIcon
        onAction={key => setTheme(String(key))}
      >
        <DropdownItem key='light'>Light</DropdownItem>
        <DropdownItem key='dark' showDivider>
          Dark
        </DropdownItem>
        <DropdownItem key='system'>System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
