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
  const resetTable = async () => {
    const { data: gameData, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching game state:', error);
      return;
    }

    const updatedGameState = {
      ...gameData,
      pot: 0,
      highbet: 0,
      players: [],
      community_cards: []
    };

    // Update game state in Supabase
    await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', 1);

  }
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
        {userData.index === 1 && <DropdownMenuItem
          onClick={() => {
            resetTable()
          }}
        >
          Reset Table
        </DropdownMenuItem>}
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
