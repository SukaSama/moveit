import { useState, useEffect } from 'react';
import styles from '../styles/components/Countdown.module.css';

export function Countdown(){
    const [time, setTime] = useState(25 * 60); //25 minutos em segundos
    const [active,setActive] = useState(false);

    const minutes = Math.floor(time/60);
    const seconds = time % 60;

    const [minuteLeft, minuteRight] = String(minutes).padStart(2,'0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2,'0').split('');// o padStart analisa se existem dois caracteres, se não, ele preenche o começo da string com o segundo argumento ,'0' no caso, 
    
    function startCountdown() {
        setActive(true);
    }

    useEffect(() =>{ //useEffect executa algo (dentro de sua arrow function passada como primeiro parâmetro) quando algo muda (algo passado como segundo parâmetro, no caso o active e o time)
        if(active && time>0){ //setTimeout diz que algo vai ser executado depois de um tempo, no caso, a arrow function passada como primeiro argumento e o tempo é um segundo (1000) passado como segundo argumento
            setTimeout(() =>{
                setTime(time-1);
            }, 1000);
        }
    }, [active, time]);//quando o active muda e quando o time muda ele chama a arrow function e assim o setTimeOut é chamado e o time muda novamente e o ciclo se mantem até o time zerar
    
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
            <button type="button" className={styles.countdownButton} onClick={startCountdown}>Iniciar um ciclo</button>
        </div>
    );
}