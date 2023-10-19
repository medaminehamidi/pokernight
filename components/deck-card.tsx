"use client"
import { renderUnicodeSuitSymbol } from "@/helpers/helpers"
import * as React from "react"

type DeckCardProps = {
  suit: any,
  cardFace: any,
  hidden: any,
}

export default function DeckCard({ suit, cardFace, hidden }: DeckCardProps) {


  return (
    <>
      {
        !hidden ? (
          <div
            className={`flex flex-col justify-center items-center bg-white text-[1rem] h-20 w-16 border mx-px my-0`}>
            <h6
              className={`${(suit === 'Diamond' || suit === 'Heart') ? 'text-red-500' : 'text-black'} text-sm`}>
              {`${cardFace} ${renderUnicodeSuitSymbol(suit)}`}
            </h6>
          </div>) :
          <div
            className={`flex flex-col justify-center items-center text-[1rem] h-20 w-16 border mx-px my-0 bg-center bg-no-repeat bg-cover bg-red-500 bg-[url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/PLAYING_CARD_BACK.svg/620px-PLAYING_CARD_BACK.svg.png")]`}>
          </div>}
    </>
  )
}


