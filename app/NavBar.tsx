'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeModeToggle';
import { AcmeLogo } from './AcmeLogo';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
} from '@nextui-org/react';

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
        <Link href='/'>
          <AcmeLogo />
          <p className='font-bold text-inherit'>ACME</p>
        </Link>
      </NavbarBrand>

      {/* Center of the navbar */}
      <NavbarContent justify='center'>
        {Links.map((link, i) => (
          <NavbarItem key={i} isActive={currentPath === link.href}>
            <Link href={link.href} color='foreground'>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side of the navbar */}
      <NavbarContent justify='end' className='gap-0'>
        <NavbarItem className='hidden lg:flex'>
          <Button as={Link} color='primary' href='#' variant='light'>
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color='primary' href='#' variant='light'>
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
