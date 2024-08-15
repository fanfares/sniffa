"use client"
import { useEffect, useState } from "react"
import useNDKStore from "../store/ndk-store"
import { NDKEvent, NDKFilter, NDKUser } from "@nostr-dev-kit/ndk"
import Image from "next/image"

type NostrProfileType = {
  name: string
  title: string
  pubkey: string
}

const isReply = (event: NDKEvent) => {
  return !!event.tags.find(tag => tag.length === 4 && tag[3] === 'root')
}

export default function NostrProfile({ name, title, pubkey }: NostrProfileType) {

  const {isConnected, fetchUser, fetchEvents} = useNDKStore() 
  const [user, setUser] = useState<NDKUser>()
  const [feed, setFeed] = useState<Set<NDKEvent>>()

  useEffect(() => {
    if (!isConnected) return
    if (user) return // we already have the user
    async function getUser() {
      const userData = await fetchUser(pubkey)
      setUser(userData)
    }
    async function getUserFeed() {
      const filter: NDKFilter = { kinds: [1], authors: [pubkey], limit: 20 }
      const feed = await fetchEvents(filter)
      console.log('feed me', feed)
      setFeed(feed)
    }
    getUser()
    getUserFeed()
  }, [isConnected, fetchUser, fetchEvents, user, pubkey])

  useEffect(() => {
    if (!user) return
    console.log(name, user)
  }, [user])

  const renderFeed = () => {
    return Array.from(feed!).map((event, i) => {
      if (isReply(event)) return null
      return (
        <section key={i} className="note border border-solid border-gray-800 text-gray-600 rounded-xl p-4 my-2 max-w-full">
          <p className="max-w-full font-sans">{event.content}</p>
        </section>
      )
    }).filter(Boolean).slice(0,5)
  }

  return (
    <section className="nostr-profile max-w-[350px] py-6 flex flex-col items-center justify-start">

      <section id="name-and-picture" className="mx-12 max-w text-center">
        <h1 id="name" className="text-2xl">{name}</h1>
        <h2 id="title" className="text-md mb-4">{title}</h2>
        <div id="picture" className="relative w-64 h-64">
          { !user 
            ? <p>Loading</p> 
            // eslint-disable-next-line @next/next/no-img-element
            : <img className="rounded-full border-white border border-solid object-cover w-full h-full" src={user!.profile!.image as string} alt={`${name}'s profile picture`} width={250} height={250} /> }
        </div>
      </section>

      <section id="visit" className="visit my-8 px-12">
        <a className="bg-black rounded-full text-center border-purple-800 text-sm border-2 border-solid text-gray-500 font-sans py-2 px-2 glow-purple min-w-full block" href={`https://primal.net/p/${pubkey}`} target="_blank" rel="noopener noreferrer">
          Visit on primal.net
        </a>
      </section>

      <section id="about" className="about whitespace-pre-line mt-4 text-sm font-light font-sans max-w-[300px] p-3">
        <p>{user?.profile?.about}</p>
      </section>

      <section id="feed" className="feed max-w-[300px] overflow-hidden ">
        { feed && feed.size ? <span className="text-gray-600 pl-3">Latest notes: <br/></span> : null }
        { !feed ? <p className="text-sm py-6">Loading notes</p> : renderFeed()}
      </section>

    </section>
  )
}