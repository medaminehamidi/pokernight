

"use client"
import { useSupabase } from "@/components/SupabaseSessionProvider"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { RealtimeChannel } from "@supabase/supabase-js"

export default function Room() {
  const { user } = useSupabase()
  const [userData, setUserData] = useState<any>({})
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [room, setRoom] = useState('')

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

  useEffect(() => {
    if (room && userData.username) {
      const channel = supabase.channel(`room:${room}`, {
        config: {
          broadcast: {
            self: true
          }
        }
      })
      const userStatus = {
        user: userData.username,
        online_at: new Date().toISOString(),
      }

      channel.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') { return }

        const presenceTrackStatus = await channel.track(userStatus)
        console.log(presenceTrackStatus)
      })
      channel.on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();

        const users = Object.keys(presenceState)
          .map((presenceId) => {
            const presences = presenceState[presenceId] as unknown as { user: string }[];
            return presences.map((presence) => presence.user);
          })
          .flat();
      });
      setChannel(channel)
      return () => {
        channel.unsubscribe();
      };
    }
  }, [userData.username, room])
  return (
    <div className='container flex h-[99vh] items-center justify-center p-6 '>
      <div className='container relative grid h-[800px] flex-col items-center justify-center rounded-lg border-2 lg:max-w-none lg:px-0'>
       
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                HELL
              </h1>
              <p className='text-sm text-muted-foreground'>
                123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
