import { useState, useEffect, useCallback } from "react";
import FamilyActivityFeed from "../FamilyAccess/FamilyActivityFeed";
import PetContextCard from "../PetContextCard/PetContextCard";
import "./HomeDashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* WELLNESS SCORE RING (SVG) */
function ScoreRing({ score, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  let ringColor = "#ef4444"; // red
  if (score >= 70) ringColor = "#22c55e"; // green
  else if (score >= 30) ringColor = "#f59e0b"; // orange

  return (
    <svg className="score-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth={strokeWidth}
      />
      {/* Score arc */}
      <circle
        className="score-ring-progress"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
    </svg>
  );
}

/* MOOD INDICATOR */
function MoodFace({ mood }) {
  // Returns a simple animated face using CSS classes
  const moodClass = `mood-face mood-${mood}`;
  return (
    <div className={moodClass}>
      <div className="mood-eyes">
        <div className="mood-eye left"></div>
        <div className="mood-eye right"></div>
      </div>
      <div className="mood-mouth"></div>
    </div>
  );
}

/* TASK CARD */
function TaskCard({ task, petName, onComplete, onSkip, isAnimating }) {
  const isPending = task.status === "pending";
  const isCompleted = task.status === "completed";
  const isSkipped = task.status === "skipped";

  return (
    <div className={`task-card ${isCompleted ? "completed" : ""} ${isSkipped ? "skipped" : ""} ${isAnimating ? "success-bounce" : ""}`}>
      <div className="task-card-header">
        <div className="task-icon-wrap">
          <img
            src={`/assets/icons/${task.task_icon || task.icon || "icon-default"}.svg`}
            alt=""
            className="task-icon-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
        <div className="task-info">
          <h4 className="task-title">{task.task_title || task.title}</h4>
          <span className="task-time">{task.suggested_time}</span>
        </div>
        {isCompleted && (
          <div className="task-done-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {isSkipped && (
          <div className="task-skip-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}
      </div>

      {isPending && (
        <>
          <p className="task-question">{task.task_question || task.question}</p>
          <div className="task-actions">
            <button className="task-btn confirm" onClick={() => onComplete(task.task_id || task.id)}>
              {task.confirm_text}
            </button>
            <button className="task-btn skip" onClick={() => onSkip(task.task_id || task.id)}>
              {task.skip_text}
            </button>
          </div>
        </>
      )}

      {isCompleted && (
        <p className="task-status-text completed-text">Completed</p>
      )}
      {isSkipped && (
        <p className="task-status-text skipped-text">Skipped</p>
      )}
    </div>
  );
}

/* CONFETTI PARTICLES */
function ConfettiPaws({ show }) {
  if (!show) return null;
  // Generate small paw-shaped confetti particles using CSS
  const particles = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className="confetti-particle"
      style={{
        left: `${20 + Math.random() * 60}%`,
        animationDelay: `${Math.random() * 0.3}s`,
        animationDuration: `${0.6 + Math.random() * 0.4}s`,
      }}
    />
  ));
  return <div className="confetti-container">{particles}</div>;
}

/* MAIN HOME DASHBOARD */
export default function HomeDashboard({ activePetId, onManageFamilyClick }) {
  const [tasks, setTasks] = useState([]);
  const [wellness, setWellness] = useState({ score: 0, completed: 0, total: 0, mood: "neutral", message: "" });
  const [streak, setStreak] = useState({ current: 0, longest: 0, care_points: 0 });
  const [petName, setPetName] = useState("Your Pet");
  const [householdId, setHouseholdId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animatingTaskId, setAnimatingTaskId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTaskTitle, setCustomTaskTitle] = useState("");

  const handleCustomTaskSubmit = async (e) => {
    e.preventDefault();
    const title = customTaskTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(`${API_BASE}/api/daily-tasks/${activePetId}/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Failed to add custom task");
      const data = await res.json();

      if (data.task) {
        setTasks((prev) => [...prev, data.task]);
      }
      if (data.wellness) {
        setWellness(data.wellness);
      }
      if (data.streak) {
        setStreak(data.streak);
      }

      setIsModalOpen(false);
      setCustomTaskTitle("");
    } catch (err) {
      console.error("Error creating custom task:", err);
      alert("Could not save custom task. Please try again.");
    }
  };

  const fetchTasks = useCallback(async () => {
    if (!activePetId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/daily-tasks/${activePetId}/today`);
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();

      setTasks(data.tasks || []);
      setWellness(data.wellness || {});
      setStreak(data.streak || {});
      setPetName(data.pet_name || "Your Pet");
      setError("");

      // Resolve household_id from pet profile
      try {
        const petRes = await fetch(`${API_BASE}/api/pet-profile/${activePetId}`);
        if (petRes.ok) {
          const petData = await petRes.json();
          if (petData.household_id) {
            setHouseholdId(petData.household_id);
          }
        }
      } catch {
        // Non-fatal: activity feed just won't show
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activePetId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/api/daily-tasks/${activePetId}/complete/${taskId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to complete task");
      const data = await res.json();

      // Trigger animation
      setAnimatingTaskId(taskId);
      setTimeout(() => setAnimatingTaskId(null), 600);

      // Show confetti on completion
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);

      // Update state
      setWellness(data.wellness || wellness);
      setStreak(data.streak || streak);

      // Update task in list
      setTasks((prev) =>
        prev.map((t) =>
          (t.task_id || t.id) === taskId ? { ...t, status: "completed" } : t
        )
      );
    } catch (err) {
      console.error("Complete task error:", err);
    }
  };

  const handleSkip = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/api/daily-tasks/${activePetId}/skip/${taskId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to skip task");
      const data = await res.json();

      setWellness(data.wellness || wellness);

      setTasks((prev) =>
        prev.map((t) =>
          (t.task_id || t.id) === taskId ? { ...t, status: "skipped" } : t
        )
      );
    } catch (err) {
      console.error("Skip task error:", err);
    }
  };

  const allCompleted = tasks.length > 0 && tasks.every((t) => t.status !== "pending");
  const allDone = tasks.length > 0 && tasks.every((t) => t.status === "completed");

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <span>Loading your care dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchTasks}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      <PetContextCard />
      <ConfettiPaws show={showConfetti} />

      {/* WELLNESS HERO CARD */}
      <div className="wellness-hero">
        <div className="wellness-header">
          <h2 className="wellness-pet-name">{petName} Today</h2>
        </div>

        <div className="wellness-ring-area">
          <ScoreRing score={wellness.score} />
          <div className="wellness-center">
            <MoodFace mood={wellness.mood} />
          </div>
        </div>

        <div className="wellness-score-label">Wellness Score</div>
        <div className="wellness-score-value">{wellness.score}%</div>
        <div className="wellness-task-count">
          {wellness.completed} / {wellness.total} Tasks Completed
        </div>
        <p className="wellness-message">{wellness.message}</p>
      </div>

      {/* DAILY STREAK */}
      <div className="streak-card">
        <div className="streak-icon-wrap">
          <img
            src="/assets/icons/icon-flame.svg"
            alt="streak"
            className="streak-icon-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="streak-flame-glow"></div>
        </div>
        <div className="streak-info">
          <span className="streak-count">{streak.current} Day Care Streak</span>
          <span className="streak-points">{streak.care_points} Care Points</span>
        </div>
      </div>

      {/* TODAY'S CARE JOURNEY */}
      <div className="care-journey-section">
        <div className="care-journey-header">
          <h3 className="section-heading">Today's Care Journey</h3>
          <button className="add-task-trigger" onClick={() => setIsModalOpen(true)} title="Add custom task">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {allDone ? (
          <div className="all-done-card">
            <div className="all-done-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="all-done-title">{petName} had an amazing day!</h3>
            <p className="all-done-text">All care tasks completed. See you tomorrow.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.task_id || task.id}
                task={task}
                petName={petName}
                onComplete={handleComplete}
                onSkip={handleSkip}
                isAnimating={animatingTaskId === (task.task_id || task.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAMILY ACTIVITY FEED */}
      <FamilyActivityFeed householdId={householdId} onManageClick={onManageFamilyClick} />

      {/* CUSTOM TASK MODAL */}
      {isModalOpen && (
        <div className="custom-task-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="custom-task-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add Custom Task</h3>
            <form onSubmit={handleCustomTaskSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="e.g. Brush Teeth, Vet Checkup..."
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  maxLength={40}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn submit" disabled={!customTaskTitle.trim()}>
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
