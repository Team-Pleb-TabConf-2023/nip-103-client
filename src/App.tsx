import { useNostr }  from "@cmdcode/use-nostr"
import Header        from './components/Header'
import ProvidersList from './components/ProvidersList'

import './styles/App.css'

export default function () {
  const { store, update } = useNostr();
  
  return (
    <>
      <div className="App">
        <Header />
        <div className='components-container'>
          <ProvidersList />
        </div>
      </div>
    </>
  )
}
