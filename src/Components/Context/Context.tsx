import { createContext, useEffect, useState } from "react";
import btnClickSound from "../../assets/btnClick.mp3";
import matchSound from "../../assets/matchMusic.wav";
import loseSound from "../../assets/loseSound.wav";
import shuffle from "../../assets/shuffle.mp3";
import winningMusicc from "../../assets/winnigMusic.wav";
import { FC, ReactNode } from "react";

export interface myContextData {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  fruitId: number;
  isClicked: boolean[];
  setIsClicked: React.Dispatch<React.SetStateAction<boolean[]>>;
  fruitArr: { id: number; shouldVisible: boolean; fruit: string }[];
  setFruitArr: React.Dispatch<
    React.SetStateAction<
      { id: number; shouldVisible: boolean; fruit: string }[]
    >
  >;
  lives: number;
  isHideCardContainer: boolean;
  alphabetArr: { id: number; shouldVisible: boolean; alphabet: string }[];
  isAlphabetClicked: boolean[];
  isMatched: boolean;
  isShowScore: boolean;
  audio: HTMLAudioElement | null;
  matchAudio: HTMLAudioElement | null;
  loseAudio: HTMLAudioElement | null;
  shuffleAudio: HTMLAudioElement | null;
  winningMusic: HTMLAudioElement | null;
  blueCardClickHandler: (index: number, alphabetId: number) => void;
  pinkCardClickHandler: (index: number, id: number) => void;
  shuffleArray: (array: any[]) => any[];
  setAlphabetArr: React.Dispatch<
    React.SetStateAction<
      { id: number; shouldVisible: boolean; alphabet: string }[]
    >
  >;

  setisAlphabetClicked: React.Dispatch<React.SetStateAction<boolean[]>>;
  setFalseArr: React.Dispatch<React.SetStateAction<boolean[]>>;
  hideMatchedCards: (modifiedAlphabetData: any[], modifiedData: any[]) => void;
  setIsMatched: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowScore: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
  setLive: React.Dispatch<React.SetStateAction<number>>;
  falseArr: boolean[];
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  interval: any;
  resetTimer: () => void;
  setIsHideCardContainer: React.Dispatch<React.SetStateAction<boolean>>;
}

