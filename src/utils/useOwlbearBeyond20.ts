import { createContext, useEffect, useRef, useState } from "react";
import useEventListener from "./useEventListener";
import OBR from "@owlbear-rodeo/sdk";

type Status = 'starting' | 'registering' | 'registered' | 'failed';

export const useOwlbearBeyond20 = ({ id}: {id: string}) => {
    const [message, setMessage] = useState<any>(); 
    const status = useRef<Status>('starting'); 
    // @ts-ignore - message is in superinterface of WindowsEventMap, not detected for some reason
    useEventListener("message", (e: MessageEvent) => {
        if (e.origin !== "https://www.owlbear.app") return;

        if (e.data?.DdbRegistration) {
            status.current = 'registered';
            console.info(`${id} registered with Owbear-Beyond20`);
        } else {
            if (OBR.isReady) {
                if (e.data?.DdbEvent) {
                    const ddbData = e.data.DdbEvent;
                    console.info(`${id} Received from Owlbear-Beyond20`, ddbData);
                    setMessage(ddbData);
                } else {
                    console.warn(`${id} received ddbData but OBR not ready`);
                }
            }
        }
    }, window);
    
    useEffect(() => {
        switch (status.current) {
            case 'starting':
                window.setTimeout(function () {
                    if (status.current !== 'registered') {
                        console.warn(`${id} did not receive a registration response in 5 seconds`);
                        status.current = 'failed';
                    }
                }, 5000);        
                window.parent.postMessage({ action: "DdbRegister", id }, "https://www.owlbear.app");
                status.current = 'registering';
                return;
        }
    }, [id, status])
    return {
        status: status.current,
        message,
    }
}

export const Beyond20Context = createContext < { status: string, message?: any }>({ status: 'starting'});