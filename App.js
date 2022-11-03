//css
import './App.css';

//react
import { useCallback, useEffect, useState, } from 'react';

//data
import { wordsList } from "./data/words"

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {
    //escolher categoria aleatória
    const categories = Object.keys(words);
    const category = 
    categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category)

    //escolher palavra aleatória
    const word = 
    words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)

    return { word, category };
  }, [words]);

  // começar a palavra gigatonica
  const startGame = useCallback(() => {
  // limpar todas as letras
  clearLetterStates()
  // escolher palavra e categoria
    const { word, category } = pickWordAndCategory();

    // criar um array contendo as letras
    let wordLetters = word.split("")
 
    wordLetters = wordLetters.map((I) => I.toLowerCase())

    console.log(word, category);
    console.log(wordLetters);

    // settar estados
    setPickedWord(word);
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // processar a input letra
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // checar se letra já foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    // empurrar letra certa ou remover uma chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    }  else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  } 

  // checar se as chances acabaram
  useEffect(() => {
    if(guesses <= 0) {
      //resetar todos os states
      clearLetterStates()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  // checar condição de vitória
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];

    // condição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      // adicionar pontuação
      setScore((actualScore) => actualScore + 1)

      // recomeçar jogo com nova palavra
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // recomeçar o jogo
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }
  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
