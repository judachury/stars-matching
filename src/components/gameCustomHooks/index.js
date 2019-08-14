import React from "react";
import Utils from "./utils.js";
import StarsDisplay from "./starsdisplay";
import PlayAgain from "./playagain";
import PlayNumber from './playnumber';
import GameState from './state';
import "./App.css";

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const useGameState = () => {
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

  const setGameState = (newCandidateNums) => {
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

  return {stars, availableNums, candidateNums, secondsLeft, setGameState};
};

const Game = (props) => {
  const {stars, availableNums, candidateNums, secondsLeft, setGameState} = GameState.useGameState();
  const candidatesAreWrong = Utils.sum(candidateNums) > stars;

  const gameStatus = availableNums.length === 0 ? 'won' : 
    (secondsLeft === 0)  ? 'lost' : 'active';

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }
    const newCandidateNums = currentStatus === 'available' ? 
      candidateNums.concat(number) : 
        candidateNums.filter(cn => cn !== number);
    
        setGameState(newCandidateNums);
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
  