import React, {createContext, useState, ReactNode, useEffect} from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';
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
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps{
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export  const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children, ...rest}:ChallengesProviderProps){//rest contem os outros atributos do ChallengesProviderProps: level, currentExperience e challengesCompleted
    const [level,setLevel] = useState(rest.level ?? 1);//pega do objeto rest o level e se não tiver nada deixa 1
    const [currentExperience,setCurrentExperience] = useState(rest.currentExperience ?? 0);//pega do objeto rest o currentExperience e se não tiver nada deixa 0
    const [challengesCompleted,setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);//pega do objeto rest o chalengesCompleted e se não tiver nada deixa 0
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    const experienceToNextLevel = Math.pow((level + 1)*4,2);
    
    useEffect(()=>{
        Notification.requestPermission(); //Notification é uma API do próprio browser. Aqui pedimos permissão para enviar notificações
    },[]);//Relembrando, este hook, permite que um "efeito colateral" seja produzido quando algo muda em nossa aplicação. No caso uma função (primeiro parâmetro) é executada quando algo muda na aplicação (segundo parâmetro). 
    //Quando o segundo parâmetro é um array vazio, a função do primeiro parâmetro é executada uma única vez assim que este componente for exibido em tela.

    useEffect(()=>{ 
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted',String(challengesCompleted));
    },[level, currentExperience, challengesCompleted]);

    function levelUp(){
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }
    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
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

    return (//Se o isLevelUpModalOpen estiver true ele exibe o LevelUpModal component. O && é uma forma de fazer if sem usar if/else
        <ChallengesContext.Provider value={{level,closeLevelUpModal, currentExperience,levelUp,challengesCompleted,startNewChallenge, activeChallenge, resetChallenge,experienceToNextLevel,completeChallenge}}>
            {children}
            { isLevelUpModalOpen && <LevelUpModal/>} 
        </ChallengesContext.Provider>
    );
}