'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Landing from "@/components/landing";
import { useGameStore, useUserStore } from "./store";
import { createGameRoom, fatchGame, fetchUser } from "./game-actions";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function Home() {
  const router = useRouter()
  const currentUser = useUserStore((state) => state.user)
  const updateGame = useGameStore((state) => state.updateGame)
  const games = useGameStore((state) => state.game) || []
  const { user } = useSupabase()
  const updateUser = useUserStore((state) => state.updateUser)
  useEffect(() => {
    if (user?.id) fetchUser(user, updateUser)
  }, [user?.id])
  useEffect(() => {
    if (currentUser?.id) fatchGame(updateGame)
  }, [currentUser?.id])
  const [openModal, setOpenModal] = useState(false)

  const [domLoaded, setDomLoaded] = useState(false)
  useEffect(() => {
    setDomLoaded(true);
  }, [])

  return (
    <div className="flex min-h-[90vh] flex-col items-start justify-center w-full p-6 mb-5">
      <div className="flex w-full items-center justify-between">
        {(domLoaded && games.length && currentUser.id) ? <p className="text-xl">Rooms</p> : null}
        {(domLoaded && currentUser.id) ? <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Table</DialogTitle>
              <DialogDescription>
                Are you sure you want create a new Table
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="submit" className="sm:mt-0 mt-2" variant='secondary' onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={() => {
                createGameRoom(updateGame, games)
                setOpenModal(false)
              }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> : null}
      </div>
      {domLoaded && <div className="flex min-h-[90vh] items-start justify-center w-full">
        {games.length && currentUser.id
          ? <div className="w-full mt-4">
            {games.map((game: any, key: any) =>
              <Card key={key} className="w-full mt-2">
                <CardHeader>
                  <CardTitle>Game Room N° {game.id}</CardTitle>
                  <CardDescription>This Game Room Has {game.players.length} {game.players.length > 1 ? 'players' : 'player'}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => router.push(`/room/${game.id}`)}>Join Game</Button>
                </CardFooter>
              </Card>)}
          </div>
          : <Landing />}
      </div>}
    </div>
  )
}
