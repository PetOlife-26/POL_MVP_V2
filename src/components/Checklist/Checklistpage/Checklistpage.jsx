import { useState } from "react";
import BottomNav from "../BottomNav/BottomNav";
import "./ChecklistPage.css";
import TopNav from "../TopNav/TopNav";
import checklist from "./checklist.png";
import bottompet from "./bottom-pet.png";

const INITIAL_TASKS = [
  { id: 1, label: "Morning Walk",      time: "7:00 AM",  icon: "🐾", type: "walk",  yesLabel: "Yes, We Went",  noLabel: "Missed Today"    },
  { id: 2, label: "Change Water Bowl", time: "8:00 AM",  icon: "💧", type: "water", yesLabel: "Yes, Changed",  noLabel: "Forgot Today"    },
  { id: 3, label: "Morning Food",      time: "8:30 AM",  icon: "🍖", type: "food",  yesLabel: "Yes, Fed",      noLabel: "Missed Feeding"  },
  { id: 4, label: "Evening Walk",      time: "6:00 PM",  icon: "🌅", type: "walk",  yesLabel: "Yes, We Went",  noLabel: "Missed Today"    },
  { id: 5, label: "Evening Food",      time: "8:00 PM",  icon: "🍖", type: "food",  yesLabel: "Yes, Fed",      noLabel: "Missed Feeding"  },
  { id: 6, label: "Night Water Check", time: "10:00 PM", icon: "💧", type: "water", yesLabel: "Yes, Changed",  noLabel: "Forgot Today"    },
];

const TYPE_COLORS = {
  walk:  { bg: "#e8f5e9", accent: "#2e7d32" },
  water: { bg: "#e3f2fd", accent: "#1565c0" },
  food:  { bg: "#fff3e0", accent: "#e65100" },
};

function CircularProgress({ completed, total }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : completed / total;
  const dash = pct * circ;

  return (
    <div className="cp-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#d8e8d4" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke="#2e7d32"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div className="cp-label">
        <span className="cp-num">{completed}</span>
        <span className="cp-den">of {total}</span>
      </div>
    </div>
  );
}

export default function ChecklistPage({ onCalendarClick, onNavigate, onFabPress }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [status, setStatus] = useState({}); // { [id]: "yes" | "no" }
  const [showPopup, setShowPopup] = useState(false);
  const [pet, setPet] = useState(null);

const [newTask, setNewTask] = useState("");

const addTask = () => {
  if (!newTask.trim()) return;

  const task = {
    id: Date.now(),
    label: newTask,      
    icon: "✅",         // Default icon
    type: "walk",
    yesLabel: "Completed",
    noLabel: "Not Done",
  };

   setTasks((prev) => [task, ...prev]);

  setNewTask("");
  setShowPopup(false);
};
  const completed = Object.values(status).filter(v => v === "yes").length;

  const mark = (id, val) => {
    setStatus(prev => {
      const next = { ...prev };
      if (next[id] === val) delete next[id]; // toggle off
      else next[id] = val;
      return next;
    });
  };

  const motivational = completed === tasks.length
    ? "🎉 All done! Bruno is well cared for today."
    : completed >= tasks.length / 2
      ? "Great job! 🌿 Keep up the good care for Bruno."
      : "You're doing great! Keep going 💪";

  return (
    <div className="cl-page">
        <TopNav />


      {/* Pet card */}
      <div className="cl-fixed-top">
        <div className="cl-pet-card">
            <div className="cl-pet-info">
            <div className="cl-avatar">
            {pet?.image ? (
                <img src={pet.image} alt={pet.name} />
            ) : (
                "🐶"
            )}
            </div>
            <div>
                <h2 className="cl-pet-name">
                {pet?.name || "Add Pet"}
                <span className="cl-chevron">▾</span>
                </h2>

                <p className="cl-pet-breed">
                {pet?.breed || ""}
                </p>

                <p className="cl-pet-meta">
                {pet
                    ? `${pet.age} | ${pet.gender}`
                    : ""}
                </p>

            </div>
            </div>
            <div className="cl-pet-icon">
                <img src={checklist} className="cl-pet-image" alt="" />
            </div>
        </div>

        {/* Section label + add */}
            <div className="cl-section-row">

            <span className="cl-section-label">☀️ TODAY'S CHECKLIST</span>
                        
                <button
                className="cl-add-btn"
                onClick={() => setShowPopup(true)}
                >
                ＋ Add New Task
                </button>

            </div>
                {/* Progress footer */}
        <div className="cl-footer">
            <CircularProgress completed={completed} total={tasks.length} />
            <div className="cl-footer-text">
            <p className="cl-footer-msg">{motivational}</p>
            </div>
            <span className="cl-footer-dog">
                <img src={bottompet} className="bot-pet" />
            </span>
        </div>
    </div>

      {/* Task list */}
      <div className="cl-tasks">
        {tasks.map(task => {
          const colors = TYPE_COLORS[task.type];
          const yesActive = status[task.id] === "yes";
          const noActive  = status[task.id] === "no";

          return (
            <div key={task.id} className="cl-task-row">
              <div className="cl-task-icon-wrap" style={{ background: colors.bg }}>
                <span className="cl-task-icon">{task.icon}</span>
              </div>
              <div className="cl-task-meta">
                <span className="cl-task-name">{task.label}</span>

              </div>
              <div className="cl-task-btns">
                <button
                  className={`cl-task-btn cl-task-yes ${yesActive ? "active" : ""}`}
                  style={yesActive ? { background: colors.bg, borderColor: colors.accent, color: colors.accent } : {}}
                  onClick={() => mark(task.id, "yes")}
                >
                  <span className="cl-task-btn-icon">{task.icon}</span> {task.yesLabel}
                </button>
                <button
                  className={`cl-task-btn cl-task-no ${noActive ? "active" : ""}`}
                  onClick={() => mark(task.id, "no")}
                >
                  😕 {task.noLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>


        {showPopup && (
        <div className="popup-overlay">
            <div className="popup-card">
            <h2>Add New Task</h2>

            <input
                type="text"
                placeholder="Enter task name"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />

            <div className="popup-buttons">
                <button onClick={addTask}>Add</button>
                <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
            </div>
        </div>
        )}      

      <BottomNav active="checklist" onNavigate={onNavigate} onFabPress={onFabPress} />
    </div>
  );
}