"use client"
import { renderCardSymbol, renderUnicodeSuitSymbol } from "@/helpers/helpers"
import { cn } from "@/lib/utils"
import * as React from "react"

type DeckCardProps = {
  suit: any,
  cardFace: any,
  hidden: any,
  index: any
}

export default function DeckCard({ suit, cardFace, hidden, index }: DeckCardProps) {
  const [domLoaded, setDomLoaded] = React.useState(false)
  React.useEffect(() => {
    setDomLoaded(true);
  }, [])
  const Component: any = renderCardSymbol(suit)
  const offset = index + 1
  return (
    <>
      {
        !hidden ? (
          domLoaded && <div className={`bg-white h-24 rounded-lg p-3 w-full flex flex-col items-start justify-between shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}>
            <p className={`${(suit === 'Diamond' || suit === 'Heart') ? 'text-red-500' : 'text-black'} text-2xl`}>{cardFace}</p>
            <div className={`${(suit === 'Diamond' || suit === 'Heart') ? 'text-red-500' : 'text-black'} text-xl`}>
              <Component className='h-4 w-4' />
            </div>
          </div>) :
          domLoaded && <div className={`bg-white h-24 rounded-lg p-3 w-full flex flex-col items-start justify-between shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><line x1='0' y1='100' x2='100' y2='0' strokeWidth='2' stroke='#000' /></svg>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><line x1='0' y1='100' x2='100' y2='0' strokeWidth='2' stroke='#000' /></svg>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><line x1='0' y1='100' x2='100' y2='0' strokeWidth='2' stroke='#000' /></svg>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><line x1='0' y1='100' x2='100' y2='0' strokeWidth='2' stroke='#000' /></svg>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><line x1='0' y1='100' x2='100' y2='0' strokeWidth='2' stroke='#000' /></svg>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><line x1='0' y1='100' x2='100' y2='0' strokeWidth='2' stroke='#000' /></svg>
          </div>}
    </>
  )
}


