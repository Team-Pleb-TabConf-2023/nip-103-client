import { Dispatch, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { OfferEvent } from '../types.js';
import { delay, get_status_color, get_tag_value } from '../lib/util.js';

interface Props {
  offer: OfferEvent;
  setter: Dispatch<OfferEvent | undefined>;
  webln: any;
}

export default function Provider({ offer, setter, webln }: Props) {
  const [text, set_text] = useState<string>();
  const [result, set_result] = useState<any>();

  const on_close = () => setter(undefined);

  const submit = async () => {


    
    const res = await fetch_data({
      endpoint: offer.content.endpoint,
      method: 'POST',
      body: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }],
      },
      provider: webln,
    });
    set_result(res);
  };

  return (
    <div className="accordian-container">
      <Accordion defaultIndex={[0]} className="accordian">
        <AccordionItem key={offer.id} className="accordian-item" textAlign={'start'} position={'relative'}>
          <Box as="span" py={2} flex="1" textAlign="left" alignItems="center">
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: get_status_color(offer.content.status),
                marginRight: '10px',
              }}
            ></span>
            {get_tag_value(offer, 's')}
          </Box>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <Button bgColor={'transparent'} fontSize={'1.5rem'} fontWeight={'extrabold'} color={'black'} onClick={on_close}>
              x
            </Button>
          </div>
          <div>
            <strong>ID:</strong>
            {offer.id}
          </div>
          <div>
            <strong>Endpoint:</strong>
            {offer.content.endpoint}
          </div>
          <div>
            <strong>Price: </strong>
            {offer.content.cost} msats
          </div>
        </AccordionItem>

        <FormControl
          as="form"
          display="flex"
          flexDirection="column"
          style={{ width: '80%', margin: '0 auto', padding: '1%' }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <FormLabel htmlFor="prompt">Prompt:</FormLabel>
          <Textarea
            id="prompt"
            name="prompt"
            onChange={(e) => set_text(e.target.value)}
            value={text || ''}
            bgColor="ghostwhite"
            color="black"
          />
          <Button alignSelf={'flex-end'} my={6} w={'fit-content'} py={2} colorScheme="green" type="submit">
            Submit
          </Button>
        </FormControl>

        {result && (
          <div>
            <strong>Result:</strong>
            <pre>{result.data.choices[0].message.content}</pre>
            {/* <pre>{JSON.stringify(result.data)}</pre> */}
          </div>
        )}
      </Accordion>
    </div>
  );
}


interface OfferRequest {
  endpoint : string
  provider : any
  method   ?: string
  body     ?: Record<string, any> | string
  headers  ?: Record<string, string>
}

async function fetch_data ({
  provider,
  endpoint,
  body,
  method  = 'GET',
  headers = {}
} : OfferRequest) {
  headers = { ...headers, 'Content-Type': 'application/json' }
  if (typeof body === 'object') body = JSON.stringify(body)
  console.log('fetching with params:', { endpoint, body, headers, provider })
  const res = await fetch(endpoint, { method, headers, body })
  const ret = await handle_json(res)

  console.log('ret:', ret)

  if (res.status === 402) {
    const { pr, successAction } = ret.data as any
    const { paymentHash } = await provider.sendPayment(pr)
    if (paymentHash === undefined) {
      return { ok: false, status: 'ERROR', error: 'Payment hash is undefined' }
    } else {
      endpoint = successAction.url
      console.log('updated endpoint to:', endpoint)
      return fetch_data({ provider, endpoint })
    }
  }

  if (res.status === 202) {
    await delay(2000)
    return fetch_data({ provider, endpoint })
  }

  return ret
}

type OfferResponse = OfferPass | OfferFail

interface OfferPass {
  ok     : true
  status : string
  data   : Record<string, string>
  error ?: string
}

interface OfferFail {
  ok     : false
  status : string
  data  ?: undefined
  error  : string
}

async function handle_json (
  res : Response
) : Promise<OfferResponse> {
  console.log('body:', res.body)
  try {
    const data = await res.json() as Record<string, string>
    console.log('data:', data)
    return (res.ok || res.status === 402) 
      ? { ok: true, status: res.statusText, data }
      : { ok: false, status: 'ERROR', error: data.error }
  } catch {
    const { status, statusText } = res
    return { ok: false, status: 'ERROR', error: `${status} ${statusText}` }
  }
}
