'use client';

import * as React from 'react';
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

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown className='min-w-0 w-fit'>
      <DropdownTrigger>
        <Button isIconOnly variant='light'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu selectionMode='single' selectedKeys={[theme!]}>
        <DropdownItem key='light' onClick={() => setTheme('light')}>
          Light
        </DropdownItem>
        <DropdownItem key='dark' onClick={() => setTheme('dark')} showDivider>
          Dark
        </DropdownItem>
        <DropdownItem key='system' onClick={() => setTheme('system')}>
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
