import { supabase } from "@/lib/supabase"
import { Game } from "./store"

export const fatchGame = async (updateGame: any) => {
    const results = await supabase
      .from('games')
      .select('id, players')
    if (results?.data && results?.data.at(0)) {
      updateGame([...results?.data])
    }
}
export const fetchUser = async (user: any, updateUser: any) => {
  const results = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
  if (results?.data && results?.data.at(0)) {
    updateUser(results?.data.at(0))
  }
}
export const createGameRoom = async (updateGame: any, games: Game[] | undefined) => {
  if (!games) games = []
  const { data, error } = await supabase
  .from('games')
  .insert([
    {
      players: [],
      community_cards: [],
      pot: 0,
      winnerplayerindex: 0,
      game_status: 'preflop',
      currentTurnPlayerIndex: 0,
      highbet: 0,
    }
  ])
  .select()
  if (data && !error) {
    updateGame([...games, {id: data?.at(0).id, players: data?.at(0).players}])
  }
}

// pot: 0,
// highbet: 0,
// players: [],
// community_cards: []