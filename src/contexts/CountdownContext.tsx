import { createContext, ReactNode, useContext, useEffect, useState } from "react"; //Parte da estrutura básica de um contexto, todo contexto criado no react com o typescript terá isso!
import { ChallengesContext } from "./ChallengesContext";
interface CountdownContextData{//Parte da estrutura básica de um contexto, todo contexto terá isso!
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}
interface CountdownProviderProps{//Parte da estrutura básica de um contexto, todo contexto terá isso!
    children:ReactNode;
}
export const CountdownContext  = createContext({} as CountdownContextData); //criou o contexto countDown e passa os dados no formato de objeto definido pela interface criada//Parte da estrutura básica de um contexto, todo contexto terá isso!
let countdownTimeout : NodeJS.Timeout;
export function CountdownProvider({children}:CountdownProviderProps){ // esse children são os componentes que vem dentro do Props//Parte da estrutura básica de um contexto, todo contexto terá isso!
    
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 60); //25 minutos em segundos
    const [isActive,setisActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time/60);
    const seconds = time % 60;

    function startCountdown() {
        setisActive(true);
    }
    function resetCountdown(){        
        clearTimeout(countdownTimeout); //Impedindo o setTimeout de funcionar
        setisActive(false); 
        setHasFinished(false);
        setTime(0.1 * 60);
    }
    useEffect(() =>{ //useEffect executa algo (dentro de sua arrow function passada como primeiro parâmetro) quando algo muda (algo passado como segundo parâmetro, no caso o active e o time)
        if(isActive && time>0){ //setTimeout diz que algo vai ser executado depois de um tempo, no caso, a arrow function passada como primeiro argumento e o tempo é um segundo (1000) passado como segundo argumento
            countdownTimeout = setTimeout(() =>{
                setTime(time-1);
            }, 1000);
        }else if(isActive && time === 0){
            setHasFinished(true);
            setisActive(false);
            startNewChallenge();            
        }
    }, [isActive, time]);//quando o active muda e quando o time muda ele chama a arrow function e assim o setTimeOut é chamado e o time muda novamente e o ciclo se mantem até o time zerar
    
    return(//Parte da estrutura básica de um contexto, todo contexto terá isso!
        <CountdownContext.Provider value={{minutes,seconds,hasFinished,isActive,startCountdown,resetCountdown}}>
            {children}
        </CountdownContext.Provider>
    )
}