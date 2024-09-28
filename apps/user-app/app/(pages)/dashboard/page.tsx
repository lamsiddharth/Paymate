import { UpdateInfo } from "@/components/dashboard";
import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { Cover } from "@/components/ui/cover";


export default async function Home() {
   
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/api/auth/signin')
    }

    const user = await prisma.user.findUnique({
        where: {
            id: Number(session.user.id)
        }
    })
    return (
        <div className="flex flex-col gap-4 w-full items-center justify-center h-screen">
  <div>
    <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
      Payment Done in Wrap Speed <br /> at <Cover>PayMate</Cover>
    </h1>
  </div>
  <h1>
    <div className="flex flex-col gap-10 p-6 w-80 items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold text-white">User Profile</h2>
        <p className="text-base text-white">
          Add or update your information
        </p>
      </div>
      <UpdateInfo user={user} />
    </div>
  </h1>
</div>

        
        
    )
}
