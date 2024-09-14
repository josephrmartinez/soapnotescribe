import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
}

const LinkButton: React.FC<ButtonProps> = ({ children, href, ...rest }) => {
  return (
    <button className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
      <Link href={href}>{children}</Link>
    </button>
  );
};

export { LinkButton };
