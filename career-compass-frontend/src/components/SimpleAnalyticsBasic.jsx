import React, { useState } from 'react';
import { 
    BarChart3, TrendingUp, Target, Trophy, Flame, Clock, 
    Award, Star, Brain, Activity, RefreshCw, Download,
    Calendar, Users, Code, BookOpen, Zap, Eye, PieChart,
    ArrowUp, ArrowDown, Minus, ChevronRight, Filter,
    LineChart, BarChart, Gauge, Percent, Hash, Timer
} from 'lucide-react';

const SimpleAnalyticsBasic = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedSkill, setSelectedSkill] = useState(null);

    console.log('SimpleAnalyticsBasic rendering, activeTab:', activeTab);

    // Simple mock data
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
        totalTimeSpent: 240,
        totalSessions: 156
    };

    // Extended data structures
    const skills = [
        { name: 'React', level: 'Advanced', progress: 85, trend: 'up', hoursSpent: 120, projects: 8 },
        { name: 'JavaScript', level: 'Expert', progress: 92, trend: 'up', hoursSpent: 200, projects: 15 },
        { name: 'Node.js', level: 'Intermediate', progress: 68, trend: 'up', hoursSpent: 80, projects: 5 },
        { name: 'Python', level: 'Beginner', progress: 35, trend: 'stable', hoursSpent: 45, projects: 2 },
        { name: 'System Design', level: 'Intermediate', progress: 55, trend: 'up', hoursSpent: 60, projects: 3 },
        { name: 'AWS', level: 'Beginner', progress: 28, trend: 'down', hoursSpent: 30, projects: 1 }
    ];

    const achievements = [
        { title: 'Week Warrior', description: '7-day streak completed', xp: 100, date: '2024-11-12', rarity: 'common' },
        { title: 'Code Master', description: 'Solved 50 coding challenges', xp: 250, date: '2024-11-10', rarity: 'rare' },
        { title: 'Goal Crusher', description: 'Completed 5 goals this month', xp: 150, date: '2024-11-08', rarity: 'uncommon' },
        { title: 'Learning Streak', description: '30 consecutive days of learning', xp: 300, date: '2024-11-05', rarity: 'epic' }
    ];

    const weeklyProgress = [
        { day: 'Mon', hours: 2.5, xp: 150, sessions: 3 },
        { day: 'Tue', hours: 3.2, xp: 200, sessions: 4 },
        { day: 'Wed', hours: 1.8, xp: 120, sessions: 2 },
        { day: 'Thu', hours: 4.1, xp: 280, sessions: 5 },
        { day: 'Fri', hours: 2.9, xp: 180, sessions: 3 },
        { day: 'Sat', hours: 3.5, xp: 220, sessions: 4 },
        { day: 'Sun', hours: 2.2, xp: 140, sessions: 2 }
    ];

    const monthlyStats = [
        { month: 'Aug', completed: 12, total: 18 },
        { month: 'Sep', completed: 15, total: 20 },
        { month: 'Oct', completed: 18, total: 22 },
        { month: 'Nov', completed: 8, total: 15 }
    ];

    const skillCategories = [
        { name: 'Frontend', percentage: 35, color: 'bg-blue-500' },
        { name: 'Backend', percentage: 25, color: 'bg-green-500' },
        { name: 'DevOps', percentage: 15, color: 'bg-yellow-500' },
        { name: 'Design', percentage: 10, color: 'bg-purple-500' },
        { name: 'Other', percentage: 15, color: 'bg-gray-500' }
    ];

    const learningTrend = [
        { period: 'Week 1', value: 65 },
        { period: 'Week 2', value: 72 },
        { period: 'Week 3', value: 68 },
        { period: 'Week 4', value: 85 }
    ];

    const refreshData = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <ArrowUp size={14} className="text-success-500" />;
            case 'down': return <ArrowDown size={14} className="text-error-500" />;
            default: return <Minus size={14} className="text-neutral-400" />;
        }
    };

    const getAchievementColor = (rarity) => {
        switch (rarity) {
            case 'epic': return 'from-purple-500 to-purple-600';
            case 'rare': return 'from-accent-500 to-accent-600';
            case 'uncommon': return 'from-warning-500 to-warning-600';
            default: return 'from-primary-500 to-primary-600';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
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
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="input"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 3 months</option>
                            <option value="1y">Last year</option>
                        </select>
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
                        { id: 'activity', label: 'Activity', icon: Activity },
                        { id: 'achievements', label: 'Achievements', icon: Trophy },
                        { id: 'insights', label: 'Insights', icon: Eye }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    console.log('Tab clicked:', tab.id);
                                    setActiveTab(tab.id);
                                }}
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
            <div className="space-y-8">
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Overview</h2>
                        
                        {/* Level Section */}
                        <div className="card-hover p-6 mb-6">
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
                            </div>

                            <div className="card-hover p-6 text-center">
                                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Target size={24} className="text-success-600 dark:text-success-400" />
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {data.completedGoals}/{data.totalGoals}
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Goals Completed</div>
                            </div>

                            <div className="card-hover p-6 text-center">
                                <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Clock size={24} className="text-warning-600 dark:text-warning-400" />
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {data.totalTimeSpent}h
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Time Spent</div>
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

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            {/* Weekly Activity Chart */}
                            <div className="card-hover p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart size={20} className="text-primary-600" />
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                        Weekly Activity
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {weeklyProgress.map((day, index) => {
                                        const maxHours = Math.max(...weeklyProgress.map(d => d.hours));
                                        const heightPercentage = (day.hours / maxHours) * 100;
                                        return (
                                            <div key={day.day} className="flex items-end gap-3">
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-8">
                                                    {day.day}
                                                </span>
                                                <div className="flex-1 flex items-end h-16">
                                                    <div 
                                                        className="bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-md w-full transition-all duration-1000 flex items-end justify-center pb-1"
                                                        style={{ height: `${heightPercentage}%`, minHeight: '8px' }}
                                                    >
                                                        <span className="text-xs text-white font-medium">
                                                            {day.hours}h
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right w-16">
                                                    <div className="text-xs text-success-600 dark:text-success-400">
                                                        +{day.xp}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {day.sessions} sessions
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Skill Distribution Pie Chart */}
                            <div className="card-hover p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <PieChart size={20} className="text-accent-600" />
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                        Skill Distribution
                                    </h3>
                                </div>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="3"
                                            />
                                            {skillCategories.map((category, index) => {
                                                const offset = skillCategories.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0);
                                                const circumference = 100;
                                                const strokeDasharray = `${category.percentage} ${circumference - category.percentage}`;
                                                const strokeDashoffset = -offset;
                                                
                                                return (
                                                    <path
                                                        key={category.name}
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke={category.name === 'Frontend' ? '#3b82f6' : 
                                                               category.name === 'Backend' ? '#10b981' :
                                                               category.name === 'DevOps' ? '#f59e0b' :
                                                               category.name === 'Design' ? '#8b5cf6' : '#6b7280'}
                                                        strokeWidth="3"
                                                        strokeDasharray={strokeDasharray}
                                                        strokeDashoffset={strokeDashoffset}
                                                        className="transition-all duration-1000"
                                                    />
                                                );
                                            })}
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                    {skills.length}
                                                </div>
                                                <div className="text-xs text-neutral-500">Skills</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {skillCategories.map((category, index) => (
                                        <div key={category.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    category.name === 'Frontend' ? 'bg-blue-500' : 
                                                    category.name === 'Backend' ? 'bg-green-500' :
                                                    category.name === 'DevOps' ? 'bg-yellow-500' :
                                                    category.name === 'Design' ? 'bg-purple-500' : 'bg-gray-500'
                                                }`}></div>
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                {category.percentage}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Learning Progress Trend */}
                        <div className="card-hover p-6 mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <LineChart size={20} className="text-success-600" />
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    Learning Progress Trend
                                </h3>
                            </div>
                            <div className="flex items-end justify-between h-32 px-4">
                                {learningTrend.map((item, index) => {
                                    const maxValue = Math.max(...learningTrend.map(d => d.value));
                                    const heightPercentage = (item.value / maxValue) * 100;
                                    return (
                                        <div key={item.period} className="flex flex-col items-center flex-1">
                                            <div className="relative flex-1 flex items-end w-full max-w-16">
                                                <div 
                                                    className="bg-gradient-to-t from-success-500 to-success-300 rounded-t-lg w-full transition-all duration-1000 flex items-start justify-center pt-2"
                                                    style={{ height: `${heightPercentage}%`, minHeight: '20px' }}
                                                >
                                                    <span className="text-xs text-white font-medium">
                                                        {item.value}%
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                                                {item.period}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        <div className="card-hover p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Skills Progress
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-neutral-500" />
                                    <span className="text-sm text-neutral-500">All Skills</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {skills.map((skill, index) => (
                                    <div 
                                        key={skill.name} 
                                        className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl hover:bg-surface-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                                        onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center">
                                                    <Code size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {skill.name}
                                                    </h3>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {skill.level}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getTrendIcon(skill.trend)}
                                                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                                    {skill.progress}%
                                                </span>
                                                <ChevronRight size={16} className={`text-neutral-400 transition-transform ${selectedSkill === skill.name ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${skill.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {selectedSkill === skill.name && (
                                            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-neutral-700">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-neutral-500">Hours Practiced</span>
                                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{skill.hoursSpent}h</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-500">Projects</span>
                                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{skill.projects}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'goals' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                                {/* Goal Completion Gauge */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Completion Rate</span>
                                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{data.completionRate}%</span>
                                    </div>
                                    <div className="relative">
                                        <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-3">
                                            <div 
                                                className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-1000 relative"
                                                style={{ width: `${data.completionRate}%` }}
                                            >
                                                <div className="absolute right-0 top-0 w-3 h-3 bg-success-600 rounded-full transform translate-x-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Progress Chart */}
                            <div className="card-hover p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 size={20} className="text-warning-600" />
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Monthly Progress
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {monthlyStats.map((month, index) => {
                                        const completionPercentage = (month.completed / month.total) * 100;
                                        return (
                                            <div key={month.month} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                        {month.month}
                                                    </span>
                                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {month.completed}/{month.total}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-warning-500 to-warning-600 h-2 rounded-full transition-all duration-1000"
                                                            style={{ width: `${completionPercentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-neutral-500 w-10 text-right">
                                                        {Math.round(completionPercentage)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Goal Categories Visualization */}
                        <div className="card-hover p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Target size={20} className="text-primary-600" />
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Goal Categories
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'Career', count: 6, completed: 3, color: 'bg-blue-500' },
                                    { name: 'Learning', count: 4, completed: 3, color: 'bg-green-500' },
                                    { name: 'Technical', count: 3, completed: 1, color: 'bg-purple-500' },
                                    { name: 'Personal', count: 2, completed: 1, color: 'bg-orange-500' }
                                ].map((category, index) => {
                                    const percentage = (category.completed / category.count) * 100;
                                    return (
                                        <div key={category.name} className="text-center p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl">
                                            <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                                <Hash size={20} className="text-white" />
                                            </div>
                                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                                {category.name}
                                            </h4>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                                {category.completed}/{category.count} completed
                                            </div>
                                            <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-1.5">
                                                <div 
                                                    className={`${category.color} h-1.5 rounded-full transition-all duration-1000`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
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
                            {[
                                { type: 'Interview Practice', duration: 45, xp: 50, rating: 4.2, date: '2024-11-12' },
                                { type: 'Coding Challenge', duration: 90, xp: 75, rating: 4.8, date: '2024-11-11' },
                                { type: 'Goal Tracking', duration: 30, xp: 25, rating: 4.0, date: '2024-11-10' }
                            ].map((activity, index) => (
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

                {activeTab === 'achievements' && (
                    <div className="space-y-6">
                        <div className="card-hover p-6">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                                Recent Achievements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {achievements.map((achievement, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl text-center hover:scale-105 transition-transform"
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-br ${getAchievementColor(achievement.rarity)} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                                            <Trophy size={24} className="text-white" />
                                        </div>
                                        <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                            {achievement.title}
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                            {achievement.description}
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-sm">
                                            <span className="text-success-600 dark:text-success-400 font-medium">
                                                +{achievement.xp} XP
                                            </span>
                                            <span className="text-neutral-500">
                                                {new Date(achievement.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                achievement.rarity === 'rare' ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300' :
                                                achievement.rarity === 'uncommon' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' :
                                                'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                            }`}>
                                                {achievement.rarity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card-hover p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    Weekly Progress
                                </h3>
                                <div className="space-y-3">
                                    {weeklyProgress.map((day, index) => (
                                        <div key={day.day} className="flex items-center justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400 w-12">{day.day}</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full transition-all duration-1000"
                                                        style={{ width: `${(day.hours / 4) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {day.hours}h
                                                </span>
                                                <div className="text-xs text-success-600 dark:text-success-400">
                                                    +{day.xp} XP
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card-hover p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    Performance Insights
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Best Performance Time</span>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            Morning (9-11 AM)
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Most Active Day</span>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            Thursday
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Avg Session Length</span>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            52 min
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Productivity Score</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-success-600 dark:text-success-400">
                                                82%
                                            </span>
                                            <TrendingUp size={16} className="text-success-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-hover p-6">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                AI Recommendations
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'Focus on System Design skills - showing good progress',
                                    'Consider setting more technical goals for better balance',
                                    'Your morning sessions are 23% more productive',
                                    'Try to maintain consistency in weekend learning'
                                ].map((recommendation, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-info-50 dark:bg-info-950/50 rounded-lg border border-info-200 dark:border-info-800"
                                    >
                                        <Zap size={16} className="text-info-600 dark:text-info-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-info-800 dark:text-info-200">
                                            {recommendation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Coming Soon */}
            <div className="mt-8 p-6 bg-gradient-to-r from-info-50 to-primary-50 dark:from-info-950/50 dark:to-primary-950/50 rounded-2xl border border-info-200 dark:border-info-800">
                <h3 className="text-lg font-bold text-info-900 dark:text-info-100 mb-2">🚀 More Analytics Coming Soon!</h3>
                <p className="text-info-700 dark:text-info-300">
                    We're working on advanced analytics including detailed performance metrics, 
                    learning insights, and personalized recommendations.
                </p>
            </div>
        </div>
    );
};

export default SimpleAnalyticsBasic;
