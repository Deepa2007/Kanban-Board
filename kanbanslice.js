import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    { id: 1, title: 'Task 1', description: 'Description for task 1', columnId: 'todo' },
    { id: 2, title: 'Task 2', description: 'Description for task 2', columnId: 'in-progress' },
    { id: 3, title: 'Task 3', description: 'Description for task 3', columnId: 'peer-review' },
    { id: 4, title: 'Task 4', description: 'Description for task 4', columnId: 'done' },
  ],
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    moveTask: (state, action) => {
      const { taskId, fromColumnId, toColumnId } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task && task.columnId === fromColumnId) {
        task.columnId = toColumnId;
      }
    },
    addTask: (state, action) => {
      const { title, description } = action.payload;
      const newTask = {
        id: Date.now(),
        title,
        description,
        columnId: 'todo',
      };
      state.tasks.push(newTask);
    },
    searchTasks: (state, action) => {
      const query = action.payload.toLowerCase();
      state.tasks.forEach(task => {
        task.isVisible = task.title.toLowerCase().includes(query);
      });
    },
  },
});

export const { moveTask, addTask, searchTasks } = kanbanSlice.actions;
export default kanbanSlice.reducer;
