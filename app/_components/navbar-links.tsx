'use client';

import { cn } from '@/lib/utils';
import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBarLinks = () => {
  const currentPath = usePathname();

  const Links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Issues', href: '/issues' },
  ];

  return (
    <>
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
    </>
  );
};

export default NavBarLinks;
