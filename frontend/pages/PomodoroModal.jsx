import { useState, useEffect } from "react";
import "./PomodoroModal.css";

export default function PomodoroModal({ onClose }) {

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            const next = !isBreak;
            setIsBreak(next);
            return next ? BREAK_TIME : WORK_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="pomodoro-overlay">

      <div className="pomodoro-box">

        <h2>{isBreak ? "Tiempo de descanso" : "Modo Focus"}</h2>

        <div className="pomodoro-time">
          {formatTime()}
        </div>

        <div className="pomodoro-buttons">

          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pausar" : "Iniciar"}
          </button>

          <button onClick={() => {
            setIsRunning(false);
            setIsBreak(false);
            setSeconds(WORK_TIME);
          }}>
            Reset
          </button>

          <button className="close-btn" onClick={onClose}>
            Cerrar
          </button>

        </div>

      </div>

    </div>
  );
}
