import './App.css'

import { Beyond20Context, useOwlbearBeyond20 } from './utils/useOwlbearBeyond20';
import { Character } from './Character';
import { Roll } from './Roll';
const ID = "com.github.gludington.owlbear-beyond20-sample";

function App() {
  const beyond20 = useOwlbearBeyond20({ id: ID});
  
  return (
    <Beyond20Context.Provider value={beyond20}>
      <Character />
      <Roll/>
    </Beyond20Context.Provider>
  )
}

export default App
