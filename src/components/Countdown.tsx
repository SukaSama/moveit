import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Countdown.module.css';


let countdownTimeout : NodeJS.Timeout;

export function Countdown(){
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 60); //25 minutos em segundos
    const [isActive,setisActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time/60);
    const seconds = time % 60;

    const [minuteLeft, minuteRight] = String(minutes).padStart(2,'0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2,'0').split('');// o padStart analisa se existem dois caracteres, se não, ele preenche o começo da string com o segundo argumento ,'0' no caso, 
    
    function startCountdown() {
        setisActive(true);
    }
    function resetCountdown(){        
        clearTimeout(countdownTimeout); //Impedindo o setTimeout de funcionar
        setisActive(false); 
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
    
    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>
            {hasFinished ? (
                <button disabled className={styles.countdownButton}>
                    Ciclo encerrado
                </button>
            ):(
                <> 
                    { isActive ? (
                    <button type="button" className={`${styles.countdownButton} ${styles.countdownButtonActive}`} onClick={resetCountdown}>
                        Abandonar ciclo
                    </button>
                    ):(
                    <button type="button" className={styles.countdownButton} onClick={startCountdown}>
                        Iniciar um ciclo
                    </button>
                    )}
                </>
            )}
            
            
            
        </div>
    );
}