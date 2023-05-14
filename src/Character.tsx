import { useContext, useEffect, useState } from "react";
import { Beyond20Context } from "./utils/useOwlbearBeyond20";


export const Character = () => {
    const { message } = useContext(Beyond20Context)
    const [character, setCharacter] = useState<any>();
    
    useEffect(() => {
        if (message?.action === 'hp-update') {
            setCharacter((_prev: any) => message.character);
        }
    }, [ message])
    if (!character) {
        return <h2>No character, please trigger a hit point change in D&D Beyond to establish one</h2>
    }

    return (
         <div className="character-header">
        <div className='character-image'>
          <a href={`https://www.dndbeyond.com/characters/${character.id}`} target="_blank">
            <img src={character.avatar} className="logo" alt={character.name} />
          </a>
        </div>
        <div><h2>{character.name}</h2>
        <div>{character.classes ? (
        <div style={{display: "flex", "gap": "5px"}}>{Object.keys(character.classes).map((key, _idx, _keys) => <span>{key}: {character.classes[key]}</span>)}</div>
        ): null}</div></div>
          <div style={{display: "flex", gap:"10px"}}>
            <div><b>AC:</b> {character.ac}</div>
            <div><b>HP:</b> {character.hp}/{character['max-hp']}{character['temp-hp'] ? `(${character['temp-hp']} temp)`: null}</div>
        </div>
        </div>
    )
}