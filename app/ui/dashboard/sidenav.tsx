import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/ui/logo';
import LogOut from './LogOut';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-2 md:px-2">
      <div
        className="mb-2 flex h-20 items-start justify-start rounded-md border border-gray-100 p-4 md:h-40"
      >
        <div className="w-32 mt-6 text-white md:w-40">
          <Logo />
        </div>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <LogOut />
      </div>
    </div>
  );
}
