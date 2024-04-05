import Link from 'next/link';
import React from 'react';
import { AiFillBug } from 'react-icons/ai';
import { ThemeToggle } from './ThemeModeToggle';

const NavBar = () => {
  const Links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Issues', href: '/issues' },
  ];

  return (
    <nav
      style={{ position: 'sticky', top: 0, zIndex: 9 }}
      className='flex justify-between px-5 mb-5 h-14 w-full items-center border-b'
    >
      {/* Left side of the navbar */}
      <div>
        <Link href='/'>
          <AiFillBug />
        </Link>
      </div>

      {/* Middle of the navbar */}
      <ul className='flex space-x-6'>
        {Links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            {link.name}
          </Link>
        ))}
      </ul>

      {/* Right side of the navbar */}
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
