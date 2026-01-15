import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const { user, isAdmin } = useAuth();

    const canEdit = isAdmin() || task.createdBy?.id === user?.id;
    const canDelete = isAdmin();

    const getStatusBadge = (status) => {
        const badges = {
            TODO: 'badge-todo',
            IN_PROGRESS: 'badge-in-progress',
            DONE: 'badge-done',
        };
        return badges[status] || 'badge-todo';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            LOW: 'badge-low',
            MEDIUM: 'badge-medium',
            HIGH: 'badge-high',
        };
        return badges[priority] || 'badge-medium';
    };

    return (
        /* Switched 'glass' to 'clean-card' for theme consistency */
        <div className="clean-card p-6 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[#FF9933] transition-colors">
                    {task.title}
                </h3>
                <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <span className={`badge ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>
            </div>

            <p className="text-slate-400 mb-6 line-clamp-3 text-sm flex-grow">
                {task.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                <div className="text-[11px] uppercase tracking-wider font-bold">
                    <p className="text-slate-500">
                        By: <span className="text-blue-400">{task.createdBy?.username}</span>
                    </p>
                    {task.assignedTo && (
                        <p className="text-slate-500">
                            To: <span className="text-[#FF9933]">{task.assignedTo.username}</span>
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    {canEdit && (
                        <button
                            onClick={() => onEdit(task)}
                            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                            title="Edit Task"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete Task"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;