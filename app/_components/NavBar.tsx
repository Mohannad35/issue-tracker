import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { BugIcon } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeModeToggle';
import NavBarAuth from './navbar-auth';
import NavBarLinks from './navbar-links';

export default async function NavBar() {
  return (
    <Navbar
      shouldHideOnScroll
      isBordered
      maxWidth='full'
      className='mb-5'
      classNames={{ wrapper: '!container' }}
    >
      {/* Left side of the navbar */}
      <NavbarBrand>
        <Link href='/' className='flex items-center gap-2'>
          <BugIcon height={24} width={24} />
          <p className='hidden md:flex font-bold text-xl font-satisfy'>ISSUE TRACKER</p>
        </Link>
      </NavbarBrand>

      {/* Center of the navbar */}
      <NavbarContent justify='center'>
        <NavBarLinks />
      </NavbarContent>

      {/* Right side of the navbar */}
      <NavbarContent justify='end'>
        <NavbarItem className='hidden 2xs:flex'>
          <NavBarAuth />
        </NavbarItem>
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
