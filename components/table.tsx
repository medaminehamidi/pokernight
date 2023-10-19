"use client"

import { CircleDotDashed, Crown, RedoDot, Wallet2 } from "lucide-react"
import DeckCard from "./deck-card"

type TableProps = {
  pot: number,
  cards: any,
  isdealer: boolean,
  isWinner: boolean,
  isTurn: boolean
}

export default function Table({ pot, cards, isdealer, isTurn, isWinner }: TableProps) {

  return (
    <>
      <div className="mt-5 w-full flex-col flex items-center justify-center">
        <div>
          {isWinner && <Crown className="text-yellow-300" />}
        </div>
        <div className="flex mt-4" >
          <Wallet2 className="mr-2" />
          {isdealer && <CircleDotDashed className="text-red-600 mr-2" />}
          {isTurn && <RedoDot className="text-yellow-600" />}
        </div>
        <p className="mt-2">Pot : {pot}</p>
      </div>
      <div className="mt-2 w-full flex-col flex items-center justify-center">
      </div>
      <div className="w-full flex items-center justify-around mt-4">
        {cards.map((card: any, key: any) => <DeckCard key={key} suit={card.suit} cardFace={card.cardFace} hidden={card.hidden} />)}
      </div>
    </>
  )
}
