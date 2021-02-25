import '../styles/global.css';
import  {ChallengesProvider} from '../contexts/ChallengesContext';
import React from 'react';
import { CountdownProvider } from '../contexts/CountdownContext';

function MyApp({ Component, pageProps }) {
  return(//O countdownProvider fica abaixo do challengesProvider. Isto porque ele depende do challengesProvider, ele contém variáveis que vem do ChallengesProvider. Isto é comum no react, um contexto dependendo de outro.
   <ChallengesProvider>    
      <Component {...pageProps} />    
   </ChallengesProvider>
  )
}

export default MyApp
