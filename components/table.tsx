"use client"

import { CircleDotDashed, Crown, RedoDot, Trophy, Wallet2 } from "lucide-react"
import DeckCard from "./deck-card"

type TableProps = {
  pot: number,
  cards: any,
  isdealer: boolean,
  isWinner: boolean,
  isTurn: boolean,
  winnerData: any,
  winnerHandEvaluation: string
}

export default function Table({ pot, cards, isdealer, isTurn, isWinner, winnerData, winnerHandEvaluation }: TableProps) {
  const card = [
    ...cards
  ]
  return (
    <>
      <div className="flex flex-col items-center justify-around mt-4 relative w-[350px]">
        {cards.length ? <div className={`absolute z-0 w-[75px] left-[20px]`}> <DeckCard index={0} suit={card[0].suit} cardFace={card[0].cardFace} hidden={card[0].hidden} /> </div> : null}
        {cards.length ? <div className={`absolute z-10 w-[75px] left-[80px]`}> <DeckCard index={1} suit={card[1].suit} cardFace={card[1].cardFace} hidden={card[1].hidden} /> </div> : null}
        {cards.length ? <div className={`absolute z-20 w-[75px] left-[140px]`}> <DeckCard index={2} suit={card[2].suit} cardFace={card[2].cardFace} hidden={card[2].hidden} /> </div> : null}
        {cards.length ? <div className={`absolute z-30 w-[75px] left-[200px]`}> <DeckCard index={3} suit={card[3].suit} cardFace={card[3].cardFace} hidden={card[3].hidden} /> </div> : null}
        {cards.length ? <div className={`absolute z-40 w-[75px] left-[260px]`}> <DeckCard index={4} suit={card[4].suit} cardFace={card[4].cardFace} hidden={card[4].hidden} /> </div> : null}
        <p className="absolute top-12 left-80 text-lg text-white">{pot}</p>
      </div>
    </>
  )
}
