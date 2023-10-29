"use client"

import { ArrowUp, BadgePercent, CircleDollarSign, CornerRightUp, Hand, X } from "lucide-react"
import DeckCard from "./deck-card"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { gameStates } from "./roomform"
import { Slider } from "./ui/slider"

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
  handleFold: any,
  name: string
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

export default function Player({ chips, cards, dealer, deal, handEvaluation, passTurn, cardsDelt, myturn, index, highbet, bet: playerBet, gamePhase, loading, resetGame, handleFold, name }: PlayerProps) {
  const [bet, setBet] = useState(playerBet)
  const [myChips, setMyChips] = useState(chips)
  const [bets, setBets] = useState(1)
  useEffect(() => {
    setBet(playerBet)
    setMyChips(chips)
  }, [chips, highbet, playerBet])
  const handleBet = (myBet: number) => {
    setBet(bet + myBet)
    setMyChips(myChips - myBet)
  }
  const card = [
    ...cards
  ]
  const [Raise, setRaise] = useState(false)
  return (
    <div>
      <p className="text-xs">{bets}</p>
      {Raise && <div className="flex items-center justify-between h-9">
        
        <p className="text-xs flex items-center justify-center"> <ArrowUp className="w-3 h-3 mr-px" /> {bets}</p>
        <Slider onValueChange={(v) => setBets(v[0])} value={[bets]} max={chips} min={highbet} step={1} className="w-60" />
        <Button className="bg-white w-7 h-7 text-black p-2 rounded-full">
          <ArrowUp />
        </Button>
      </div>}
      <div className="flex items-center justify-between mt-2">
        {!Raise && <> <Button className="w-32 bg-[#36353d] text-white rounded-xl hover:bg-[#36353d]" onClick={() => {
          dealer && (!cardsDelt || gamePhase === gameStates.showdown) ?
            gamePhase === gameStates.showdown ? resetGame() : deal()
            : myturn && gamePhase !== gameStates.showdown ? passTurn(index, renderActionButtonText(highbet, bet, myChips), bet)
              : null
        }}> <p>{dealer && (!cardsDelt || gamePhase === gameStates.showdown)
          ? gamePhase === gameStates.showdown
            ? "Pass To Next Hand"
            : "Deal"
          : myturn && gamePhase !== gameStates.showdown ? renderActionButtonText(highbet, bet, myChips) : "not"}</p>
        </Button>
          <Button className="w-32 bg-[#232228] hover:bg-[#36353d] text-white rounded-xl" disabled={!highbet} onClick={() => handleBet(highbet)}>
            Raise {highbet || ''}
          </Button></>}
        {Raise && <> <Button className="w-20 bg-[#232228] hover:bg-[#36353d] text-white rounded-xl" onClick={() => handleBet(1)}>
          1 BB
        </Button>
          <Button className="w-20 bg-[#232228] hover:bg-[#36353d] text-white rounded-xl">
            1/2 Pot
          </Button>
          <Button className="w-20 bg-[#232228] hover:bg-[#36353d] text-white rounded-xl">
            Pot
          </Button></>}
        <Button className="bg-[#232228] hover:bg-[#36353d] w-10 text-white p-3 rounded-xl" onClick={() =>{
           setRaise(!Raise)
           handleBet(bets)
           }}>
          {Raise ? <X /> : <ArrowUp />}
        </Button>
      </div>
      <div className="h-36">
        <div className="flex flex-col items-end justify-around mt-4 relative w-[350px] h-36">
          {cards.length ? <div className={`absolute z-0 w-[75px] left-[10px] scale-125`}> <DeckCard index={0} suit={card[0].suit} cardFace={card[0].cardFace} hidden={card[0].hidden} /> </div> : null}
          {cards.length ? <div className={`absolute z-10 w-[75px] left-[70px] scale-125`}> <DeckCard index={1} suit={card[1].suit} cardFace={card[1].cardFace} hidden={card[1].hidden} /> </div> : null}
          <div className="bg-[#232228] rounded-xl flex flex-col h-32 w-32 items-center justify-between p-3">
            <p className="text-xs text-center w-full text-gray-500">
              {handEvaluation}
            </p>
            <img src={`https://api.dicebear.com/7.x/big-ears/svg?seed=${name}`} className='h-10 w-10' />
            <p className="text-lg text-center w-full ">
              {chips}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
