import React, { useState } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const teamMembers = ['Gemeinsam', 'Vera', 'Stefan', 'Alex', 'tbd'];

function TaskForm({ onAddTask }) {
  const [taskName, setTaskName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [team, setTeam] = useState('Gemeinsam');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName && dueDate) {
      onAddTask({
        name: taskName,
        subtitle,
        dueDate,
        team,
        id: Date.now()
      });
      setTaskName('');
      setSubtitle('');
      setDueDate('');
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="border p-1 rounded"
      />
      <input
        type="text"
        placeholder="Subtitle (optional)"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="border p-1 rounded"
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-1 rounded"
      />
      <select
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        className="border p-1 rounded"
      >
        {teamMembers.map(member => (
          <option key={member} value={member}>{member}</option>
        ))}
      </select>
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </div>
  );
}

function Timeline({ targetDate }) {
  if (!targetDate) return null;

  const generateTimelineData = () => {
    const days = [];
    const phases = [];
    let currentDate = new Date(targetDate);
    
    // Generate 30 days backwards from target date
    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        label: format(date, 'EEE, dd.MM.')
      });
    }

    // Calculate T-minus phases
    for (let i = 29; i >= 0; i -= 3) {
      phases.push({
        tMinus: i,
        isEven: Math.floor(i / 3) % 2 === 0
      });
    }
    
    return { days, phases };
  };

  const { days, phases } = generateTimelineData();

  return (
    <>
      <div className="timeline-dates">
        <div className="timeline-date-label"></div>
        {days.map((day, index) => (
          <div key={index} className="timeline-date">
            {day.label}
          </div>
        ))}
      </div>
      <div className="timeline-phases">
        <div className="timeline-phase-label"></div>
        {phases.map((phase, index) => (
          <div 
            key={index} 
            className={`timeline-phase ${phase.isEven ? 'bg-cyan-400' : 'bg-lime-400'}`}
          >
            T-{phase.tMinus}
          </div>
        ))}
      </div>
    </>
  );
}

function Swimlane({ member, tasks, onDeleteTask, onEditTask, startDate }) {
  const calculateTaskPosition = (task) => {
    const taskDate = new Date(task.dueDate);
    const dayIndex = Math.floor((taskDate - startDate) / (1000 * 60 * 60 * 24));
    return `${dayIndex * (100 + 8)}px`; // 100px is the minimum column width, 8px for gap
  };

  return (
    <div className="swimlane">
      <div className="swimlane-header">{member}</div>
      <div className="swimlane-content">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="task-card"
            style={{
              left: calculateTaskPosition(task)
            }}
          >
            <h4 className="text-sm font-medium">{task.name}</h4>
            {task.subtitle && <p className="text-xs text-gray-600">{task.subtitle}</p>}
            <div className="flex gap-1 mt-2">
              <button onClick={() => onEditTask(task)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Edit</button>
              <button onClick={() => onDeleteTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [targetDate] = useState(new Date('2025-01-31T15:09:00'));
  const startDate = new Date(targetDate);
  startDate.setDate(startDate.getDate() - 29);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (task) => {
    setTasks(tasks.map(t =>
      t.id === task.id ? { ...t, ...task } : t
    ));
  };

  const calculateOverallProgress = () => {
    if (!targetDate) return 0;
    const totalSeconds = differenceInSeconds(targetDate, new Date());
    const elapsedSeconds = differenceInSeconds(new Date(), new Date());
    return Math.max(0, Math.min(100, (elapsedSeconds / totalSeconds) * 100));
  };

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold mb-4">T-Minus Plan AWS Antrag V1</h1>
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl">Target Date: {targetDate.toLocaleString()}</h2>
          <div style={{ width: 40, height: 40 }}>
            <CircularProgressbar
              value={calculateOverallProgress()}
              text={`${Math.round(calculateOverallProgress())}%`}
              styles={buildStyles({
                textSize: '1.5rem',
                pathColor: `rgba(62, 152, 199, ${calculateOverallProgress() / 100})`,
                textColor: '#3e98c7',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
        </div>
        <TaskForm onAddTask={handleAddTask} />
      </div>
      <div className="timeline-container">
        <Timeline targetDate={targetDate} />
        <div className="swimlanes">
          {teamMembers.map((member) => (
            <Swimlane
              key={member}
              member={member}
              tasks={tasks.filter(task => task.team === member)}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              startDate={startDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
