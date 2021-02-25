import {createContext, useState, ReactNode, useEffect} from 'react';
import challenges from '../../challenges.json';

interface Challenge{
    type: 'body'|'eye'; //poderia ser string apenas mas como só tem aqueles dois tipos ele disse que melhor colocar eles
    description: string;
    amount: number;
}

interface ChallengesContextData{
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    resetChallenge: ()=>void;
    levelUp: () => void;
    startNewChallenge: () => void;
    completeChallenge: () => void;
}

interface ChallengesProviderProps{
    children: ReactNode;
}

export  const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children}:ChallengesProviderProps){
    const [level,setLevel] = useState(1);
    const [currentExperience,setCurrentExperience] = useState(0);
    const [challengesCompleted,setChallengesCompleted] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const experienceToNextLevel = Math.pow((level + 1)*4,2);
    
    useEffect(()=>{
        Notification.requestPermission(); //Notification é uma API do próprio browser. Aqui pedimos permissão para enviar notificações
    },[]);//Relembrando, este hook, permite que um "efeito colateral" seja produzido quando algo muda em nossa aplicação. No caso uma função (primeiro parâmetro) é executada quando algo muda na aplicação (segundo parâmetro). 
    //Quando o segundo parâmetro é um array vazio, a função do primeiro parâmetro é executada uma única vez assim que este componente for exibido em tela.

    function levelUp(){
        setLevel(level + 1);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted'){            
            new Notification('Novo Desafio!',{
                body: `Valendo ${challenge.amount}xp!`
            });
        }
    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if(!activeChallenge){
            return;
        }
        const {amount} = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider value={{level, currentExperience,levelUp,challengesCompleted,startNewChallenge, activeChallenge, resetChallenge,experienceToNextLevel,completeChallenge}}>
            {children}
        </ChallengesContext.Provider>
    );
}