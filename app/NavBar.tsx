'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeModeToggle';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from '@nextui-org/react';
import { BugIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NavBar() {
  const currentPath = usePathname();

  const Links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Issues', href: '/issues' },
  ];

  return (
    <Navbar shouldHideOnScroll isBordered maxWidth='full' className='mb-5'>
      {/* Left side of the navbar */}
      <NavbarBrand>
        <Link href='/' className='inline-flex items-start gap-2'>
          <BugIcon />
          <p className='hidden md:flex font-bold text-xl font-satisfy'>ISSUE TRACKER</p>
        </Link>
      </NavbarBrand>

      {/* Center of the navbar */}
      <NavbarContent justify='center'>
        {Links.map((link, i) => (
          <NavbarItem key={i} isActive={currentPath === link.href} className='hidden md:flex'>
            <Link
              href={link.href}
              className={cn(
                {
                  'text-foreground': currentPath === link.href,
                  'text-muted-foreground hover:text-foreground': currentPath !== link.href,
                },
                'transition-colors duration-200 ease-in-out text-lg'
              )}
            >
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side of the navbar */}
      <NavbarContent justify='end' className='gap-0'>
        <NavbarItem className='hidden 2xs:flex'>
          <Button as={Link} color='default' href='#' variant='light'>
            Login
          </Button>
        </NavbarItem>
        <NavbarItem className='hidden xs:flex'>
          <Button as={Link} color='default' href='#' variant='light'>
            Sign Up
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