export let myContext = createContext<myContextData>({} as myContextData);

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  let [score, setScore] = useState<number>(0);
  let [fruitId, setFruitId] = useState<number>(0);
  let [isClicked, setIsClicked] = useState<boolean[]>(Array(6).fill(false));
  let [fruitArr, setFruitArr] = useState<
    { id: number; shouldVisible: boolean; fruit: string }[]
  >([]);
  let [lives, setLive] = useState<number>(5);
  let [isHideCardContainer, setIsHideCardContainer] = useState<boolean>(false);
  let [alphabetArr, setAlphabetArr] = useState<
    { id: number; shouldVisible: boolean; alphabet: string }[]
  >([]);
  let [isAlphabetClicked, setisAlphabetClicked] = useState<boolean[]>(
    Array(6).fill(false)
  );
  let [isMatched, setIsMatched] = useState(false);
  let audio = new Audio(btnClickSound);
  let matchAudio = new Audio(matchSound);
  let loseAudio = new Audio(loseSound);
  let shuffleAudio = new Audio(shuffle);
  let winningMusic = new Audio(winningMusicc);
  let falseArr = Array(6).fill(false);
  let [isShowScore, setIsShowScore] = useState(false);
  let [timer, setTimer] = useState(30);
  let interval: number | undefined;
  let [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : prev)); // Decrease timer if greater than 0
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);


  const resetTimer = () => {
    setTimer(30); // Reset timer to its initial value
    setIsPaused(false); // Ensure timer is not paused after reset
  };

  // Function to suffle the data on reloading
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
    return array;
  }

  // Function to handle click on pink card
  function pinkCardClickHandler(index: number, id: number) {
    shuffleAudio.play();
    setFruitId(id);
    const updatedClicked = [...isClicked];
    let anyCardFlipped = updatedClicked.includes(true);
    if (!anyCardFlipped) {
      updatedClicked[index] = !updatedClicked[index];
      setIsClicked([...updatedClicked]);
    }
  }

  function setFalseArr() {
    setTimeout(() => {
      setisAlphabetClicked([...falseArr]);
      setIsClicked([...falseArr]);
    }, 800);
  }

  // function get the id of the flipped blue card
  function blueCardClickHandler(index: number, alphabetId: number) {
    const updatedClicked = [...isAlphabetClicked];
    // console.log(index, alphabetId);

    // return from here if pink card is already clicked and user tries to click different card
    if (!isClicked.includes(true)) {
      return;
    }

    if (!updatedClicked.includes(true)) {
      updatedClicked[index] = !updatedClicked[index];
      setisAlphabetClicked([...updatedClicked]);
    }
    compareId(fruitId, alphabetId);
  }

  // Function To compare the id of the flipped card
  function compareId(fruitId: number, alphabetId: number) {
    if (fruitId == alphabetId) {
      setScore((prev) => prev + 1);
      matchAudio.play();
      // Modifing Fruit array and adding card shouldVisible False
      let tempFruit = JSON.stringify(fruitArr);
      let modifiedData = JSON.parse(tempFruit).map(
        (ele: { id: number; shouldVisible: boolean }) => {
          if (ele.id == fruitId) {
            ele.shouldVisible = false;
          }
          return ele;
        }
      );

      // Modifing alphabetArr array and adding card shouldVisible False
      let tempAlphabet = JSON.stringify(alphabetArr);
      let modifiedAlphabetData = JSON.parse(tempAlphabet).map(
        (ele: { id: number; shouldVisible: boolean }) => {
          if (ele.id == alphabetId) {
            ele.shouldVisible = false;
          }
          return ele;
        }
      );

      function showScore() {
        if (score == 5) {
          setTimeout(() => {
            setIsShowScore(true);
          }, 1000);
        }
      }
      showScore();
      hideMatchedCards(modifiedAlphabetData, modifiedData);
      setFalseArr();
    } else {
      shuffleAudio.play();
      setFalseArr();
      let updateLive = lives - 1;
      setLive(updateLive);
    }
  }

  // function to hide matched cards
  function hideMatchedCards(modifiedAlphabetData: any[], modifiedData: any[]) {
    setTimeout(() => {
      setAlphabetArr(modifiedAlphabetData);
      setFruitArr(modifiedData);
    }, 800);
    setIsMatched(true);
  }

  // Function To reset Data
  function reset() {
    setFalseArr();
    setIsShowScore(false);
    setScore(0);
    setLive(5);
    setIsHideCardContainer(false);
    resetTimer();
    // togglePause();
  }
  if (lives == 0 || score == 6) {
    setTimeout(() => {
      // setIsHideCardContainer(true);
      setIsPaused(true);
    }, 800);
  }

  // -------------------------

  return (
    <myContext.Provider
      value={{
        isHideCardContainer,
        fruitId,
        blueCardClickHandler,
        pinkCardClickHandler,
        score,
        setScore,
        shuffleArray,
        isClicked,
        setIsClicked,
        setFruitArr,
        fruitArr,
        alphabetArr,
        setAlphabetArr,
        isAlphabetClicked,
        setisAlphabetClicked,
        falseArr,
        hideMatchedCards,
        setFalseArr,
        isMatched,
        setIsMatched,
        isShowScore,
        lives,
        setIsShowScore,
        reset,
        setLive,
        matchAudio,
        shuffleAudio,
        audio,
        loseAudio,
        winningMusic,
        timer,
        setTimer,
        resetTimer,
        interval,
        setIsHideCardContainer,
      }}
    >
      <div>{children}</div>
    </myContext.Provider>
  );
};

export default Context;
