import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import Header from './ui/Header';


export const metadata: Metadata = {
  title: {
    template: '%s | soapscribe',
    default: 'soapscribe',
  },
  description: 'Automatically draft SOAP notes.',
  metadataBase: new URL('https://https://soapscribe.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased `}>{children}</body>
    </html>
  );
}
