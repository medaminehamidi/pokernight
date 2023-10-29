import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type User = {
  id: string,
  index: number | undefined,
  username: string,
  email: string
}

export type UserState = {
  user: User
}
export type UserAction = {
  updateUser: (user: UserState['user']) => void
}

export const useUserStore = create(
  persist<UserState & UserAction>(
    (set) => ({
      user: {
        id: '',
        index: undefined,
        username: '',
        email: ''
      },
      updateUser: (user) => set(() => ({ user: user }))
    }),
    {
      name: 'user', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export type Player = {
  bet: number;
  hand: any[]; // You might want to replace `any[]` with a specific type if you have a specific structure for cards.
  name: string;
  index: number;
  ready: boolean;
  action: string;
  isdealer: boolean;
  totalBets: number | null;
};

export type CurrentGame = {
  id: number;
  players: Player[];
  community_cards: any[]; // You might want to replace `any[]` with a specific type if you have a specific structure for cards.
  pot: number;
  winnerplayerindex: number;
  game_status: string;
  created_at: Date | null;
  updated_at: Date | null;
  currentTurnPlayerIndex: number;
  highbet: number;
};
export type Game = {
  id: number;
  players: Player[];
};
export type GameState = {
  game: Game[] | undefined;
}
export type GameAction = {
  updateGame: (game: GameState['game']) => void
}

export const useGameStore = create(
  persist<GameState & GameAction>(
    (set) => ({
      game: [],
      updateGame: (game) => set(() => ({ game: game }))
    }),
    {
      name: 'game', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

