import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    console.error(error)
    redirect('/error')
  }


  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard for {data.user.email}
      </h1>
      
    </main>
  );
}