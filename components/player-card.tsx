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

type PlayerCardProps = {
  name: string,
  email: string,
  bet: number
}

export default function PlayerCard({name, email, bet}: PlayerCardProps) {
  const yes = true

  const renderUnicodeSuitSymbol = (suit: any) => {
    switch (suit) {
      case ('Heart'): return '\u2665';
      case ('Diamond'): return '\u2666';
      case ('Spade'): return '\u2660';
      case ('Club'): return '\u2663';
      default: throw Error('Unfamiliar String Recieved in Suit Unicode Generation');
    }
  }
  const cardData = {
    suit: 'Diamond',
    cardFace: '2'
  }
  return (
    <Card className={cn("w-full", `${yes ? 'border-yellow-300' : ''}`)}>
      <CardHeader className="relative flex flex-row items-start justify-start p-2">
        <div className="h-2 w-2 absolute top-1 left-1 rounded-full bg-red-500" />
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`}
            alt={`@${name}`}
          />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <CardTitle className="text-base">{name}</CardTitle>
          <CardDescription className="text-sm">{bet}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row items-start justify-between p-2">
        <div
          className={`flex flex-col justify-center items-center bg-white text-[1rem] h-[50px] w-[35px] border mx-px my-0`}>
          <h6
            style={{ color: `${(cardData.suit === 'Diamond' || cardData.suit === 'Heart') ? 'red' : 'black'}` }}>
            {`${cardData.cardFace} ${renderUnicodeSuitSymbol(cardData.suit)}`}
          </h6>
        </div>
        <div
          className={`flex flex-col justify-center items-center text-[1rem] h-[50px] w-[35px] border mx-px my-0 bg-center bg-no-repeat bg-cover bg-red-500 bg-[url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/PLAYING_CARD_BACK.svg/620px-PLAYING_CARD_BACK.svg.png")]`}>
        </div>
      </CardContent>
    </Card>
  )
}


