"use client"

import { Wallet2 } from "lucide-react"
import DeckCard from "./deck-card"

type TableProps = {
  pot: number,
  cards: any
}

export default function Table({pot, cards}:TableProps) {
 
  return (
    <>
      <div className="mt-5 w-full flex-col flex items-center justify-center">
        <Wallet2 />
        <p className="mt-2">Pot : {pot}</p>
      </div>
      <div className="w-full flex items-center justify-around mt-4">
       {cards.map((card: any, key: any) => <DeckCard key={key}  suit={card.suit} cardFace={card.cardFace} hidden={true} />)}
      </div>
    </>
  )
}
