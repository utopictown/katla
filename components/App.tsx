import { useEffect, useRef, useState } from "react";

import Board from "./Board";
import Keyboard from "./Keyboard";

import { GameStats } from "../utils/types";
import { decode } from "../utils/codec";
import { getCongratulationMessage } from "../utils/message";
import { getTotalPlay } from "../utils/score";
import { Game } from "../utils/useGame";
import { trackEvent } from "../utils/tracking";

interface Props {
  game: Game;
  stats: GameStats;
  setStats: (stats: GameStats) => void;
  lastPlayDate: String;
  setLastPlayDate: (stats: String) => void;
  showMessage: (message: string, cb?: () => void) => void;
  showStats: () => void;
}

export default function App(props: Props) {
  const { game, stats, setStats, showMessage, showStats, lastPlayDate, setLastPlayDate } = props;
  const words = game.words;

  const [invalidAnswer, setInvalidAnswer] = useState(false);
  const isAnimating = useRef(null);

  
  const answer = decode(game.hash);
  
  function handlePressChar(char: string) {
    // ignore if already finished
    if (game.state.answers[game.state.attempt - 1] === answer) {
      return;
    }

    if (isAnimating.current) {
      return;
    }

    game.setState({
      answers: game.state.answers.map((answer, i) => {
        if (i === game.state.attempt && answer.length < 6) {
          return answer + char;
        }

        return answer;
      }),
      attempt: game.state.attempt,
    });
  }

  function handleBackspace() {
    if (isAnimating.current) {
      return;
    }

    game.setState({
      answers: game.state.answers.map((answer, i) => {
        if (i === game.state.attempt) {
          return answer.slice(0, -1);
        }

        return answer;
      }),
      attempt: game.state.attempt,
    });
  }

  function handleSubmit() {
    if (isAnimating.current) {
      return;
    }

    // ignore submission if the answer is already correct
    if (game.state.answers[game.state.attempt - 1] === answer) {
      return;
    }

    const userAnswer = game.state.answers[game.state.attempt];
    if (userAnswer.length < 6) {
      markInvalid();
      showMessage("Tidak cukup huruf");
      return;
    }

    if (!words.includes(userAnswer) && userAnswer !== "kontlo") {
      markInvalid();
      trackEvent("invalid_word", { word: userAnswer });
      showMessage("Tidak ada dalam KBBI");
      return;
    }

    setInvalidAnswer(false);
    game.setState({
      answers: game.state.answers.map((answer, i) => {
        if (i === game.state.attempt) {
          return userAnswer;
        }

        return answer;
      }),
      attempt: game.state.attempt + 1,
    });

    isAnimating.current = true;
    setTimeout(() => {
      isAnimating.current = false;

      if (answer === userAnswer) {
        trackEvent("succeed", { hash: game.hash });
        setStats({
          distribution: {
            ...stats.distribution,
            [game.state.attempt + 1]:
              stats.distribution[game.state.attempt + 1] + 1,
          },
          currentStreak: stats.currentStreak + 1,
          maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
        });
        const message = getCongratulationMessage(
          game.state.attempt,
          getTotalPlay(stats)
        );
        showMessage(message, () => {
          showStats();
        });
        setLastPlayDate(new Date().toLocaleDateString());
      } else if (game.state.attempt === 6) {
        trackEvent("failed", { hash: game.hash });
        setStats({
          distribution: {
            ...stats.distribution,
            fail: stats.distribution.fail + 1,
          },
          currentStreak: 0,
          maxStreak: stats.maxStreak,
        });

        showMessage(`Jawaban: ${answer}`, () => {
          showStats();
        });
      }
    }, 400 * 6);
  }

  function markInvalid() {
    setInvalidAnswer(true);
    setTimeout(() => {
      setInvalidAnswer(false);
    }, 600);
  }

  // auto resize board game to fit screen
  useEffect(() => {
    if (!game.ready) {
      return;
    }

    function handleResize() {
      const katla = document.querySelector("#katla") as HTMLDivElement;
      const height =
        window.innerHeight -
        document.querySelector("#header").getBoundingClientRect().height -
        document.querySelector("#keyboard").getBoundingClientRect().height;
      const width = window.innerWidth;
      katla.style.height = Math.min(height, width) + "px";
      katla.style.width = Math.min(height, width) + "px";
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [game.ready]);

  return (
    <>
      <div className="mx-auto max-w-full px-4 flex justify-center items-centerg grow-0 shrink">
        <Board
          hash={game.hash}
          gameState={game.state}
          invalidAnswer={invalidAnswer}
        />
      </div>
      <Keyboard
        gameState={game.state}
        hash={game.hash}
        onPressChar={handlePressChar}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        isAnimating={isAnimating}
      />
    </>
  );
}
