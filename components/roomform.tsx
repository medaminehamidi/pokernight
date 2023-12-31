"use client"
import { useSupabase } from "@/components/SupabaseSessionProvider"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Button, buttonVariants } from "./ui/button"
import { RealtimeChannel } from "@supabase/supabase-js"
import PlayerCard from "./player-card"
import Table from "./table"
import Player from "./player"
import { convertCardsToString, generateDeck, generateDeckOfCards, getCurrentUserData, getRandomPlayerIndex, isCurrentPlayerReady, isEqual, revealObjects } from "@/helpers/helpers"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Dices, Skull } from "lucide-react"
const Hand = require('pokersolver').Hand


export const gameStates = {
  preflop: 'preflop',
  flop: 'flop',
  turn: 'turn',
  river: 'river',
  showdown: 'showdown'
}
export default function RoomForm({ id }: any) {
  const { user } = useSupabase()
  const [userData, setUserData] = useState<any>({})
  const [gameState, setGameState] = useState<any>(null)

  const [users, setUsers] = useState<any>([])
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [allReady, setAllReady] = useState(false)
  const [passPhase, setPassPhase] = useState(false)
  const [loading, setLoading] = useState(false)




  const handleDeal = async () => {
    setLoading(true)
    const deck = generateDeck(generateDeckOfCards());
    const players = gameState.players.map((player: any) => ({
      ...player,
      folded: player.chips === 0,
      allIn: false,
      totalBets: 0,
      hand: player.chips === 0 ? [] : [deck.pop(), deck.pop()] // Deal two cards to each player
    }));

    const communityCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()]; // Deal five community cards
    const newComunityCards = communityCards.map((card: any) => { return { ...card, hidden: true } })
    const updatedGameState = {
      ...gameState,
      game_status: gameStates.preflop,
      winnerplayerindex: 0,
      players,
      community_cards: newComunityCards
    };

    // Update game state in Supabase
    await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', id);

    setGameState(updatedGameState);
    setLoading(false)
  }
  const passDealerToNextPlayer = async (gameData: any): Promise<any> => {
    const activePlayers = gameData.players.filter((player: any) => !player.folded);
    // Find the current dealer
    const currentDealerIndex = gameData.players.findIndex((player: any) => player.isdealer);

    // Remove dealer status from the current dealer
    gameData.players[currentDealerIndex].isdealer = false;

    // Determine the index of the next player
    const nextDealerIndex = (currentDealerIndex + 1) % activePlayers.length;

    // Set dealer status to true for the next player
    activePlayers[nextDealerIndex].isdealer = true;
    gameData.currentTurnPlayerIndex = activePlayers[nextDealerIndex].index
    // Update game state with the new dealer information
    const updatedGameState = {
      ...gameData,
      currentTurnPlayerIndex: gameData.currentTurnPlayerIndex,
      players: gameData.players,
    };

    return updatedGameState;
  };
  const markRandomPlayerAsDealer = async (): Promise<void> => {
    setLoading(true)
    // Fetch current game state from Supabase

    // Randomly select a player as the dealer
    const randomPlayerIndex = getRandomPlayerIndex(gameState.players);
    const updatedPlayers = gameState.players.map((player: any) => {
      return {
        ...player,
        isdealer: player.index === randomPlayerIndex,
      };
    });
    // Update game state with the new dealer information
    const updatedGameState = {
      ...gameState,
      game_status: gameStates.preflop,
      currentTurnPlayerIndex: randomPlayerIndex,
      players: updatedPlayers,
    };

    // Save updated game state to Supabase
    const { error: updateError } = await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating game state:', updateError);
    } else {
      // Game state updated successfully
      setGameState(updatedGameState);
    }
    setLoading(false)
  };


  const assignPlayerToTable = async (gameId: number, playerData: any): Promise<void> => {
    setLoading(true)
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
    let playerAlreadyAssigned
    // Check if the player is already assigned to the table
    if (gameData !== null && gameData.players.length > 0) {
      playerAlreadyAssigned = gameData.players.some((player: any) => player.index === playerData.index);
    }

    if (!playerAlreadyAssigned) {
      // Add the new player to the players array
      const updatedPlayers = [
        ...gameData.players,
        {
          name: playerData.username,
          index: playerData.index,
          isdealer: playerData.isdealer,
          hand: [],
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
    }
    setLoading(false)
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      const results = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
      if (results?.data && results?.data.at(0)) {
        setUserData(results?.data.at(0))
      }
      setLoading(false)
    }
    if (user?.id) fetchUser()
  }, [user?.id])

  useEffect(() => {
    const fatchGame = async () => {
      setLoading(true)
      const results = await supabase
        .from('games')
        .select()
        .eq('id', id)
      if (results?.data && results?.data.at(0)) {
        setGameState(results?.data.at(0))
      }
      setLoading(false)
    }
    if (user?.id) fatchGame()

  }, [user?.id])
  useEffect(() => {
    const subscription = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          table: 'games',
          schema: 'public',
        },
        (payload) => {
          setGameState(payload.new)
          const allPlayersReady = payload.new.players.every((player: any) => player.ready)
          { (payload.new.game_status !== gameStates.showdown) && setPassPhase(checkAllPlayersActed(payload.new)) }
          setAllReady(allPlayersReady)
        }
      )
      .subscribe()
  }, [])

  useEffect(() => {

    const passGamePhase = async () => {
      setLoading(true)
      if (gameState !== null) {
        const currentDealerIndex = gameState.players.findIndex((player: any) => player.isdealer);
        let updatedPlayers = gameState.players
        const currentPhase = gameState.game_status
        const communityCards = gameState.community_cards
        if (currentPhase === 'preflop' && passPhase) {
          // End preflop phase after dealing hole cards to players
          gameState.community_cards = revealObjects(communityCards, 3)
          gameState.game_status = gameStates.flop;
          if (currentDealerIndex) { gameState.currentTurnPlayerIndex = gameState.players[currentDealerIndex]?.index }
          updatedPlayers = gameState.players.map((player: any) => {
            const totalBetsInHand = player.totalBets + player.bet
            return { ...player, action: 'unset', bet: 0, totalBets: totalBetsInHand };

          })
          gameState.highbet = 0
        } else if (currentPhase === 'flop' && passPhase) {
          // End flop phase after dealing the first three community cards (flop)
          gameState.community_cards = revealObjects(communityCards, 4)
          gameState.game_status = gameStates.turn;
          if (currentDealerIndex) { gameState.currentTurnPlayerIndex = gameState.players[currentDealerIndex]?.index }
          updatedPlayers = gameState.players.map((player: any) => {
            const totalBetsInHand = player.totalBets + player.bet
            return { ...player, action: 'unset', bet: 0, totalBets: totalBetsInHand };

          })
          gameState.highbet = 0
        } else if (currentPhase === 'turn' && passPhase) {
          // End turn phase after dealing the fourth community card (turn)
          gameState.community_cards = revealObjects(communityCards, 5)
          gameState.game_status = gameStates.river;
          if (currentDealerIndex) { gameState.currentTurnPlayerIndex = gameState.players[currentDealerIndex]?.index }
          updatedPlayers = gameState.players.map((player: any) => {
            const totalBetsInHand = player.totalBets + player.bet
            return { ...player, action: 'unset', bet: 0, totalBets: totalBetsInHand };

          })
          gameState.highbet = 0
        } else if (currentPhase === 'river' && passPhase) {
          // End river phase after dealing the fifth community card (river)
          gameState.community_cards = revealObjects(communityCards, 5)
          gameState.game_status = gameStates.showdown;
          if (currentDealerIndex) { gameState.currentTurnPlayerIndex = gameState.players[currentDealerIndex]?.index }
          determineWinnerAndUpdateBalance()
          updatedPlayers = gameState.players.map((player: any) => {
            const totalBetsInHand = player.totalBets + player.bet
            return { ...player, action: 'unset', bet: 0, totalBets: totalBetsInHand };

          })
          gameState.highbet = 0
        }
        // else if (currentPhase === 'showdown' && passPhase) {

        //   updatedPlayers = gameState.players.map((player: any) => {
        //     return { ...player, action: 'unset', bet: 0 };

        //   })
        //   console.warn('its showdonw')
        //   gameState.game_status = gameStates.preflop;
        // }
        // Update game state with the updated player, pot, and turn information
        const updatedGameState = {
          ...gameState,
          players: updatedPlayers,
        };

        // Save updated game state to Supabase
        const { error: updateError } = await supabase
          .from('games')
          .update(updatedGameState)
          .eq('id', id);

        if (updateError) {
          console.error('Error updating game state:', updateError);
          return false;
        }

        // Game state updated successfully
        setGameState(updatedGameState);
      }
      setLoading(false)
    }
    passGamePhase()
  }, [passPhase])


  const checkAllPlayersReady = async (gameId: number, players: any): Promise<boolean> => {
    setLoading(true)
    // Check if all players are ready
    const allPlayersReady = players.every((player: any) => player.ready);
    if (allPlayersReady) {
      // All players are ready, update game status and start the game
      const { error } = await supabase
        .from('games')
        .update({ game_status: gameStates.preflop })
        .eq('id', gameId);

      if (error) {
        console.error('Error updating game status:', error);
        setLoading(false)
        return false;
      }
    }

    setLoading(false)
    return allPlayersReady;
  };

  const markCurrentPlayerReady = async (gameId: number, currentPlayerIndex: number): Promise<void> => {
    setLoading(true)
    // Check if all players are r
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
        return { ...player, ready: true, chips: 200, bet: 0, totalBets: 0, action: 'unset' };
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
    setLoading(false)
    setAllReady(allReady);
  };

  const markCurrentPlayerNotReady = async (gameId: number, currentPlayerIndex: number): Promise<void> => {
    setLoading(true)
    // Check if all players are r
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
        return { ...player, ready: false };
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
    setLoading(false)
    setAllReady(allReady);
  };

  const currentPlayerReady = gameState ? isCurrentPlayerReady(gameState?.players || [], userData.index) : false;

  useEffect(() => {
    if (userData.username) {
      const channel = supabase.channel(`room:${id}`, {
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
        isdealer: userData.isdealer,
        online_at: new Date().toISOString(),
      }

      channel.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') { return }

        const presenceTrackStatus = await channel.track(userStatus)
        if (presenceTrackStatus === 'ok') {
          const { data: gameData, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching game state:', error);
            return;
          }
          const allReady = await checkAllPlayersReady(id, gameData.players);
          setAllReady(allReady);
        }
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
        assignPlayerToTable(id, userData)
      });
      setChannel(channel)
      return () => {
        channel.unsubscribe();
      };
    }

  }, [userData.username])
  // useEffect(() => {
  //   const checkReady = async () => {
  //     if (gameState !== null) {
  //       const allReady = await checkAllPlayersReady(1, gameState.players);
  //       setAllReady(allReady);
  //     }
  //   }
  //   markCurrentPlayerNotReady(1, userData.index)
  //   console.warn('marched')
  //   checkReady()
  // }, [])
  useEffect(() => {
    if (allReady && currentPlayerReady) {
      markRandomPlayerAsDealer()
    }
  }, [allReady])



  const playerPassTurn = async (
    currentPlayerIndex: any,
    action: string,
    betAmount?: number
  ) => {


    // Check if all players are r

    if (gameState.currentTurnPlayerIndex !== currentPlayerIndex) {
      console.log('Not the current player\'s turn.');
      return false;
    }

    // Find the current player
    const currentPlayer = gameState.players.find((player: any) => player.index === currentPlayerIndex);

    const currentPhase = gameState.game_status
    if (currentPlayer) {
      setLoading(true)
      const communityCards = gameState.community_cards
      switch (action) {
        case 'Bet':
          if (betAmount && betAmount > 0 && betAmount <= currentPlayer.chips) {
            currentPlayer.chips -= betAmount;
            currentPlayer.bet = betAmount;
            currentPlayer.action = 'Bet';
            gameState.pot += betAmount;
            gameState.highbet = betAmount;
          }
          break;
        case 'Raise':
          if (betAmount && betAmount > gameState.highbet && betAmount <= currentPlayer.chips) {
            currentPlayer.chips -= betAmount;
            currentPlayer.bet = betAmount;
            currentPlayer.action = 'Raise';
            gameState.pot += betAmount;
            gameState.highbet = betAmount;
          }
          break;
        case 'Call':
          const callAmount = gameState.highbet - (currentPlayer.bet || 0);
          currentPlayer.chips -= callAmount;
          currentPlayer.bet += callAmount;
          currentPlayer.action = 'Call';
          gameState.pot += callAmount;
          break;
        case 'Check':
          currentPlayer.bet = 0;
          gameState.highbet = 0;
          currentPlayer.action = 'Check';
          break;
        case 'Fold':
          currentPlayer.action = 'Fold';
          break;
        case 'All-In':
          if (betAmount) {
            currentPlayer.action = 'All-In';
            currentPlayer.allIn = true
            currentPlayer.chips -= betAmount;
            currentPlayer.bet = betAmount;
            gameState.pot += betAmount;
            gameState.highbet = betAmount;
          }
          break;
        default:
          // Invalid action, do nothing
          break;
      }

      let updatedPlayers = gameState.players

      // if (!passPhase) {
      //   // For example, if action is 'bet':
      //   if (action === 'Check' || action === 'Call') {
      //     updatedPlayers = gameData.players.map((player: any) => {
      //       if (player.index === currentPlayerIndex) {
      //         return { ...currentPlayer, action: action };
      //       }
      //       return player;
      //     })
      //   }
      // }

      // Pass the turn to the next player
      let nextPlayerIndex = (gameState.players.findIndex((player: any) => player.index === currentPlayerIndex) + 1) % gameState.players.length;
      while (gameState.players[nextPlayerIndex].folded || gameState.players[nextPlayerIndex].allIn) {
        nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
      }
      gameState.currentTurnPlayerIndex = gameState.players[nextPlayerIndex].index;

      // Update game state with the updated player, pot, and turn information
      const updatedGameState = {
        ...gameState,
        players: updatedPlayers,
      };

      // Save updated game state to Supabase
      const { error: updateError } = await supabase
        .from('games')
        .update(updatedGameState)
        .eq('id', 1);

      if (updateError) {
        console.error('Error updating game state:', updateError);
        return false;
      }

      // Game state updated successfully
      setGameState(updatedGameState);
      setLoading(false)
      return true;
    }

    return false;
  }
  const checkAllPlayersActed = (gameData: any): boolean => {
    const activePlayers = gameData.players.filter((player: any) => (!player.folded && !player.allIn))

    if (activePlayers.length === 0) {
      return true;
    }

    const firstPlayer = activePlayers[0];
    // Check if all active players have the same bet amount as the first active player
    const allPlayersDoneBetting = activePlayers.every((player: any) => player.bet === firstPlayer.bet && player.action !== 'unset');
    return allPlayersDoneBetting;
  }
  const evaluateCards = (gameState: any, userData: any) => {
    if (gameState !== null && userData !== null && gameState.players[0].hand.length > 0) {
      return Hand.solve(convertCardsToString([...getCurrentUserData(gameState, userData.index)?.hand, ...gameState?.community_cards])).name
    } else return ''
  }
  // console.warn(winner, hand1, hand2)

  const determineWinnerAndUpdateBalance = async () => {
    setLoading(true)
    // Check if all players are r
    // Fetch current game state from Supabase

    // Filter active players (players who have not folded)
    const activePlayers = gameState.players.filter((player: any) => !player.folded);

    // Determine the best hand among active players
    let winningPlayer: any
    let bestHandRank = Hand.solve(convertCardsToString([...activePlayers[0].hand, ...gameState.community_cards]));

    for (const player of activePlayers) {
      const allCards = Hand.solve(convertCardsToString([...player.hand, ...gameState.community_cards]));

      // Compare hand ranks to find the best hand
      if (isEqual(Hand.winners([bestHandRank, allCards])[0], allCards)) {
        bestHandRank = allCards
        winningPlayer = player;
      }
    }

    // Calculate the total pot size
    const totalPot = gameState.pot;
    if (winningPlayer.allIn) {
      let sidePot = 0;

      for (const player of activePlayers) {
        if (player.allIn) {
          sidePot += player.totalBets;
        }
      }

      // Deduct the side pot from total bets to determine the main pot
      const mainPot = totalPot - sidePot;

      // Distribute side pot among all-in players
      for (const player of activePlayers) {
        if (player.allIn) {
          player.chips += player.totalBets;
        } else {
          // Player bet more than the side pot, they win the additional chips from all-in players
          player.chips += Math.min(winningPlayer.totalBets, player.totalBets);
        }
      }

      // Distribute main pot among players who are not all in
      const playersNotAllIn = activePlayers.filter((player: any) => !player.allIn);

      for (const player of playersNotAllIn) {
        // Distribute chips from the main pot equally among players who are not all in
        player.chips += mainPot / playersNotAllIn.length;
      }

      // Give the remaining chips (if any) from main pot to the winning player
      winningPlayer.chips += mainPot % playersNotAllIn.length;
    } else {
      winningPlayer.chips += totalPot
    }
    // Update game state with the updated player balances and reset the pot
    const updatedGameState = {
      ...gameState,
      winnerplayerindex: winningPlayer?.index,
      players: gameState.players.map((player: any) => (player.index === winningPlayer?.index ? winningPlayer : player)),
      pot: 0, // Reset the pot after the winner takes the money
    };

    // Save updated game state to Supabase
    const { error: updateError } = await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating game state:', updateError);
    }
    setLoading(false)
  };

  const resetGameStatusToPreflop = async () => {
    // Fetch current game state from Supabase
    const { data: gameData, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching game state:', error);
      return;
    }

    // Update game status to 'preflop'
    gameData.game_status = gameStates.preflop;

    gameData.players.forEach((player: any) => {
      player.folded = player.chips === 0;
      player.hand = [];
      player.bet = 0
      player.action = 'unset'
    });
    // Update game state with the new game status
    const maregamedata = await passDealerToNextPlayer(gameData)
    const updatedGameState = {
      ...gameData,
      ...maregamedata
    };

    // Save updated game state to Supabase
    const { error: updateError } = await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating game state:', updateError);
    } else {
      // Game state updated successfully
      setGameState(updatedGameState);
    }
  }
  const handleFold = async (): Promise<void> => {
    // Fetch current game state from Supabase

    // Find the current player

    const currentPlayer = gameState.players.find((player: any) => player.index === userData.index);
    // Mark the current player as folded
    currentPlayer.folded = true;
    let updatedPlayers = gameState.players
    // Update game state with the folded player
    const updatedGameState = {
      ...gameState,
      players: updatedPlayers
    };

    // Save updated game state to Supabase
    const { error: updateError } = await supabase
      .from('games')
      .update(updatedGameState)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating game state:', updateError);
    } else {

      // Check if only one active player is left after the fold
      const activePlayers = updatedGameState.players.filter((player: any) => !player.folded);
      if (activePlayers.length === 1) {
        // One player left, they win the pot
        const winner = activePlayers[0];
        winner.chips += updatedGameState.pot;
        updatedGameState.game_status = gameStates.showdown
        updatedGameState.winnerplayerindex = winner.index
        // Reset pot and update game state
        updatedGameState.pot = 0;
        const { error: winnerUpdateError } = await supabase
          .from('games')
          .update(updatedGameState)
          .eq('id', id);

        if (winnerUpdateError) {
          console.error('Error updating game state for winner:', winnerUpdateError);
        }
      } else {
        playerPassTurn(userData.index, 'Fold')
        // More than one active player left, proceed to the next player's turn
        // Implement your logic to pass the turn to the next player here
      }
    }
  }
  return (
    <>
      {user && gameState && gameState.players.length >= 2 ? <div className="h-[85vh] flex flex-col justify-between items-center  w-full">
        <div className="h-fit w-full grid gap-2 grid-cols-5">
          {
            gameState !== null && gameState.players.filter((user: any) => user.index !== userData.index).map((user: any, key: any) => {
              return (
                <PlayerCard folded={user.folded} isWinner={gameState && gameState.winnerplayerindex === user.index} chips={user.chips} hiddenCards={gameState.game_status !== gameStates.showdown} isPlayerTurn={gameState.currentTurnPlayerIndex === user.index} cards={user.hand} name={user.name} email={user.email} dealer={user.isdealer} key={key} bet={user.bet} />
              )
            })
          }
        </div>
        <>
          {currentPlayerReady
            ? (
              allReady
                ? (
                  <>
                    <Table
                      pot={gameState.pot}
                      cards={gameState.community_cards}
                      isdealer={getCurrentUserData(gameState, userData.index).isdealer}
                      isTurn={gameState && gameState.currentTurnPlayerIndex === userData.index}
                      isWinner={gameState && gameState.winnerplayerindex === userData.index}
                      winnerData={getCurrentUserData(gameState, gameState.winnerplayerindex)}
                      winnerHandEvaluation={evaluateCards(gameState, getCurrentUserData(gameState, gameState.winnerplayerindex))}
                    />
                    <div>
                      <Player
                        resetGame={resetGameStatusToPreflop}
                        handleFold={handleFold}
                        loading={loading}
                        gamePhase={gameState.game_status}
                        cardsDelt={gameState !== null && userData !== null && gameState.players[0]?.hand?.length > 0}
                        myturn={gameState && gameState.currentTurnPlayerIndex === userData.index}
                        deal={handleDeal}
                        dealer={getCurrentUserData(gameState, userData.index).isdealer}
                        chips={getCurrentUserData(gameState, userData.index).chips}
                        name={userData.username}
                        index={userData.index}
                        cards={getCurrentUserData(gameState, userData.index).hand}
                        passTurn={playerPassTurn}
                        handEvaluation={evaluateCards(gameState, userData)}
                        bet={getCurrentUserData(gameState, userData.index).bet}
                        highbet={gameState.highbet}
                      />
                      {userData.index === 1 && <p>{gameState.game_status}</p>}
                    </div>
                  </>
                )
                : (
                  <div className="h-[60vh] w-full flex justify-center items-center">
                    <div className={'grid gap-6'} >
                      <h6>
                        Waiting for other players...
                      </h6>
                    </div>
                  </div>)
            )
            : (
              <div className="h-[60vh] w-full flex justify-center items-center">
                <div className={'grid gap-6'} >
                  <h6>
                    Get Ready
                  </h6>
                  <Button onClick={() => markCurrentPlayerReady(id, userData.index)} type="submit" className="mt-4">
                    Ready ?
                  </Button>
                </div>
              </div>
            )}
        </>
      </div>
        :
        <div className="h-full w-full flex flex-col items-center justify-center ">
          <Skull className="w-20 h-20 mb-5" />
          <p className="text-3xl leading-10 text-center">You need two or more players to start the game ...</p>
        </div>
      }
    </>
  )
}
