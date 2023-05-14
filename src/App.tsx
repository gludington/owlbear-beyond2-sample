import { useCallback, useEffect, useState } from 'react'
import './App.css'

import OBR from "@owlbear-rodeo/sdk";
const ID = "com.github.gludington.owlbear-beyond20-sample";
/**
 * 
 * @param onMessageReceived a function to execute on a mesage from Owlbear-Beyond20
 * @param onRegistration a function to execute upon successful registration with Owlbear-Beyond20
 * @param onRegistrationFailed a function to execute if registration fails
 *
 */
const register = ({ onMessageReceived, onRegistration, onRegistrationFailed }:
  { onMessageReceived(message: any): void, onRegistration?(): void, onRegistrationFailed?(): void }) => {

  console.info(`Registering ${ID} with Owlbear-Beyond20`);
  let registered = false;
  window.setTimeout(function () {
    if (!registered) {
      console.warn(`${ID} did not receive a registration response in 5 seconds`);
      if (onRegistrationFailed) {
        onRegistrationFailed();
      }
    }}, 5000);
    window.addEventListener("message", function (e) {
      if (e.origin !== "https://www.owlbear.app") return;
      if (OBR.isReady) {
        if (e.data?.DdbEvent) {
          const ddbData = e.data.DdbEvent;
          console.info(`${ID} Received from Owlbear-Beyond20`, ddbData);
          onMessageReceived(ddbData);
        } else if (e.data.DdbRegistration) {
          registered = true;
          if (onRegistration) {            
            onRegistration();
          }
        }
      } else {
        console.warn(`${ID} received ddbData but OBR not ready`);
      }
    });
  window.parent.postMessage({ action: "DdbRegister", id: ID }, "https://www.owlbear.app");
}

function App() {
  const [character, setCharacter] = useState();
  const [rollResult, setRollResult] = useState();
  const onMessageReceived = useCallback((message: any) => {
    if (message) {
      if (message.action === 'hp-update') {
        setCharacter(prev => message.character);
      } else if (message.action === 'rendered-roll') {
        setRollResult(prev => message);
      } else {
        console.info("Unsupported message", message)
      }
    }
  }, [ setCharacter])
  useEffect(() => {
    if (OBR.isAvailable) {
      if (OBR.isReady) {
        register({ onMessageReceived, onRegistration: () => console.info(`${ID} successfully registered with Owlbear-Beyond20`) });
      } else {
        OBR.onReady(() => register({onMessageReceived, onRegistration: () => console.info(`${ID} successfully registered with Owlbear-Beyond20`) }));
      }
    }
  }, [onMessageReceived]);


  if (!character) {
    return <h2>No character, please trigger a hit point change in D&D Beyond to establish one</h2>
  }
  return (
    <>
    <div className="character-header">
      <div className='character-image'>
        <a href={`https://www.dndbeyond.com/characters/${character.id}`} target="_blank">
          <img src={character.avatar} className="logo" alt={character.name} />
        </a>
      </div>
      <div><h2>{character.name}</h2>
      <div>{character.classes ? (
      <div style={{display: "flex", "gap": "5px"}}>{Object.keys(character.classes).map((key, idx, keys) => <span>{key}: {character.classes[key]}</span>)}</div>
      ): null}</div></div>
        <div style={{display: "flex", gap:"10px"}}>
          <div><b>AC:</b> {character.ac}</div>
          <div><b>HP:</b> {character.hp}/{character['max-hp']}{character['temp-hp'] ? `(${character['temp-hp']} temp)`: null}</div>
      </div>
      </div>
      <div style={{background: "white"}}>
        {rollResult ? rollResult.html ? <div dangerouslySetInnerHTML={{ __html: rollResult.html }} /> : null : null}
        </div>
      </>
  )
}

export default App
