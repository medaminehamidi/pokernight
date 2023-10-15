"use client"

import { BadgePercent, CircleDollarSign } from "lucide-react"
import DeckCard from "./deck-card"
import { Button } from "./ui/button"

type PlayerProps = {
  bet: number,
  chips: number,
  cards: any
}

export default function Player({ bet, chips, cards }: PlayerProps) {

  return (
    <>
      <div className="w-full flex items-center justify-center mt-4">
        {cards.map((card: any, key: any) => <DeckCard key={key} suit={card.suit} cardFace={card.cardFace} hidden={false} />)}
      </div>
      <div className="mt-4 flex items-center justify-center">
        <BadgePercent />
        <p className="ml-2">Bet : {bet}</p>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <CircleDollarSign />
        <p className="ml-2">Chips : {chips}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button>
          Call
        </Button>
        <Button>
          Fold
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button>
          5
        </Button>
        <Button>
          10
        </Button>
        <Button>
          25
        </Button>
        <Button>
          50
        </Button>
        <Button>
          100
        </Button>
      </div>

    </>
  )
}
