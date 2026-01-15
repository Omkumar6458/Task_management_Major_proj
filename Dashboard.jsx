import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { taskService } from '../services/taskService';

import { notificationService } from '../services/notificationService';


const Dashboard = () => {
    const { user, isAdmin } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0
    });

    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
        fetchNotifications();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await (isAdmin()
                ? taskService.getAllTasks()
                : taskService.getMyTasks());

            setTasks(data || []);
            calculateStats(data || []);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setNotifLoading(false);
        }
    };

    const calculateStats = (tasksData) => {
        setStats({
            total: tasksData.length,
            todo: tasksData.filter(t => t.status === 'TODO').length,
            inProgress: tasksData.filter(t => t.status === 'IN_PROGRESS').length,
            done: tasksData.filter(t => t.status === 'DONE').length
        });
    };

    return (
        <div className="dashboard-container">
            <Navbar />

            <div className="max-w-7xl mx-auto mt-10">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-white tracking-tight">
                        Hii,
                        <span className="gradient-text"> {user?.username}</span>! 👋
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mt-2">
                        {isAdmin()
                            ? 'Administrator Control Center'
                            : 'Your productivity at a glance'}
                    </p>
                </div>
             
                {/* Stats Grid */}
                {/*  
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard label="Total Tasks" value={stats.total} icon="📋" color="blue" />
                    <StatCard label="To Do" value={stats.todo} icon="📝" color="blue" />
                    <StatCard label="In Progress" value={stats.inProgress} icon="⚡" color="saffron" />
                    <StatCard label="Completed" value={stats.done} icon="✅" color="green" />
                </div>
                */}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Activity List */}
                    <div className="lg:col-span-2 clean-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                Recent Activity
                            </h2>
                            <Link
                                to="/tasks"
                                className="text-sm font-bold text-blue-400 hover:text-blue-300"
                            >
                                View All →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                            </div>
                        ) : tasks.length > 0 ? (
                            <div className="space-y-4">
                                {tasks.slice(0, 5).map(task => (
                                    <div
                                        key={task.id}
                                        className="p-5 border border-slate-700/50 rounded-2xl hover:bg-slate-800/50 transition-all"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-100">
                                                    {task.title}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {task.description}
                                                </p>
                                            </div>
                                            <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-10">
                                No tasks found.
                            </p>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">

                        {/* Quick Actions */}
                        <div className="clean-card p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Quick Actions
                            </h2>

                            <div className="flex flex-col gap-4">
                                <Link to="/tasks?action=create" className="btn-primary text-center">
                                    + Create New Task
                                </Link>
                                <Link to="/tasks" className="btn-secondary text-center">
                                    All Tasks
                                </Link>
                                {isAdmin() && (
                                    <Link to="/users" className="btn-secondary text-center">
                                       User List
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="clean-card p-6">
                            <h2 className="text-xl font-bold text-white mb-4">
                                Notifications 🔔
                            </h2>

                            {notifLoading ? (
                                <p className="text-slate-400 text-sm">Loading...</p>
                            ) : notifications.length === 0 ? (
                                <p className="text-slate-500 text-sm">
                                    No notifications
                                </p>
                            ) : (
                                <ul className="space-y-3 max-h-64 overflow-y-auto">
                                    {notifications.slice(0, 5).map(n => (
                                        <li
                                            key={n.id}
                                            className="p-3 rounded-xl bg-slate-800/60 border border-slate-700"
                                        >
                                            <p className="text-slate-200 text-sm">
                                                {n.message}
                                            </p>
                                            <span className="text-xs text-slate-400">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* System Status */}
                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 border border-indigo-500/30">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">
                                System Status
                            </p>
                            <h4 className="text-white font-bold mt-1">
                                All Systems Operational
                            </h4>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------- StatCard Component ---------- */

const StatCard = ({ label, value, icon, color }) => {
    const themes = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        saffron: "bg-orange-500/10 text-[#FF9933] border-orange-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20"
    };

    return (
        <div className="clean-card p-6 hover:-translate-y-1 transition-all">
            <div className="flex justify-between">
                <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                        {label}
                    </p>
                    <p className="text-4xl font-black text-white mt-1">
                        {value}
                    </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${themes[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
