import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { moveTask, addTask, searchTasks } from './redux/kanbanSlice';
import { TextField, Button, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Task = ({ task, moveTask }) => {
  const [, drag] = useDrag({
    type: 'TASK',
    item: task,
  });

  return (
    <Box
      ref={drag}
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        cursor: 'move',
      }}
    >
      <h3>{task.title}</h3>
      <p>{task.description.length > 50 ? task.description.slice(0, 50) + '...' : task.description}</p>
    </Box>
  );
};

const Column = ({ columnId, title, tasks, moveTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.columnId !== columnId) {
        moveTask(item.id, item.columnId, columnId);
      }
    },
  });

  return (
    <Box
      ref={drop}
      sx={{
        width: '250px',
        minHeight: '300px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <h2>{title}</h2>
      {tasks.map((task) => (
        task.isVisible && <Task key={task.id} task={task} moveTask={moveTask} />
      ))}
    </Box>
  );
};

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.kanban.tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = () => {
    dispatch(addTask(newTask));
    setNewTask({ title: '', description: '' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    dispatch(searchTasks(e.target.value));
  };

  const columns = ['todo', 'in-progress', 'peer-review', 'done'];

  return (
    <Box sx={{ padding: '20px' }}>
      <TextField
        label="Search Tasks"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ marginBottom: '20px', width: '100%' }}
      />
      <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {columns.map((columnId) => (
          <Column
            key={columnId}
            columnId={columnId}
            title={columnId.replace('-', ' ').toUpperCase()}
            tasks={tasks.filter(task => task.columnId === columnId)}
            moveTask={(taskId, fromColumnId, toColumnId) => dispatch(moveTask({ taskId, fromColumnId, toColumnId }))}
          />
        ))}
      </Box>
      <Box sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <IconButton onClick={() => setNewTask({ title: '', description: '' })}>
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanBoard />
    </DndProvider>
  );
}

export default App;
