import { useEffect, useState } from 'react'

import { useNostr } from '@cmdcode/use-nostr'
import { Event }    from 'nostr-tools'

import Provider from './Provider'

import {
  Accordion,
  Spinner
} from '@chakra-ui/react'

import '@/styles/components.css'

import { delay, get_unique_events } from '../lib/util.js'

import ProviderItem from './ProviderItem'
import { OfferEvent } from '../types'

export default function ProviderList () {
  const { store, setError }       = useNostr()
  const [ events, setEvents ]     = useState<Event[]>([])
  const [ offers, setOffers ]     = useState<OfferEvent[]>([])
  const [ loading, setLoading ]   = useState(true)
  const [ selected, setSelected ] = useState<OfferEvent>()
  const [ webln, set_webln ]      = useState<any>()

  useEffect(() => {
    const webln = window.webln
    if (webln !== undefined) {
      void (async () => {
        if (webln.enabled === false) {
          await delay(1000)
          await webln.enable()
        }
        console.log('updating webln provider...')
        set_webln(webln)
      })()
    } else {
      console.log('provider:', webln)
    }
  }, [ webln ])
  
  useEffect(() => {
    const fetchEvents = async () => {
      const { client } = store
      
      if(client?.ok) {
        const filter = {
          kinds : [ 31402 ],
          limit : 4,
          since : Math.floor(Date.now() / 1000) - (60 * 60 * 24)
        }

        const sub = await client.sub([ filter ])

        if(sub === undefined) {
          setError('Failed to subscribe!')
          return
        }

        sub.on('event', (event) => {
          // Check if event already exists in the state
          if (!events.some(e => e.id === event.id)) {
            console.log(event)
            setEvents((prev) => [ ...prev, event ])
          }
        })

      }
    }

    fetchEvents()
  }, [ store, setError ])

  useEffect(() => {
    if (events.length > 0) {
      setOffers(get_unique_events(events))
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }, [ events ])

  if (loading) {
    return (
      <div className="accordian-container">
        <Accordion defaultIndex={[ 0 ]} allowMultiple className="accordian">
          <Spinner size={'xl'} />
        </Accordion> 
      </div>
    )
  }

  if (selected !== undefined) {
    return <Provider offer={selected} webln={webln} setter={setSelected} />
  }

  return (
    <div className="accordian-container">
      <Accordion defaultIndex={[ 0 ]} allowMultiple className="accordian">
        { offers.map((event) => <ProviderItem key={event.id} event={event} setter={setSelected} /> )}
      </Accordion>
    </div>
  )
}
