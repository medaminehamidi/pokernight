import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSupabase } from './SupabaseSessionProvider'

export function UserNav() {
  const { user, supabase } = useSupabase()
  const [userData, setUserData] = useState<any>({})
  const router = useRouter()
  useEffect(() => {
    const fetchUser = async () => {
      const results = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
      if (results?.data && results?.data.at(0)) {
        setUserData(results?.data.at(0))
      }
    }
    if (user?.id) fetchUser()
  }, [user?.id])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex justify-around '>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`}
              alt={`@${userData?.name}`}
            />
            <AvatarFallback>{userData?.full_name}</AvatarFallback>
          </Avatar>
          {userData?.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {userData?.username}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            supabase.auth.signOut()
            router.push(siteConfig.links.home)
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
