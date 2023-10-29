"use client"

import { BadgePercent, CircleDollarSign, CornerRightUp, Hand } from "lucide-react"
import DeckCard from "./deck-card"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { gameStates } from "./roomform"

type PlayerProps = {
  chips: number,
  cards: any,
  dealer: boolean,
  deal: any,
  handEvaluation: string,
  cardsDelt: boolean,
  myturn: boolean,
  passTurn: any,
  index: number,
  highbet: number,
  bet: number,
  gamePhase: string,
  loading: boolean,
  resetGame: any,
  handleFold: any
}
const renderActionButtonText = (highBet: number, betInputValue: number, chips: number) => {
  if ((highBet === 0) && (betInputValue === 0)) {
    return 'Check'
  } else if ((chips === 0 && betInputValue > 0)) {
    return 'All-In'
  } else if ((highBet === betInputValue)) {
    return 'Call'
  } else if ((highBet === 0) && (betInputValue > highBet)) {
    return 'Bet'
  } else if (betInputValue > highBet) {
    return 'Raise'
  } else if (betInputValue < highBet) {
    return 'Raise Your Bet'
  }
}

const chipsButtons = [5, 10, 25, 50, 100]
const minusChipsButtons = [-5, -10, -25, -50, -100]

export default function Player({ chips, cards, dealer, deal, handEvaluation, passTurn, cardsDelt, myturn, index, highbet, bet: playerBet, gamePhase, loading, resetGame, handleFold }: PlayerProps) {
  const [bet, setBet] = useState(playerBet)
  const [myChips, setMyChips] = useState(chips)
  useEffect(() => {
    setBet(playerBet)
    setMyChips(chips)
  }, [chips, highbet, playerBet])
  const handleBet = (myBet: number) => {
    setBet(bet + myBet)
    setMyChips(myChips - myBet)
  }
  return (
    <>
      <div className="w-full flex items-center justify-center mt-4">
        {cards && cards.map((card: any, key: any) => <DeckCard key={key} suit={card.suit} cardFace={card.cardFace} hidden={false} />)}
      </div>
      <div className="mt-4 flex items-center justify-around">
        <div className="flex text-xs items-center justify-center">
          <CornerRightUp />
          <p className="ml-2">Highest Bet : {highbet}</p>
        </div>
        <div className="flex text-xs items-center justify-center">
          <BadgePercent />
          <p className="ml-2">Bet : {bet}</p>
        </div>
        <div className="flex text-xs items-center justify-center">
          <CircleDollarSign />
          <p className="ml-2">Chips : {myChips}</p>
        </div>
      </div>
      {(gamePhase === gameStates.showdown || gamePhase === gameStates.river) && <div className="flex mt-2 text-xs items-center justify-center">
        <Hand />
        <p className="ml-2">{handEvaluation}</p>
      </div>}
      {dealer && (!cardsDelt || gamePhase === gameStates.showdown) ?
        <div className="mt-4 flex items-center justify-center">
          {
            gamePhase === gameStates.showdown ?
              <Button disabled={loading} onClick={() => resetGame()}>
                Reset Game
              </Button>
              : <Button disabled={loading} onClick={() => deal()}>
                Deal
              </Button>
          }
        </div>
        : myturn && gamePhase !== gameStates.showdown
          ? (
            <>
              <div className="mt-4 flex items-center justify-between">
                <Button disabled={loading || bet < highbet} onClick={() => {
                  passTurn(index, renderActionButtonText(highbet, bet, myChips), bet)
                }}>
                  {renderActionButtonText(highbet, bet, myChips)}
                </Button>
                <Button onClick={() => handleFold()} disabled={loading}>
                  Fold
                </Button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                {chipsButtons.map((chipsValue, index) => <Button disabled={myChips < chipsValue || loading} key={index} onClick={() => handleBet(chipsValue)}>{chipsValue}</Button>)}
              </div>
              <div className="mt-4 flex items-center justify-between">
                {minusChipsButtons.map((chipsValue, index) => <Button disabled={bet + chipsValue * 2 < chipsValue || loading} key={index} onClick={() => handleBet(chipsValue)}>{chipsValue}</Button>)}
              </div>
            </>)
          : (
            <div className="mt-4 flex flex-col items-center justify-center">
              <p>waitin other players to play</p>
            </div>
          )}

    </>
  )
}
