"use client"
import { useSupabase } from "@/components/SupabaseSessionProvider"
import { supabase } from "@/lib/supabase"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useFormik } from "formik"
import { Button } from "./ui/button"
import { RealtimeChannel } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import PlayerCard from "./player-card"
import { BadgePercent, CircleDollarSign, Wallet2 } from "lucide-react"
import Table from "./table"
import Player from "./player"

export default function RoomForm() {
  const { user } = useSupabase()
  const [userData, setUserData] = useState<any>({})
  const [gameState, setGameState] = useState<any>(null)

  const [users, setUsers] = useState<any>([])
  const [updated, setUpdated] = useState('')
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [allReady, setAllReady] = useState(false)
  const [room, setRoom] = useState('')
  const renderUnicodeSuitSymbol = (suit: any) => {
    switch (suit) {
      case ('Heart'): return '\u2665';
      case ('Diamond'): return '\u2666';
      case ('Spade'): return '\u2660';
      case ('Club'): return '\u2663';
      default: throw Error('Unfamiliar String Recieved in Suit Unicode Generation');
    }
  }
  const cardData = {
    suit: 'Diamond',
    cardFace: '2'
  }



  const totalNumCards = 52;
  const suits = ['Heart', 'Spade', 'Club', 'Diamond'];
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const VALUE_MAP: any = {
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    J: 10,
    Q: 11,
    K: 12,
    A: 13,
  };

  const randomizePosition = (min: any, max: any) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const gameStates = {
    start: 'in_progress',
    end: 'finished'
  }
  const generateDeckOfCards = () => {
    const deck = [];

    for (let suit of suits) {
      for (let card of cards) {
        deck.push({
          cardFace: card,
          suit: suit,
          value: VALUE_MAP[card]
        })
      }
    }
    return deck
  }

  const generateDeck = (deck: any) => {
    let shuffledDeck = new Array(totalNumCards);
    let filledSlots: number[] = [];
    for (let i = 0; i < totalNumCards; i++) {
      if (i === 51) {
        // Fill last undefined slot when only 1 card left to shuffle
        const lastSlot = shuffledDeck.findIndex((el) => typeof el == 'undefined');
        shuffledDeck[lastSlot] = deck[i];
        filledSlots.push(lastSlot);
      } else {
        let shuffleToPosition = randomizePosition(0, totalNumCards - 1);
        while (filledSlots.includes(shuffleToPosition)) {
          shuffleToPosition = randomizePosition(0, totalNumCards - 1);
        }
        shuffledDeck[shuffleToPosition] = deck[i];
        filledSlots.push(shuffleToPosition);
      }
    }
    return shuffledDeck
  }

  const [inRoom, setInRoom] = useState(false)
  const handleDeal = async () => {
    const deck = generateDeck(generateDeckOfCards());
    const players = gameState.players.map((player: any) => ({
      ...player,
      hand: [deck.pop(), deck.pop()] // Deal two cards to each player
    }));

    const communityCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()]; // Deal five community cards

    const updatedGameState = {
      ...gameState,
      players,
      community_cards: communityCards
    };

    // Update game state in Supabase
    await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', 1);

    setGameState(updatedGameState);
  };

  const assignPlayerToTable = async (gameId: number, playerName: string, playerIndex: number): Promise<void> => {
    // Fetch current game state from Supabase
    const { data: gameData, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) {
      console.error('Error fetching game state:', error);
      return;
    }

    // Check if the player is already assigned to the table
    const playerAlreadyAssigned = gameData.players.some((player: any) => player.index === playerIndex);

    if (!playerAlreadyAssigned) {
      // Add the new player to the players array
      const updatedPlayers = [
        ...gameData.players,
        {
          name: playerName,
          index: playerIndex,
          // Other player properties like balance, ready status, etc. can be added here
          ready: false,
        },
      ];

      // Update game state with the new player data
      const updatedGameState = {
        ...gameData,
        players: updatedPlayers,
      };

      // Save updated game state to Supabase
      const { error: updateError } = await supabase
        .from('games')
        .update(updatedGameState)
        .eq('id', gameId);

      if (updateError) {
        console.error('Error updating game state:', updateError);
      } else {
        // Game state updated successfully
        setGameState(updatedGameState);
      }
    } else {
      console.log('Player is already assigned to the table.');
    }
  };
  const isCurrentPlayerReady = (players: any, currentPlayerIndex: string): boolean => {
    // Find the current player by name
    const currentPlayer = players.find((player: any) => player.index === currentPlayerIndex);
  
    // If the current player is found and ready is true, return true. Otherwise, return false.
    return currentPlayer ? currentPlayer.ready : false;
  }  
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
    const fatchGame = async () => {
      const results = await supabase
        .from('games')
        .select()
        .eq('id', 1)
      if (results?.data && results?.data.at(0)) {
        setGameState(results?.data.at(0))
      }
    }
    if (user?.id) fatchGame()
  }, [user?.id, updated])
  useEffect(() => {
    const subscription = supabase.channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
      },
      (payload) => setUpdated(payload.commit_timestamp)
    )
    .subscribe()
  }, [])
  const checkAllPlayersReady = async (gameId: number, players: any): Promise<boolean> => {
    // Check if all players are ready
    const allPlayersReady = players.every((player: any) => player.ready);
    if (allPlayersReady) {
      // All players are ready, update game status and start the game
      const { error } = await supabase
        .from('games')
        .update({ game_status: 'in_progress' })
        .eq('id', gameId);

      if (error) {
        console.error('Error updating game status:', error);
        return false;
      }
    }

    return allPlayersReady;
  };
  const markCurrentPlayerReady = async (gameId: number, currentPlayerIndex: number): Promise<void> => {
    // Fetch current game state from Supabase
    const { data: gameData, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) {
      console.error('Error fetching game state:', error);
      return;
    }

    // Mark the current player as ready
    const updatedPlayers = gameData.players.map((player: any) => {
      if (player.index === currentPlayerIndex) {
        return { ...player, ready: true };
      }
      return player;
    });

    // Update game state with the new player data
    const updatedGameState = {
      ...gameData,
      players: updatedPlayers,
    };

    // Save updated game state to Supabase
    const { error: updateError } = await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', gameId);

    if (updateError) {
      console.error('Error updating game state:', updateError);
    } else {
      // Game state updated successfully
      setGameState(updatedGameState);
    }
    const allReady = await checkAllPlayersReady(gameId, updatedPlayers);
    setAllReady(allReady);
  };

  const currentPlayerReady = gameState ? isCurrentPlayerReady(gameState?.players, userData.index) : false;
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
        email: userData.email,
        index: userData.index,
        online_at: new Date().toISOString(),
      }

      channel.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') { return }

        const presenceTrackStatus = await channel.track(userStatus)
        if (presenceTrackStatus === 'ok') {
          setInRoom(presenceTrackStatus === 'ok')
        }
        else setInRoom(false)
      })
      channel.on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();

        const users = Object.keys(presenceState)
          .map((presenceId) => {
            const presences = presenceState[presenceId] as unknown as { user: string }[];
            return presences.map((presence) => presence);
          })
          .flat();
        setUsers(users)
        assignPlayerToTable(1, userData.username, userData.index)
      });
      setChannel(channel)
      return () => {
        channel.unsubscribe();
      };
    }
  }, [userData.username, room])

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      roomcode: ''
    },
    onSubmit: (values) => {
      setRoom(values.roomcode)
    }
  })
  console.warn(gameStates.start === gameState?.game_status)
  return (
    <>

      {!inRoom
        ? (
          <div className="h-full w-full flex justify-center items-center">
            <div className={'grid gap-6'} >
              <h6>
                Enter Room Code (existing or new)
              </h6>
              <form onSubmit={handleSubmit}>
                <div className='grid gap-2'>
                  <div className='grid gap-1'>
                    <Input
                      id='roomcode'
                      placeholder='Room Code'
                      type='text'
                      autoCapitalize='none'
                      autoComplete='roomcode'
                      autoCorrect='off'
                      onChange={handleChange}
                      value={values.roomcode}
                    />
                  </div>
                  <Button type="submit" className="mt-4">
                    {'Go to Room'}
                  </Button>
                </div>
              </form>
            </div>
          </div>)
        : (
          <>
            <div className="h-full w-full">
              <div className="h-fit w-full grid gap-2 grid-cols-3">
                {
                  users.filter((user: any) => user.email !== userData.email).map((user: any, key: any) => {
                    return (
                      <PlayerCard name={user.user} email={user.email} key={key} bet={20} />
                    )
                  })
                }
              </div>
              <div>
                {currentPlayerReady ? (
                  gameStates.start === gameState?.game_status ? (
                    <>
                      <Table pot={0} cards={[generateDeck(generateDeckOfCards()).pop(), generateDeck(generateDeckOfCards()).pop(), generateDeck(generateDeckOfCards()).pop(), generateDeck(generateDeckOfCards()).pop(), generateDeck(generateDeckOfCards()).pop()]} />
                      <Player chips={0} bet={0} cards={[generateDeck(generateDeckOfCards()).pop(), generateDeck(generateDeckOfCards()).pop()]} />
                    </>) : <p>Waiting for other players...</p>
                ) : (
                  <button onClick={() => markCurrentPlayerReady(1, userData.index)}>Ready</button>
                )}
              </div>
            </div>
          </>)
      }
    </>
  )
}
