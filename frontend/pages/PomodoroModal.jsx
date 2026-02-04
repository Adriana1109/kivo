import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, RotateCcw, X, Coffee, Brain, SkipForward } from "lucide-react";
import "./PomodoroModal.css";

export default function PomodoroModal() {
  const navigate = useNavigate();

  // Cargar configuración (o usar defaults)
  const getConfig = () => {
    const saved = localStorage.getItem("configPomodoro");
    return saved ? JSON.parse(saved) : {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: false,
      longBreakInterval: 4
    };
  };

  const [config] = useState(getConfig);

  // Estados de la sesión
  const [mode, setMode] = useState("focus"); // focus, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(config.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  // Audio ref (opcional, para futuro sonido)
  const timerRef = useRef(null);

  // Efecto para cambiar el tiempo cuando cambia el modo
  useEffect(() => {
    if (mode === "focus") setTimeLeft(config.focusTime * 60);
    else if (mode === "shortBreak") setTimeLeft(config.shortBreak * 60);
    else if (mode === "longBreak") setTimeLeft(config.longBreak * 60);
  }, [mode, config]);

  // Cronómetro
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }

    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (mode === "focus") {
      const newCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompleted);

      // Decidir siguiente modo
      if (newCompleted % config.longBreakInterval === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }

      // Auto-start si está configurado
      if (config.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Terminó el descanso, volver a focus
      setMode("focus");
      setIsRunning(false); // Normalmente requiere start manual para volver a trabajar
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "focus") setTimeLeft(config.focusTime * 60);
    else if (mode === "shortBreak") setTimeLeft(config.shortBreak * 60);
    else if (mode === "longBreak") setTimeLeft(config.longBreak * 60);
  };

  const skipTimer = () => {
    setIsRunning(false);
    handleTimerComplete();
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const getProgress = () => {
    const total = mode === "focus" ? config.focusTime * 60
      : mode === "shortBreak" ? config.shortBreak * 60
        : config.longBreak * 60;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="pomodoro-overlay">
      <div className={`pomodoro-box mode-${mode}`}>

        <div className="pomodoro-header">
          <div className="pomodoro-status">
            {mode === "focus" && <><Brain size={20} /> <span>Modo Focus</span></>}
            {mode === "shortBreak" && <><Coffee size={20} /> <span>Descanso Corto</span></>}
            {mode === "longBreak" && <><Coffee size={20} /> <span>Descanso Largo</span></>}
          </div>
          <button className="close-btn" onClick={() => navigate(-1)}>
            <X size={24} />
          </button>
        </div>

        <div className="timer-display">
          <svg className="progress-ring" width="280" height="280">
            <circle
              className="progress-ring__circle-bg"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
              fill="transparent"
              r="120"
              cx="140"
              cy="140"
            />
            <circle
              className="progress-ring__circle"
              stroke="white"
              strokeWidth="12"
              fill="transparent"
              r="120"
              cx="140"
              cy="140"
              style={{
                strokeDasharray: `${2 * Math.PI * 120}`,
                strokeDashoffset: `${2 * Math.PI * 120 * (1 - getProgress() / 100)}`,
                transition: "stroke-dashoffset 1s linear"
              }}
            />
          </svg>
          <div className="time-text">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="pomodoro-stats">
          <p>Sesión {pomodorosCompleted + 1} / {config.longBreakInterval} para descanso largo</p>
        </div>

        <div className="pomodoro-controls">
          <button className="control-btn secondary" onClick={toggleTimer}>
            {isRunning ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
          </button>

          <button className="control-btn secondary small" onClick={resetTimer} title="Reiniciar">
            <RotateCcw size={24} />
          </button>

          <button className="control-btn secondary small" onClick={skipTimer} title="Saltar">
            <SkipForward size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}
