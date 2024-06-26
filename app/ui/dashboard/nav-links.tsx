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
  { name: 'All Notes', href: '/dashboard/notes', icon: ArchiveBoxIcon },
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
  // {
  //   name: 'Settings',
  //   href: '/dashboard/settings',
  //   icon: Cog8ToothIcon,
  // },
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
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md border border-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-teal-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="hidden w-6 md:block" />
            <p className="">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
