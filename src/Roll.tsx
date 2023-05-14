import { useContext, useEffect, useState } from "react";
import { Beyond20Context } from "./utils/useOwlbearBeyond20";


export const Roll = () => {
    const {  message } = useContext(Beyond20Context)
    const [rollResult, setRollResult] = useState<any>();
  
    useEffect(() => {
        if (message?.action === 'rendered-roll') {
          setRollResult((_prev: any) => message);
        }
    }, [ message])
    if (!rollResult) {
        return <></>
    }

    return (
      <div style={{background: "white"}}>
        {rollResult ? rollResult.html ? <div dangerouslySetInnerHTML={{ __html: rollResult.html }} /> : null : null}
      </div>
    )
}