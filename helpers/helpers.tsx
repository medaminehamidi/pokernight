import { Club, Diamond, Heart, Spade } from "lucide-react";

export const renderUnicodeSuitSymbol = (suit: any) => {
  switch (suit) {
    case ('Heart'): return '\u2665';
    case ('Diamond'): return '\u2666';
    case ('Spade'): return '\u2660';
    case ('Club'): return '\u2663';
    default: throw Error('Unfamiliar String Recieved in Suit Unicode Generation');
  }
}
export const renderCardSymbol = (suit: any) => {
  switch (suit) {
    case ('Heart'): return Heart;
    case ('Diamond'): return Diamond;
    case ('Spade'): return Spade;
    case ('Club'): return Club;
    default: return Club;
  }
}

export const totalNumCards = 52;
export const suits = ['Heart', 'Spade', 'Club', 'Diamond'];
export const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const VALUE_MAP: any = {
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
export const randomizePosition = (min: any, max: any) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateDeckOfCards = () => {
  const deck = [];

  for (let suit of suits) {
    for (let card of cards) {
      deck.push({
        cardFace: card,
        suit: suit
      })
    }
  }
  return deck
}

export const generateDeck = (deck: any) => {
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

export const isCurrentPlayerReady = (players: any, currentPlayerIndex: string): boolean => {
  // Find the current player by name
  const currentPlayer = players.find((player: any) => player.index === currentPlayerIndex);

  // If the current player is found and ready is true, return true. Otherwise, return false.
  return currentPlayer ? currentPlayer.ready : false;
}

export const getRandomPlayerIndex = (players: any): string | null => {
  if (players.length === 0) {
    return null
  }
  const randomIndex: number = Math.floor(Math.random() * players.length);
  return players[randomIndex].index;
}

export const getCurrentUserData = (gameState: any, playerIndex: any) => {
  if (gameState) {
    const currentPlayer = gameState.players.find((player: any) => player.index === playerIndex);
    return currentPlayer || null;
  }
}

export const convertCardObjectToString = (card: any) => {
  const cardValue = card.cardFace === '10' ? 'T' : card.cardFace.toString();
  const suitAbbreviation = card.suit.charAt(0).toLowerCase();
  return cardValue + suitAbbreviation;
}


export const convertCardsToString = (cards: any) => {
  const newCards = cards.map((c: any) => c = convertCardObjectToString(c))
  return newCards
}

export const revealObjects = (arr: any, revealCount: number) => {
  if (revealCount <= 0 || revealCount > 5) {
      console.log("Invalid reveal count. Please provide a number from 1 to 5.");
      return arr;
  }

  const revealedObjects = arr.slice(0, revealCount).map((obj: any) => {
      return { ...obj, hidden: false };
  });

  const remainingObjects = arr.slice(revealCount);

  return [...revealedObjects, ...remainingObjects];
}

export const  isEqual = (obj1: any, obj2: any) => {
  var props1 = Object.getOwnPropertyNames(obj1);
  var props2 = Object.getOwnPropertyNames(obj2);    if (props1.length != props2.length) {
      return false;
  }    for (var i = 0; i < props1.length; i++) {
      let val1 = obj1[props1[i]];
      let val2 = obj2[props1[i]];
      let isObjects = isObject(val1) && isObject(val2);       
       if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
          return false;
      }
  }
  return true;
}
export const isObject = (object: any) => {
return object != null && typeof object === 'object';
}

// const updateGamePhase = ()  => {
//   const communityCards = gameData.community_cards
//   if (currentPhase === 'preflop' && passPhase) {
//     // End preflop phase after dealing hole cards to players
//     gameData.community_cards = revealObjects(communityCards, 3)
//     gameData.game_status = gameStates.flop;
//     updatedPlayers = gameData.players.map((player: any) => {
//       return { ...player, action: 'unset' };

//     })
//     gameData.highbet = 0
//     currentPlayer.bet = 0
//   } else if (currentPhase === 'flop' && passPhase) {
//     // End flop phase after dealing the first three community cards (flop)
//     gameData.community_cards = revealObjects(communityCards, 4)
//     gameData.game_status = gameStates.turn;
//     updatedPlayers = gameData.players.map((player: any) => {
//       return { ...player, action: 'unset' };

//     })
//     gameData.highbet = 0
//     currentPlayer.bet = 0
//   } else if (currentPhase === 'turn' && passPhase) {
//     // End turn phase after dealing the fourth community card (turn)
//     gameData.community_cards = revealObjects(communityCards, 5)
//     gameData.game_status = gameStates.river;
//     updatedPlayers = gameData.players.map((player: any) => {
//       return { ...player, action: 'unset' };

//     })
//     gameData.highbet = 0
//     currentPlayer.bet = 0
//   } else if (currentPhase === 'river' && passPhase) {
//     // End river phase after dealing the fifth community card (river)
//     gameData.highbet = 0
//     currentPlayer.bet = 0
//     gameData.game_status = gameStates.showdown;
//   }
// }

// const playerPassTurn = async (
//   currentPlayerIndex: any,
//   action: string,
//   betAmount?: number
// ) => {
//   // Fetch current game state from Supabase
//   const { data: gameData, error } = await supabase
//     .from('games')
//     .select('*')
//     .eq('id', 1)
//     .single();

//   if (error) {
//     console.error('Error fetching game state:', error);
//     return false;
//   }

//   // Check if it's the current player's turn
//   if (gameData.currentTurnPlayerIndex !== currentPlayerIndex) {
//     console.log('Not the current player\'s turn.');
//     return false;
//   }

//   // Find the current player
//   const currentPlayer = gameData.players.find((player: any) => player.index === currentPlayerIndex);
//   const currentPhase = gameData.game_status
//   if (currentPlayer) {
//     // Perform action (e.g., bet, fold, etc.)
//     // Update currentPlayer's balance, game pot, etc. based on the action
//     const passPhase = checkAllPlayersActed(gameData)
//     // if (passPhase) {
//     //   gameData.game_status = gameStates.end
//     // }
//     console.warn(passPhase + ' is not the current player')
//     const communityCards = gameData.community_cards
//     switch (action) {
//       case 'Bet':
//         if (betAmount && betAmount > 0 && betAmount <= currentPlayer.chips) {
//           currentPlayer.chips -= betAmount;
//           currentPlayer.bet = betAmount;
//           currentPlayer.action = 'Bet';
//           gameData.pot += betAmount;
//           gameData.highbet = betAmount;
//         }
//         break;
//       case 'Raise':
//         if (betAmount && betAmount > gameData.highbet && betAmount <= currentPlayer.chips) {
//           currentPlayer.chips -= betAmount;
//           currentPlayer.bet = betAmount;
//           currentPlayer.action = 'Raise';
//           gameData.pot += betAmount;
//           gameData.highbet = betAmount;
//         }
//         break;
//       case 'Call':
//         const callAmount = gameData.highbet - (currentPlayer.bet || 0);
//         console.warn(callAmount)
//         currentPlayer.chips -= callAmount;
//         currentPlayer.bet += callAmount;
//         currentPlayer.action = 'Call';
//         gameData.pot += callAmount;
//         break;
//       case 'Check':
//         currentPlayer.bet = 0;
//         gameData.highbet = 0;
//         currentPlayer.action = 'Check';
//         break;
//       case 'fold':
//         currentPlayer.action = 'fold';
//         break;
//       default:
//         // Invalid action, do nothing
//         break;
//     }



//     let updatedPlayers = gameData.players
   

//     // Pass the turn to the next player
//     const nextPlayerIndex = (gameData.players.findIndex((player: any) => player.index === currentPlayerIndex) + 1) % gameData.players.length;
//     gameData.currentTurnPlayerIndex = gameData.players[nextPlayerIndex].index;

//     // Update game state with the updated player, pot, and turn information
//     const updatedGameState = {
//       ...gameData,
//       players: updatedPlayers,
//     };

//     // Save updated game state to Supabase
//     const { error: updateError } = await supabase
//       .from('games')
//       .update(updatedGameState)
//       .eq('id', 1);

//     if (updateError) {
//       console.error('Error updating game state:', updateError);
//       return false;
//     }

//     // Game state updated successfully
//     setGameState(updatedGameState);
//     return true;
//   }

//   return false;
// }

//     // if (action === 'Bet' && betAmount && betAmount > 0 && currentPlayer.chips >= betAmount) {
//     //   currentPlayer.chips -= betAmount;
//     //   gameData.pot += betAmount;
//     //   if (betAmount > gameData.highbet) {
//     //     gameData.highbet = betAmount;
//     //   }
//     // } else if (action === 'Call' && betAmount && betAmount === gameData.highbet) {
//     //   // if (callAmount > currentPlayer.chips) {
//     //   //   // If the player doesn't have enough chips to call, they go all-in
//     //   //   currentPlayer.allIn = true;
//     //   //   currentPlayer.chips = 0;
//     //   // } else {
//     //   currentPlayer.chips -= betAmount;
//     //   gameData.pot += betAmount;
//     //   // }
//     // } else if (action === 'Raise' && betAmount && betAmount > gameData.highbet && currentPlayer.chips >= betAmount) {
//     //   currentPlayer.chips -= betAmount;
//     //   gameData.pot += betAmount;
//     //   gameData.highbet = betAmount;
//     // }
//     // // else if (action === 'fold') {
//     // //   currentPlayer.folded = true;
//     // // }