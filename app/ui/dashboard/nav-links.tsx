'use client';

import {
  UserGroupIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  Cog8ToothIcon,
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Notes', href: '/dashboard/notes', icon: ArchiveBoxIcon },
  {
    name: 'New Note',
    href: '/dashboard/newnote',
    icon: PencilSquareIcon,
  },
  {
    name: 'Templates',
    href: '/dashboard/templates',
    icon: DocumentDuplicateIcon,
  },
  // {
  //   name: 'Protocols',
  //   href: '/dashboard/protocols',
  //   icon: DocumentDuplicateIcon,
  // },
  {
    name: 'Patients',
    href: '/dashboard/patients',
    icon: UserGroupIcon,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Cog8ToothIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md border border-gray-100 text-sm font-medium transition-all hover:bg-sky-100 hover:text-teal-600 sm:p-3 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-teal-600': pathname.includes(link.href),
              },
            )}
          >
            <LinkIcon className="w-6 " />
            <p className="text-md hidden whitespace-nowrap md:block">
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
