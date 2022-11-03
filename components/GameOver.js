import "./GameOver.css"

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h1>VOCÊ NÃO É UM VERDADEIRO INSCRITO GIGATÔNICO</h1>
      <h2>A sua pontuação foi: <span>{score}</span></h2>
      <button onClick={retry}>Recomeçar o jogo</button>
    </div>
  )
}

export default GameOver