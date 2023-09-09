import { Event } from 'nostr-tools'
import { OfferEvent } from '../types'

export function delay (ms : number = 1000) {
  return new Promise(res => setTimeout(res, ms))
}

export function parse_offer_event (
  event ?: Event
) : OfferEvent | undefined {
  if (event === undefined) {
    return undefined
  }
  try {
    const content = JSON.parse(event.content)
    return { ...event, content }
  } catch (e) {
    console.error('Failed to parse event content', e)
    return undefined
  }
}

export function get_status_color (status : string) {
  switch (status) {
    case 'UP':
      return 'green'
    case 'DOWN':
      return 'red'
    default:
      return 'gray'
  }
}

export function get_tag_value (
  event : Event | OfferEvent,
  key   : string
) {
  const tag = event.tags.find(tag => tag[0] === key)
  return tag ? tag[1] : null
}

export function get_unique_events (
  events : Event[]
) : OfferEvent[] {
  const unique : OfferEvent[] = []
  const ids = [ ...new Set(events.map(e => e.id)) ]
  ids.forEach(id => {
    const event = events.find(e => e.id === id) 
    const offer = parse_offer_event(event)
    
    if (offer !== undefined) unique.push(offer)
  })
  return unique
}
