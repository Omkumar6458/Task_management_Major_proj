import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'TODO',
    priority: task?.priority || 'MEDIUM',
    assignedToId: task?.assignedTo?.id || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAdmin()) {
      userService.getAllUsers().then(setUsers);
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'assignedToId' && value !== '' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
  <div className="w-full max-w-2xl rounded-2xl bg-[#0B1220] border border-slate-800 shadow-2xl">

    {/* Header */}
    <div className="text-center px-8 pt-8 pb-6">
      <h2 className="text-3xl font-extrabold text-white">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Fill in the task details below
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">

      {/* Title */}
      <div>
        <label className="form-label">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="input-field"
        />
        {errors.title && <p className="error-text">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task..."
          className="input-field resize-none"
        />
        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label className="form-label">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Assign To */}
      {isAdmin() && (
        <div>
          <label className="form-label">Assign To</label>
          <select
            name="assignedToId"
            value={formData.assignedToId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button className="btn-primary">
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default TaskForm;
