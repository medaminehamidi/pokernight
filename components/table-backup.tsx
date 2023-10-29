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

  return (
    <>
      <div className="mt-5 w-full flex-col flex items-center justify-center">
        <div>
          {winnerData && (isWinner ? (<div className="flex mt-2 text-sm items-center justify-center">
            <Crown className="text-yellow-300" />
            <p className="ml-2">You Won</p>
          </div>) : (
            <div className="flex mt-2 text-sm items-center justify-center">
              <Trophy className="text-red-600" />
              <p className="ml-2 text-red-600">{winnerData.name} won with {winnerHandEvaluation} </p>
            </div>

          ))}
        </div>
        <div className="flex mt-2" >
          {isdealer && <CircleDotDashed className="text-red-600 mr-2" />}
          {isTurn && <RedoDot className="text-yellow-600" />}
        </div>
        <div className="flex mt-2 text-sm items-center justify-center">
          <Wallet2 />
          <p className="ml-2">Pot : {pot}</p>
        </div>
      </div>
      <div className="mt-2 w-full flex-col flex items-center justify-center">
      </div>
      <div className="w-full flex items-center justify-around mt-4">
        {cards.map((card: any, key: any) => <DeckCard key={key} suit={card.suit} cardFace={card.cardFace} hidden={card.hidden} />)}
      </div>
    </>
  )
}
