import React, { useState } from 'react'

export const SnakeOffLine = () => {
    const [snakePositions, setSnakePositions] = useState([168, 169, 170, 171]);
    const [applePosition, setApplePosition] = useState(100);
    const [inputs, setInputs] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [hardMode, setHardMode] = useState(false);
    const [score, setScore] = useState(0);
    const [contrast, setContrast] = useState(1);
  
    const width = 15;
    const height = 15;
    const speed = 200;
    const fadeSpeed = useRef(5000);
    const fadeExponential = useRef(1.024);
    const contrastIncrease = 0.5;
    const color = "black";
    
    const gridRef = useRef(null);
    const noteRef = useRef(null);
    const scoreRef = useRef(null);
    const contrastRef = useRef(null);
    const lastTimestamp = useRef(undefined);
    const startTimestamp = useRef(undefined);
    const stepsTaken = useRef(-1);
  
    useEffect(() => {
      initializeGrid();
      resetGame();
    }, []);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        const key = event.key;
        if (!["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " ", "H", "h", "E", "e"].includes(key)) return;
        event.preventDefault();
  
        if (key === " ") {
          resetGame();
          startGame();
          return;
        }
  
        if (key === "H" || key === "h") {
          setHardMode(true);
          fadeSpeed.current = 4000;
          fadeExponential.current = 1.025;
          noteRef.current.innerHTML = "Hard mode. Press space to start!";
          noteRef.current.style.opacity = 1;
          resetGame();
          return;
        }
  
        if (key === "E" || key === "e") {
          setHardMode(false);
          fadeSpeed.current = 5000;
          fadeExponential.current = 1.024;
          noteRef.current.innerHTML = "Easy mode. Press space to start!";
          noteRef.current.style.opacity = 1;
          resetGame();
          return;
        }
  
        const newInputs = [...inputs];
        const headDirection = getHeadDirection();
        if (key === "ArrowLeft" && newInputs[newInputs.length - 1] !== "left" && headDirection !== "right") {
          newInputs.push("left");
        } else if (key === "ArrowUp" && newInputs[newInputs.length - 1] !== "up" && headDirection !== "down") {
          newInputs.push("up");
        } else if (key === "ArrowRight" && newInputs[newInputs.length - 1] !== "right" && headDirection !== "left") {
          newInputs.push("right");
        } else if (key === "ArrowDown" && newInputs[newInputs.length - 1] !== "down" && headDirection !== "up") {
          newInputs.push("down");
        }
  
        setInputs(newInputs);
        if (!gameStarted) startGame();
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [inputs, gameStarted]);
  
    const initializeGrid = () => {
      const grid = gridRef.current;
      for (let i = 0; i < width * height; i++) {
        const content = document.createElement("div");
        content.setAttribute("class", "content");
        content.setAttribute("id", i);
  
        const tile = document.createElement("div");
        tile.setAttribute("class", "tile");
        tile.appendChild(content);
  
        grid.appendChild(tile);
      }
    };
  
    const resetGame = () => {
      setSnakePositions([168, 169, 170, 171]);
      setApplePosition(100);
      setInputs([]);
      setScore(0);
      setContrast(1);
      if (contrastRef.current) {
        contrastRef.current.innerText = `${Math.floor(contrast * 100)}%`;
      }
      if (scoreRef.current) {
        scoreRef.current.innerText = hardMode ? `H ${score}` : score;
      }
      const tiles = gridRef.current.querySelectorAll(".tile .content");
      tiles.forEach(tile => setTile(tile));
      setTile(tiles[applePosition], {
        "background-color": color,
        "border-radius": "50%"
      });
      snakePositions.slice(1).forEach(i => {
        const snakePart = tiles[i];
        snakePart.style.backgroundColor = color;
        if (i === snakePositions[snakePositions.length - 1]) snakePart.style.left = 0;
        if (i === snakePositions[0]) snakePart.style.right = 0;
      });
    };
  
    const startGame = () => {
      setGameStarted(true);
      noteRef.current.style.opacity = 0;
      requestAnimationFrame(main);
    };
  
    const main = (timestamp) => {
      try {
        if (startTimestamp.current === undefined) startTimestamp.current = timestamp;
        const totalElapsedTime = timestamp - startTimestamp.current;
        const timeElapsedSinceLastCall = timestamp - lastTimestamp.current;
  
        const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);
        const percentageOfStep = (totalElapsedTime % speed) / speed;
  
        if (stepsTaken.current !== stepsShouldHaveTaken) {
          stepAndTransition(percentageOfStep);
          const headPosition = snakePositions[snakePositions.length - 1];
          if (headPosition === applePosition) {
            setScore(score + 1);
            if (scoreRef.current) {
              scoreRef.current.innerText = hardMode ? `H ${score + 1}` : score + 1;
            }
            addNewApple();
            setContrast(Math.min(1, contrast + contrastIncrease));
            console.log(`Contrast increased by ${contrastIncrease * 100}%`);
            console.log("New fade speed (from 100% to 0% in milliseconds)", Math.pow(fadeExponential.current, score) * fadeSpeed.current);
          }
          stepsTaken.current++;
        } else {
          transition(percentageOfStep);
        }
  
        if (lastTimestamp.current) {
          const contrastDecrease = timeElapsedSinceLastCall / (Math.pow(fadeExponential.current, score) * fadeSpeed.current);
          setContrast(prev => Math.max(0, prev - contrastDecrease));
        }
  
        if (contrastRef.current) {
          contrastRef.current.innerText = `${Math.floor(contrast * 100)}%`;
        }
        if (document.querySelector(".container")) {
          document.querySelector(".container").style.opacity = contrast;
        }
  
        requestAnimationFrame(main);
      } catch (error) {
        const pressSpaceToStart = "Press space to reset the game.";
        const changeMode = hardMode ? "Back to easy mode? Press the letter E." : "Ready for hard more? Press the letter H.";
        const followMe = 'Follow me <a href="https://twitter.com/HunorBorbely" , target="_top">@HunorBorbely</a>';
        if (noteRef.current) {
          noteRef.current.innerHTML = `${error.message}. ${pressSpaceToStart} <div>${changeMode}</div> ${followMe}`;
          noteRef.current.style.opacity = 1;
        }
        if (document.querySelector(".container")) {
          document.querySelector(".container").style.opacity = 1;
        }
      }
  
      lastTimestamp.current = timestamp;
    };
  
    const stepAndTransition = (percentageOfStep) => {
      const newHeadPosition = getNextPosition();
      console.log(`Snake stepping into tile ${newHeadPosition}`);
      setSnakePositions(prev => [...prev, newHeadPosition]);
  
      const tiles = gridRef.current.querySelectorAll(".tile .content");
      const previousTail = tiles[snakePositions[0]];
      setTile(previousTail);
  
      if (newHeadPosition !== applePosition) {
        setSnakePositions(prev => {
          const newSnake = [...prev];
          newSnake.shift();
          return newSnake;
        });
        const tail = tiles[snakePositions[0]];
        const tailDi = tailDirection();
        const tailValue = `${100 - percentageOfStep * 100}%`;
  
        if (tailDi === "right") setTile(tail, { left: 0, width: tailValue, "background-color": color });
        if (tailDi === "left") setTile(tail, { right: 0, width: tailValue, "background-color": color });
        if (tailDi === "down") setTile(tail, { top: 0, height: tailValue, "background-color": color });
        if (tailDi === "up") setTile(tail, { bottom: 0, height: tailValue, "background-color": color });
      }
  
      const previousHead = tiles[snakePositions[snakePositions.length - 2]];
      setTile(previousHead, { "background-color": color });
  
      const head = tiles[newHeadPosition];
      const headDi = getHeadDirection();
      const headValue = `${percentageOfStep * 100}%`;
  
      if (headDi === "right") setTile(head, { left: 0, width: headValue, "background-color": color });
      if (headDi === "left") setTile(head, { right: 0, width: headValue, "background-color": color });
      if (headDi === "down") setTile(head, { top: 0, height: headValue, "background-color": color });
      if (headDi === "up") setTile(head, { bottom: 0, height: headValue, "background-color": color });
    };
  
    const getHeadDirection = () => inputs[inputs.length - 1] || "right";
  
    const tailDirection = () => inputs[0] || "right";
  
    const addNewApple = () => {
      let newApplePosition;
      const snakePositionsSet = new Set(snakePositions);
      do {
        newApplePosition = Math.floor(Math.random() * (width * height));
      } while (snakePositionsSet.has(newApplePosition));
      setApplePosition(newApplePosition);
  
      const tiles = gridRef.current.querySelectorAll(".tile .content");
      setTile(tiles[newApplePosition], { "background-color": color, "border-radius": "50%" });
    };
  
    const getNextPosition = () => {
      const headPosition = snakePositions[snakePositions.length - 1];
      const direction = getHeadDirection();
      let nextPosition = headPosition;
      if (direction === "right") nextPosition += 1;
      if (direction === "left") nextPosition -= 1;
      if (direction === "down") nextPosition += width;
      if (direction === "up") nextPosition -= width;
  
      if (nextPosition < 0 || nextPosition >= width * height ||
          (direction === "left" && headPosition % width === 0) ||
          (direction === "right" && headPosition % width === width - 1)) {
        throw new Error("Game over");
      }
  
      return nextPosition;
    };
  
    const setTile = (tile, styles = {}) => {
      for (const [key, value] of Object.entries(styles)) {
        tile.style[key] = value;
      }
    };
  
    return (
    //   <div className="snake-game">
    //     <div className="container" ref={gridRef}></div>
    //     <div className="note" ref={noteRef}></div>
    //     <div className="score" ref={scoreRef}></div>
    //     <div className="contrast" ref={contrastRef}></div>
    //   </div>
    <>
      <div className="container" ref={gridRef}>
      <header>
        <div className="contrast" ref={contrastRef}>100%</div>
        <div className="score" ref={scoreRef}>0</div>
      </header>
        <div className="grid"></div>
        <footer>Press an arrow key or space to start!
            <div>Ready for hard more? Press H
            </div>
        </footer>
      </div>
    <a id="youtube" href="https://youtu.be/TAmYp4jKWoM" target="_top">
      <span>See how this game was made</span>
    </a>
    <div id="youtube-card">
      How to create a snake game with JavaScript
    </div>
    </>
    );
}
