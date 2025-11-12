import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart3, TrendingUp, Target, Trophy, Fire, Clock, Calendar, 
    Award, Star, Zap, Brain, Users, Code, BookOpen, MessageCircle,
    ChevronDown, ChevronUp, Filter, Download, RefreshCw, Eye,
    Activity, PieChart, LineChart, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

const SimpleAnalytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('7d');
    const [loading, setLoading] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        skills: true,
        goals: true,
        activity: true
    });

    // Mock data with realistic values
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            level: 8,
            totalXP: 3250,
            xpToNextLevel: 750,
            currentStreak: 12,
            longestStreak: 28,
            totalTimeSpent: 14400, // minutes
            totalSessions: 156,
            completionRate: 78,
            averageSessionTime: 45
        },
        goals: {
            total: 15,
            completed: 8,
            inProgress: 5,
            overdue: 2,
            completionRate: 53,
            averageCompletionTime: 18, // days
            categories: [
                { name: 'Career', count: 6, completed: 3 },
                { name: 'Learning', count: 4, completed: 3 },
                { name: 'Technical', count: 3, completed: 1 },
                { name: 'Personal', count: 2, completed: 1 }
            ]
        },
        skills: [
            { name: 'React', level: 'Advanced', progress: 85, hoursSpent: 120, trend: 'up' },
            { name: 'JavaScript', level: 'Expert', progress: 92, hoursSpent: 200, trend: 'up' },
            { name: 'Node.js', level: 'Intermediate', progress: 68, hoursSpent: 80, trend: 'up' },
            { name: 'Python', level: 'Beginner', progress: 35, hoursSpent: 45, trend: 'stable' },
            { name: 'System Design', level: 'Intermediate', progress: 55, hoursSpent: 60, trend: 'up' },
            { name: 'AWS', level: 'Beginner', progress: 28, hoursSpent: 30, trend: 'down' }
        ],
        activities: [
            { date: '2024-11-12', type: 'Interview Practice', duration: 45, xp: 50, rating: 4.2 },
            { date: '2024-11-11', type: 'Coding Challenge', duration: 90, xp: 75, rating: 4.8 },
            { date: '2024-11-10', type: 'Goal Tracking', duration: 30, xp: 25, rating: 4.0 },
            { date: '2024-11-09', type: 'Resume Building', duration: 60, xp: 40, rating: 4.5 },
            { date: '2024-11-08', type: 'Learning', duration: 120, xp: 100, rating: 4.7 }
        ],
        achievements: [
            { title: 'Week Warrior', description: '7-day streak completed', xp: 100, date: '2024-11-12', rarity: 'common' },
            { title: 'Code Master', description: 'Solved 50 coding challenges', xp: 250, date: '2024-11-10', rarity: 'rare' },
            { title: 'Goal Crusher', description: 'Completed 5 goals this month', xp: 150, date: '2024-11-08', rarity: 'uncommon' }
        ],
        insights: {
            bestPerformanceTime: 'Morning (9-11 AM)',
            mostActiveDay: 'Tuesday',
            averageSessionLength: 52,
            productivityScore: 82,
            recommendations: [
                'Focus on System Design skills - showing good progress',
                'Consider setting more technical goals',
                'Your morning sessions are 23% more productive'
            ]
        }
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const refreshData = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
        }, 1000);
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
            case 'rare': return 'from-accent-500 to-accent-600';
            case 'uncommon': return 'from-warning-500 to-warning-600';
            default: return 'from-primary-500 to-primary-600';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto p-6"
        >
            {/* Header with Controls */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                            Analytics Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            Comprehensive insights into your learning journey and progress.
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

            {/* Dynamic Content Based on Active Tab */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Level and XP Section */}
                        <div className="card-hover p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center">
                                        <Trophy size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                            Level {analyticsData.overview.level}
                                        </h2>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            {analyticsData.overview.totalXP.toLocaleString()} XP Total
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                        Next Level
                                    </div>
                                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {analyticsData.overview.xpToNextLevel} XP
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-4">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(analyticsData.overview.totalXP % 1000) / 10}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="bg-gradient-to-r from-primary-500 to-accent-600 h-4 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card-hover p-6 text-center">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Fire size={24} className="text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {analyticsData.overview.currentStreak}
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Day Streak</div>
                                <div className="text-xs text-neutral-500 mt-1">
                                    Best: {analyticsData.overview.longestStreak} days
                                </div>
                            </div>

                            <div className="card-hover p-6 text-center">
                                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Target size={24} className="text-success-600 dark:text-success-400" />
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {analyticsData.goals.completed}/{analyticsData.goals.total}
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Goals Completed</div>
                                <div className="text-xs text-neutral-500 mt-1">
                                    {analyticsData.goals.completionRate}% completion rate
                                </div>
                            </div>

                            <div className="card-hover p-6 text-center">
                                <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Clock size={24} className="text-warning-600 dark:text-warning-400" />
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {Math.round(analyticsData.overview.totalTimeSpent / 60)}h
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Time Spent</div>
                                <div className="text-xs text-neutral-500 mt-1">
                                    {analyticsData.overview.totalSessions} sessions
                                </div>
                            </div>

                            <div className="card-hover p-6 text-center">
                                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp size={24} className="text-accent-600 dark:text-accent-400" />
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {analyticsData.overview.completionRate}%
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Completion Rate</div>
                                <div className="text-xs text-neutral-500 mt-1">
                                    Avg: {analyticsData.overview.averageSessionTime}min/session
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'skills' && (
                    <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="card-hover p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Skills Progress
                                </h2>
                                <button
                                    onClick={() => toggleSection('skills')}
                                    className="btn btn-ghost"
                                >
                                    {expandedSections.skills ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {analyticsData.skills.map((skill, index) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl"
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
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.progress}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                    className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {skill.hoursSpent}h practiced
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'goals' && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card-hover p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    Goal Statistics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Total Goals</span>
                                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {analyticsData.goals.total}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Completed</span>
                                        <span className="font-bold text-success-600 dark:text-success-400">
                                            {analyticsData.goals.completed}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">In Progress</span>
                                        <span className="font-bold text-warning-600 dark:text-warning-400">
                                            {analyticsData.goals.inProgress}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Overdue</span>
                                        <span className="font-bold text-error-600 dark:text-error-400">
                                            {analyticsData.goals.overdue}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-hover p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    Goals by Category
                                </h3>
                                <div className="space-y-3">
                                    {analyticsData.goals.categories.map((category, index) => (
                                        <div key={category.name} className="flex items-center justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">
                                                {category.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-neutral-500">
                                                    {category.completed}/{category.count}
                                                </span>
                                                <div className="w-16 h-2 bg-surface-200 dark:bg-neutral-700 rounded-full">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(category.completed / category.count) * 100}%` }}
                                                        transition={{ duration: 1, delay: index * 0.1 }}
                                                        className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'activity' && (
                    <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="card-hover p-6">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {analyticsData.activities.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl"
                                    >
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
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'achievements' && (
                    <motion.div
                        key="achievements"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="card-hover p-6">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                                Recent Achievements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {analyticsData.achievements.map((achievement, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl text-center"
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
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'insights' && (
                    <motion.div
                        key="insights"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card-hover p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    Performance Insights
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Best Performance Time</span>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {analyticsData.insights.bestPerformanceTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Most Active Day</span>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {analyticsData.insights.mostActiveDay}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Avg Session Length</span>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {analyticsData.insights.averageSessionLength} min
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Productivity Score</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-success-600 dark:text-success-400">
                                                {analyticsData.insights.productivityScore}%
                                            </span>
                                            <TrendingUp size={16} className="text-success-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-hover p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    AI Recommendations
                                </h3>
                                <div className="space-y-3">
                                    {analyticsData.insights.recommendations.map((recommendation, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3 p-3 bg-info-50 dark:bg-info-950/50 rounded-lg border border-info-200 dark:border-info-800"
                                        >
                                            <Zap size={16} className="text-info-600 dark:text-info-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-info-800 dark:text-info-200">
                                                {recommendation}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Coming Soon Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-info-50 to-primary-50 dark:from-info-950/50 dark:to-primary-950/50 rounded-2xl border border-info-200 dark:border-info-800">
                <h3 className="text-lg font-bold text-info-900 dark:text-info-100 mb-2 flex items-center gap-2">
                    <Zap size={20} />
                    Advanced Analytics Coming Soon!
                </h3>
                <p className="text-info-700 dark:text-info-300 mb-4">
                    We're working on advanced features including predictive analytics, 
                    detailed performance trends, and personalized learning paths.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-info-600 dark:text-info-400">
                        <LineChart size={16} />
                        <span>Trend Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-info-600 dark:text-info-400">
                        <PieChart size={16} />
                        <span>Skill Breakdown</span>
                    </div>
                    <div className="flex items-center gap-2 text-info-600 dark:text-info-400">
                        <Users size={16} />
                        <span>Peer Comparison</span>
                    </div>
                    <div className="flex items-center gap-2 text-info-600 dark:text-info-400">
                        <Brain size={16} />
                        <span>AI Coaching</span>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default SimpleAnalytics;
