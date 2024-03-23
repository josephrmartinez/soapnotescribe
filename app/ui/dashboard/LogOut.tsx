import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { ArrowRightStartOnRectangleIcon} from '@heroicons/react/24/outline';


export default function LogOut() {
  
  const logout = async () => {
    "use server"
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/")
  }

  return (
    <form>
      <button 
          formAction={logout}
          className="h-[48px] flex md:w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 px-3">
          <ArrowRightStartOnRectangleIcon className="w-6" />
          <div className="hidden md:block">log out</div>
      </button>
    </form>
    
    
  )
}