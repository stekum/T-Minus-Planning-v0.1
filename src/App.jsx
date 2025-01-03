import React, { useState, useEffect, useRef } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ConfigModal from './components/ConfigModal';

const teamMembers = ['Gemeinsam', 'Vera', 'Stefan', 'Alex', 'tbd'];

const EditableTitle = ({ initialTitle, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="inline-block">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="text-2xl font-bold p-1 border rounded"
          style={{ width: Math.max(200, title.length * 12) + 'px' }}
        />
      </form>
    );
  }

  return (
    <h1 
      className="text-2xl font-bold mb-4 hover:bg-gray-100 p-1 rounded cursor-pointer"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {title}
    </h1>
  );
};

const TaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [team, setTeam] = useState(teamMembers[0]);

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
      setTeam(teamMembers[0]);
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
};

const Timeline = ({ targetDate }) => {
  if (!targetDate) return null;

  const generateTimelineData = () => {
    const days = [];
    let currentDate = new Date(targetDate);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        label: format(date, 'EEE, dd.MM.'),
        tMinus: i
      });
    }
    
    return days;
  };

  const days = generateTimelineData();

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
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`timeline-phase ${index % 2 === 0 ? 'bg-cyan-400' : 'bg-lime-400'}`}
          >
            T-{day.tMinus}
          </div>
        ))}
      </div>
    </>
  );
};

const Swimlane = ({ member, tasks, onDeleteTask, onEditTask, startDate }) => {
  const calculateTaskPosition = (task) => {
    const taskDate = new Date(task.dueDate);
    const dayIndex = Math.floor((taskDate - startDate) / (1000 * 60 * 60 * 24));
    return `${dayIndex * (100 + 8)}px`;
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
              <button onClick={() => onEditTask(task)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" title="Edit task">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => onDeleteTask(task.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Delete task">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="swimlane-separator"></div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'T-Minus Plan AWS Antrag V1',
    targetDate: new Date('2025-01-31T15:09:00').toISOString().slice(0, 16),
    teamMembers: ['Gemeinsam', 'Vera', 'Stefan', 'Alex', 'tbd'],
    theme: 'default',
    showWeekends: true
  });

  const startDate = new Date(config.targetDate);
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

  const handleConfigSave = (newConfig) => {
    setConfig(newConfig);
  };

  const calculateOverallProgress = () => {
    if (!config.targetDate) return 0;
    const targetDate = new Date(config.targetDate);
    const totalSeconds = differenceInSeconds(targetDate, new Date());
    const elapsedSeconds = differenceInSeconds(new Date(), new Date());
    return Math.max(0, Math.min(100, (elapsedSeconds / totalSeconds) * 100));
  };

  return (
    <div className="app-container">
      <div className="flex justify-between items-center mb-4">
        <EditableTitle 
          initialTitle={config.title} 
          onSave={(title) => setConfig({ ...config, title })}
        />
        <button
          onClick={() => setIsConfigOpen(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Configure Plan
        </button>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl">Target Date: {new Date(config.targetDate).toLocaleString()}</h2>
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
        <Timeline targetDate={new Date(config.targetDate)} showWeekends={config.showWeekends} />
        <div className="swimlanes">
          {config.teamMembers.map((member) => (
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
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSave={handleConfigSave}
      />
    </div>
  );
};

export default App;
