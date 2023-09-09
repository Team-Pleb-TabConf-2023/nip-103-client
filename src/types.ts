import { Event } from "nostr-tools"

export type OfferingStatus = 'UP' | 'DOWN' | 'CLOSED'

export interface OfferingContent {
  endpoint     : string,            // The POST endpoint you call to pay/fetch
  status       : OfferingStatus,    // UP/DOWN/CLOSED
  cost         : number,            // The cost per call in mSats
  schema      ?: Object,            // The JSON schema for the POST body of the endpoint
  description ?: string             // Description for the end user
}

export interface OfferEvent extends Omit<Event, 'content'> {
  content : OfferingContent
}
