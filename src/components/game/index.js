import React from "react";
import Utils from "./utils.js";
import StarsDisplay from "./starsdisplay";
import PlayAgain from "./playagain";
import PlayNumber from './playnumber';
import "./App.css";

// v1 STAR MATCH - Starting Template
// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const Game = (props) => {
  
  const [stars, setStars] = React.useState(Utils.random(1, 9));
  const [availableNums, setAvailableNums] = React.useState(Utils.range(1, 9));
  const [candidateNums, setCandidateNums] = React.useState([]);
  const [secondsLeft, setSecondsLeft] = React.useState(10);

  React.useEffect(() => { 
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const candidatesAreWrong = Utils.sum(candidateNums) > stars;
  /* const gameIsWon = availableNums.length === 0;
  const gameIsLost = secondsLeft === 0; */
  const gameStatus = availableNums.length === 0 ? 'won' : 
    (secondsLeft === 0)  ? 'lost' : 'active';

  const resetGame = () => {
    setStars(Utils.random(1, 9));
    setAvailableNums(Utils.range(1, 9));
    setCandidateNums([]);
  };

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }
    const newCandidateNums = currentStatus === 'available' ? 
      candidateNums.concat(number) : 
        candidateNums.filter(cn => cn !== number);
    
    if (Utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(Utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    } 
  };

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
          ) : (
            <StarsDisplay count={stars} gameStatus={gameStatus} />
          )}
        </div>
        <div className="right">
          {Utils.range(1, 9).map(number =>
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number} 
              colors={colors}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

export default Game;
  