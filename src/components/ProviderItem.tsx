import { Dispatch } from 'react'

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
} from '@chakra-ui/react'

import { get_status_color, get_tag_value } from '../lib/util.js'

import { OfferEvent } from '../types.js'

import '@/styles/components.css'

interface Params {
  event  : OfferEvent
  setter : Dispatch<OfferEvent>
}

export default function ProviderItem ({ event, setter } : Params) {

  if(event.content.endpoint.includes("STABLE")) return null;

  return (
    <>
      <AccordionItem key={event.id} className="accordian-item">
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' alignItems='center'>
              <span style={{
                display         : 'inline-block',
                width           : '10px',
                height          : '10px',
                borderRadius    : '50%',
                backgroundColor : get_status_color(event.content.status),
                marginRight     : '10px'
              }}></span>
              { get_tag_value(event, "s") }
            </Box>
            <Box pr={'3%'}>
              <strong>Cost:</strong>
              { event.content.cost } msats
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} textAlign={"start"}>
          <div>
            <strong>ID:</strong> 
            {event.id}
          </div>
          <div>
            <strong>Endpoint:</strong>
            {event.content.endpoint}
          </div>
          <div>
            <strong>Status:</strong>
            {event.content.status}
          </div>
          <div>
            <strong>Description:</strong>
            {event.content.description}
          </div>
          <div>
            <strong>Price: </strong>
            {event.content.cost} msats
          </div>
          <div>
            <strong>Published At:</strong>
            {new Date(event.created_at * 1000).toLocaleString()}
          </div>
          <Button colorScheme="telegram" mt={2} onClick={() => setter(event)}>Use</Button>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}