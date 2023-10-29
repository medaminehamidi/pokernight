"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

type PlayerCardProps = {
  name: string,
  email: string,
  dealer: boolean,
  cards: any,
  bet: number,
  isPlayerTurn: boolean,
  hiddenCards: boolean,
  isWinner: boolean,
  chips: any,
  folded: boolean
}

export default function PlayerCard({ name, cards, bet, dealer, isPlayerTurn, hiddenCards, isWinner, chips, folded }: PlayerCardProps) {

  return (
    <div className={cn("w-full flex flex-col items-center justify-center relative", folded || chips === 0 ? 'opacity-30' : 'opacity-100')}>
      <div className="relative">
        {isPlayerTurn && <div className="absolute text-white w-6 h-6 flex items-center justify-center top-[-15px] left-[18px]">
          <ChevronDown />
        </div>}
        <img src={`https://api.dicebear.com/7.x/big-ears/svg?seed=${name}`} className='h-16 w-16' />
        {dealer && <div className="absolute bg-white border-2 border-black rounded-full w-6 h-6 flex items-center justify-center right-1 top-11">
          <p className="text-black font-bold text-xs">D</p>
        </div>}
      </div>
      <p className="text-xs mt-4 text-center w-full text-gray-500">{name}</p>
      <p className="text-base mt-2 text-center w-full">{chips}</p>
      {bet !== 0 && <div className="bg-[#232228] absolute top-36 min-w-[24px] w-auto rounded-full flex items-center justify-center">
        <p className="text-yellow-400 text-xs">{bet}</p>
      </div>}
    </div>
  )
}


