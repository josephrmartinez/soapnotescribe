import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';


export const metadata: Metadata = {
  title: {
    template: '%s | advocate.ai',
    default: 'advocate.ai',
  },
  description: 'Patient advocate tool that helps users prepare for, record, and review medical appointments.',
  metadataBase: new URL('https://https://advocateai.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased bg-gray-50`}>{children}</body>
    </html>
  );
}
