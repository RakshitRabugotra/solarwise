'use client'

import { useState } from "react"
import { twMerge } from "tailwind-merge"

const Newsletter = ({ className }:{className?: string}) => {
  const [email, setEmail] = useState("")

  return (
    <div className={twMerge("flex flex-col items-end justify-center grow py-5 px-12", className)}>
      <h1 className='text-white text-2xl sm:text-4xl font-light font-roboto'>Subscribe to our Newsletter</h1>
      <fieldset className="flex flex-row items-stretch w-full mt-4">
        <input
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-3 py-2 w-full max-w-xs ml-auto text-xs rounded-l-md"
        />
        <button className='border border-white/60 bg-black text-white/80 text-xs px-2 rounded-r-md'>
          Subscribe
        </button>
      </fieldset>
    </div>
  )
}

export default Newsletter;