import RoomForm from "@/components/roomform";
import { Dices, Skull } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useUserStore } from "@/app/store";

export default function Landing() {
  const currentUser = useUserStore((state) => state.user)
  return (
    <div className="flex min-h-[90vh] items-center justify-center p-6 mb-5">
      {currentUser.id
          ? (
            <div className="h-full w-full flex flex-col items-center justify-center ">
              <Skull className="w-20 h-20 mb-5" />
              <p className="text-3xl leading-10 text-center">You need two or more players to start the game ...</p>
            </div>)
          : (<div className="h-full w-full flex flex-col items-center justify-center ">
            <Dices className="w-20 h-20 mb-5" />
            <p className="text-3xl leading-10 
              bg-gradient-to-r bg-clip-text  text-transparent 
              from-indigo-500 via-purple-500 to-indigo-500
              animate-text">Poker Night</p>
            <Link
              href={siteConfig.links.signup}
              className={cn(buttonVariants({ variant: 'default' }), 'p-0 w-full mt-10')}
            >
              <p className="text-ms mr-2">Make an account</p>
            </Link>
            <Link
              href={siteConfig.links.signin}
              className={cn(buttonVariants({ variant: 'outline' }), 'p-0  w-full mt-5')
              }
            >
              <p className="text-ms mr-2">Log In</p>
            </Link>
          </div>)}
    </div>
  )
}
