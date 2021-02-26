import Head from 'next/head';
import React from 'react';
import { ChallengeBox } from '../components/ChallengeBox';
import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { CountdownProvider } from '../contexts/CountdownContext';
import styles from '../styles/pages/Home.module.css';
import { GetServerSideProps}  from 'next';
import { ChallengesProvider } from '../contexts/ChallengesContext';

interface HomeProps{
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props:HomeProps) {
  //console.log(props); Aqui esse console log sai no terminal do browser pois está dentro da aplicação react
  return (

    /*<div>
      <Button color="red"> Click me 1!</Button>
      <Button color="green">Click me 2!</Button>
      <Button color="purple">Click me 3!</Button>
    </div>*/
    <ChallengesProvider level={props.level} currentExperience={props.currentExperience} challengesCompleted={props.challengesCompleted}> 
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>
        <ExperienceBar />
        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {//O nome da funcão tem que ser obrigatoriamente esse getServerSideProps e deve ser async. O next.js  surgiu a partir dessa função, chamada inicialmente de getInicialProps.
  //A ideia aqui é que o SEO google não precisa esperar a aplicação toda carregar, com os dados em tela para acessar os dados, ele já acessa aqui, pois essa função já faz a comunicação com o banco e tráz as informações antets mesmo da página carregar tudo.
  //chamada api
 // const user = {
  //  level:1,
  //  currentExperience:50,
  //  challengesCompleted:2,
//  }
  const {level, currentExperience, challengesCompleted} = ctx.req.cookies;
 // console.log(user); //Aqui dentro dessa função getServerSideProps, tudo o que é execuctado só é exibido no servidor node então só aparece esse console.log no terminal aqui do VSCode, 
  //não aparece no terminal do browser pois ele é o cliente javascript/react
  return{
    //props:user
    props:{
      level:Number(level), currentExperience:Number(currentExperience), challengesCompleted:Number(challengesCompleted)
    }
  }
}

// exemplo:
//backend (rodando em ruby)
//Next.js (roda em node) //camada intermediária que acessa o front e o back, embora em raras exceções seja recomendado para agir como back
//Frontend (rodando em react)