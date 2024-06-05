import Logo from '@/app/ui/logo';

export default function NotificationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-24">
      <div className="rounded-md p-6  ">
        <div className="mb-6 mt-2 flex justify-center">
          <Logo />
        </div>
        <div className="mt-20 text-center">
          Check your email for a link to activate your account.
        </div>
      </div>
    </main>
  );
}
