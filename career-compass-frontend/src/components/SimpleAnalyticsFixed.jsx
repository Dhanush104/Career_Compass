import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart3, TrendingUp, Target, Trophy, Flame, Clock, 
    Award, Star, Brain, Activity, RefreshCw, Download
} from 'lucide-react';

const SimpleAnalyticsFixed = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Simplified mock data
    const data = {
        level: 8,
        totalXP: 3250,
        xpToNextLevel: 750,
        currentStreak: 12,
        longestStreak: 28,
        totalGoals: 15,
        completedGoals: 8,
        inProgress: 5,
        overdue: 2,
        completionRate: 78,
        totalTimeSpent: 240, // hours
        totalSessions: 156
    };

    const skills = [
        { name: 'React', level: 'Advanced', progress: 85, trend: 'up' },
        { name: 'JavaScript', level: 'Expert', progress: 92, trend: 'up' },
        { name: 'Node.js', level: 'Intermediate', progress: 68, trend: 'up' },
        { name: 'Python', level: 'Beginner', progress: 35, trend: 'stable' }
    ];

    const activities = [
        { type: 'Interview Practice', duration: 45, xp: 50, rating: 4.2, date: '2024-11-12' },
        { type: 'Coding Challenge', duration: 90, xp: 75, rating: 4.8, date: '2024-11-11' },
        { type: 'Goal Tracking', duration: 30, xp: 25, rating: 4.0, date: '2024-11-10' },
        { type: 'Resume Building', duration: 60, xp: 40, rating: 4.5, date: '2024-11-09' }
    ];

    const refreshData = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto p-6"
        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                            Analytics Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            Track your progress and achievements.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={refreshData}
                            disabled={loading}
                            className="btn btn-ghost"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="btn btn-outline">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'skills', label: 'Skills', icon: Brain },
                        { id: 'goals', label: 'Goals', icon: Target },
                        { id: 'activity', label: 'Activity', icon: Activity }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Level Section */}
                    <div className="card-hover p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center">
                                    <Trophy size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Level {data.level}
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        {data.totalXP.toLocaleString()} XP Total
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                    Next Level
                                </div>
                                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {data.xpToNextLevel} XP
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-4">
                            <div 
                                className="bg-gradient-to-r from-primary-500 to-accent-600 h-4 rounded-full transition-all duration-1000"
                                style={{ width: '65%' }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card-hover p-6 text-center">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Flame size={24} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                {data.currentStreak}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Day Streak</div>
                            <div className="text-xs text-neutral-500 mt-1">
                                Best: {data.longestStreak} days
                            </div>
                        </div>

                        <div className="card-hover p-6 text-center">
                            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Target size={24} className="text-success-600 dark:text-success-400" />
                            </div>
                            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                {data.completedGoals}/{data.totalGoals}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Goals Completed</div>
                            <div className="text-xs text-neutral-500 mt-1">
                                {data.completionRate}% completion rate
                            </div>
                        </div>

                        <div className="card-hover p-6 text-center">
                            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Clock size={24} className="text-warning-600 dark:text-warning-400" />
                            </div>
                            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                {data.totalTimeSpent}h
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Time Spent</div>
                            <div className="text-xs text-neutral-500 mt-1">
                                {data.totalSessions} sessions
                            </div>
                        </div>

                        <div className="card-hover p-6 text-center">
                            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <TrendingUp size={24} className="text-accent-600 dark:text-accent-400" />
                            </div>
                            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                {data.completionRate}%
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Completion Rate</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'skills' && (
                <div className="card-hover p-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                        Skills Progress
                    </h2>
                    <div className="space-y-4">
                        {skills.map((skill, index) => (
                            <div key={skill.name} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {skill.name}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {skill.level}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                        {skill.progress}%
                                    </span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${skill.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'goals' && (
                <div className="card-hover p-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Goal Statistics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Total Goals</span>
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                {data.totalGoals}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Completed</span>
                            <span className="font-bold text-success-600 dark:text-success-400">
                                {data.completedGoals}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">In Progress</span>
                            <span className="font-bold text-warning-600 dark:text-warning-400">
                                {data.inProgress}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Overdue</span>
                            <span className="font-bold text-error-600 dark:text-error-400">
                                {data.overdue}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'activity' && (
                <div className="card-hover p-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                                    <Activity size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {activity.type}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-success-600 dark:text-success-400 font-medium">
                                                +{activity.xp} XP
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-warning-500" />
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {activity.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                                        <span>{activity.duration} minutes</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Coming Soon */}
            <div className="mt-8 p-6 bg-gradient-to-r from-info-50 to-primary-50 dark:from-info-950/50 dark:to-primary-950/50 rounded-2xl border border-info-200 dark:border-info-800">
                <h3 className="text-lg font-bold text-info-900 dark:text-info-100 mb-2">🚀 More Analytics Coming Soon!</h3>
                <p className="text-info-700 dark:text-info-300">
                    We're working on advanced analytics including detailed performance metrics, 
                    learning insights, and personalized recommendations.
                </p>
            </div>
        </motion.div>
    );
};

export default SimpleAnalyticsFixed;
