import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/app/database.types'
import CreateAgent from './create-agent';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Agent",
}

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'AI Agents', href: '/dashboard/agents' },
          {
            label: 'Create',
            href: '/dashboard/appointments/create',
            active: true,
          },
        ]}
      />
      <CreateAgent session={session} />
    </main>
  );
}