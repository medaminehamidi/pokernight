"use client"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BadgePercent, Crown } from "lucide-react"

type PlayerCardProps = {
  name: string,
  email: string,
  dealer: boolean,
  cards: any,
  bet: number,
  isPlayerTurn: boolean,
  hiddenCards: boolean,
  isWinner: boolean
}

export default function PlayerCard({ name, cards, bet, dealer, isPlayerTurn, hiddenCards, isWinner }: PlayerCardProps) {

  const renderUnicodeSuitSymbol = (suit: any) => {
    switch (suit) {
      case ('Heart'): return '\u2665';
      case ('Diamond'): return '\u2666';
      case ('Spade'): return '\u2660';
      case ('Club'): return '\u2663';
      default: throw Error('Unfamiliar String Recieved in Suit Unicode Generation');
    }
  }
  return (
    <Card className={cn("w-full", `${isPlayerTurn ? 'border-yellow-300' : ''}`)}>
      <CardHeader className="relative flex flex-row items-start justify-start p-2">
        {dealer ? <div className="h-2 w-2 absolute top-1 left-1 rounded-full bg-red-500" /> : null}
        <div className="absolute top-2 right-2 ">
          {isWinner && <Crown className="text-yellow-300 w-3 h-3" />}
        </div>
        <div className="ml-2 w-full">
          <CardTitle className="text-base">{name}</CardTitle>
          <div className="mt-2 text-slate-300 w-full flex items-center justify-start text-xs"><p>Bet : {bet}</p></div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row items-start justify-between p-2">
        {!hiddenCards
          ? (
            <>
              {cards && cards.map((card: any, key: any) =>
                <div key={key} className={`flex flex-col justify-center items-center bg-white text-[1rem] h-[50px] w-[35px] border mx-px my-0`}>
                  <h6
                    style={{ color: `${(card.suit === 'Diamond' || card.suit === 'Heart') ? 'red' : 'black'}` }}>
                    {`${card.cardFace} ${renderUnicodeSuitSymbol(card.suit)}`}
                  </h6>
                </div>)}
            </>)
          : (
            <>
              <div
                className={`flex flex-col justify-center items-center text-[1rem] h-[50px] w-[35px] border mx-px my-0 bg-center bg-no-repeat bg-cover bg-red-500 bg-[url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/PLAYING_CARD_BACK.svg/620px-PLAYING_CARD_BACK.svg.png")]`}>
              </div>
              <div
                className={`flex flex-col justify-center items-center text-[1rem] h-[50px] w-[35px] border mx-px my-0 bg-center bg-no-repeat bg-cover bg-red-500 bg-[url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/PLAYING_CARD_BACK.svg/620px-PLAYING_CARD_BACK.svg.png")]`}>
              </div>
            </>
          )}
        {/* <div
          className={`flex flex-col justify-center items-center text-[1rem] h-[50px] w-[35px] border mx-px my-0 bg-center bg-no-repeat bg-cover bg-red-500 bg-[url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/PLAYING_CARD_BACK.svg/620px-PLAYING_CARD_BACK.svg.png")]`}>
        </div> */}
      </CardContent>
    </Card>
  )
}


