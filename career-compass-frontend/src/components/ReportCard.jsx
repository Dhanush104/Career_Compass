// src/components/ReportCard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
    Github, Linkedin, BarChart2, Loader2, AlertTriangle, 
    CheckCircle, ExternalLink, User, Users, Book, 
    Star, Clock, Briefcase, Sparkles, ServerCrash,
    ChevronRight, ChevronDown, Zap, Code, GitBranch, GitCommit,
    GitPullRequest, GitMerge, GitCommitHorizontal, GitFork, GitCompareArrows,
    TrendingUp, Award, Trophy, BarChart3, PieChart, LineChart
} from 'lucide-react';
// import { useTheme } from '../context/ThemeContext';

// Main Component
const ReportCard = ({ user, onUpdate, onNavigate }) => {
    // const { theme } = useTheme();
    console.log('🔍 ReportCard received user:', user);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        github: true,
        linkedin: true,
        skills: true,
        recommendations: true
    });
    
    const { reportCard, githubUrl, linkedInUrl } = user || {};
    const status = reportCard?.status || 'not-generated';
    
    // Auto-expand sections based on status
    useEffect(() => {
        if (status === 'completed') {
            setExpandedSections({
                github: true,
                linkedin: true,
                skills: true,
                recommendations: true
            });
        }
    }, [status]);
    
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleGenerateReport = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
            toast.error('Please log in to generate a report');
            setIsLoading(false);
            return;
        }

        try {
            console.log('🚀 Starting report generation...');
            const response = await fetch('http://localhost:5000/api/report-card/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('📥 Report generation response:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to start report generation.');
            }

            // The backend returns the user with status: 'pending'
            if (onUpdate) {
                onUpdate(data.user);
            }
            toast.success(data.message || 'Report generation started!');
        } catch (error) {
            console.error('❌ Report generation error:', error);
            toast.error(error.message || 'Failed to generate report');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    // Render component based on user/report status
    const renderContent = () => {
        // State 1: Missing Profile URLs
        if (!githubUrl || !linkedInUrl) {
            return (
                <EmptyState
                    icon={AlertTriangle}
                    title="Profile Links Missing"
                    message="Please add your GitHub and LinkedIn URLs to your profile page to generate a report."
                    buttonText="Go to Profile"
                    onClick={() => onNavigate && onNavigate('profile')}
                />
            );
        }

        // State 2: Pending
        if (status === 'pending' || isLoading) {
            return (
                <EmptyState
                    icon={Loader2}
                    title="Report Generation in Progress..."
                    message="We're analyzing your profiles. This may take up to a minute. You can leave this page and check back later."
                    isPending={true}
                />
            );
        }

        // State 3: Failed
        if (status === 'failed') {
            return (
                <EmptyState
                    icon={ServerCrash}
                    title="Report Generation Failed"
                    message={reportCard.lastError || "An unknown error occurred. Please try again."}
                    buttonText="Try Again"
                    onClick={handleGenerateReport}
                />
            );
        }

        // State 4: Completed
        if (status === 'completed') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GitHubCard data={reportCard?.github} formatDate={formatDate} />
                    <LinkedInCard data={reportCard?.linkedin} formatDate={formatDate} />
                </div>
            );
        }

        // State 5: Default (Never generated)
        return (
            <EmptyState
                icon={Sparkles}
                title="Generate Your AI Report Card"
                message="Analyze your public GitHub and LinkedIn profiles to get a report on your skills, experience, and project highlights."
                buttonText="Generate Report"
                onClick={handleGenerateReport}
            />
        );
    };

    // Calculate overall score if report is completed
    const calculateOverallScore = () => {
        if (status !== 'completed' || !reportCard) return 0;
        
        const githubScore = reportCard.github?.overallScore || 0;
        const linkedinScore = reportCard.linkedin?.overallScore || 0;
        
        // Simple average for now, can be weighted differently
        return Math.round((githubScore + linkedinScore) / 2);
    };
    
    const overallScore = calculateOverallScore();
    
    // Get color based on score
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-rose-500';
    };
    
    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Average';
        return 'Needs Improvement';
    };

    // Add safety check for user data
    if (!user) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium">Loading user data...</p>
                </div>
            </div>
        );
    }

    // Auto-refresh completed reports every 5 seconds if status is pending
    useEffect(() => {
        let interval;
        if (status === 'pending') {
            interval = setInterval(async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:5000/api/users/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (onUpdate && data.reportCard?.status !== 'pending') {
                            onUpdate(data);
                        }
                    }
                } catch (error) {
                    console.error('Error checking report status:', error);
                }
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status, onUpdate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Header with Stats */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Profile Report Card</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">Comprehensive analysis of your professional profiles and skills.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        {status === 'completed' && (
                            <button 
                                onClick={handleGenerateReport}
                                disabled={isLoading || isGenerating}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                    isLoading || isGenerating 
                                        ? 'bg-gray-200 dark:bg-neutral-700 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-primary-500 to-accent-600 text-white hover:from-primary-600 hover:to-accent-700 shadow-lg hover:shadow-xl hover:shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isLoading || isGenerating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        <span>Regenerate Report</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Stats Overview */}
                {status === 'completed' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {/* Overall Score */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Overall Score</span>
                                <BarChart3 size={20} className="text-primary-500" />
                            </div>
                            <div className="flex items-end gap-2">
                                <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                                    {overallScore}
                                </span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                    {getScoreLabel(overallScore)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 mt-3">
                                <div 
                                    className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full"
                                    style={{ width: `${overallScore}%` }}
                                />
                            </div>
                        </div>
                        
                        {/* GitHub Stats */}
                        {reportCard?.github && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">GitHub</span>
                                    <Github size={20} className="text-gray-800 dark:text-white" />
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className={`text-4xl font-bold ${getScoreColor(reportCard.github.overallScore)}`}>
                                        {reportCard.github.overallScore}
                                    </span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                        {getScoreLabel(reportCard.github.overallScore)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span>{reportCard.github.publicRepos} repos</span>
                                    <span>•</span>
                                    <span>{reportCard.github.followers} followers</span>
                                </div>
                            </div>
                        )}
                        
                        {/* LinkedIn Stats */}
                        {reportCard?.linkedin && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">LinkedIn</span>
                                    <Linkedin size={20} className="text-blue-600" />
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className={`text-4xl font-bold ${getScoreColor(reportCard.linkedin.overallScore)}`}>
                                        {reportCard.linkedin.overallScore}
                                    </span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                        {getScoreLabel(reportCard.linkedin.overallScore)}
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                    {reportCard.linkedin.connections}+ connections
                                </div>
                            </div>
                        )}
                        
                        {/* Skills Overview */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Skills</span>
                                <Award size={20} className="text-amber-500" />
                            </div>
                            <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-1">
                                {reportCard?.skills?.length || 0}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                {reportCard?.topSkills?.slice(0, 2).map(skill => skill.name).join(', ')}
                                {reportCard?.topSkills?.length > 2 ? '...' : ''}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Main Content Area */}
                {renderContent()}
            </div>
        </motion.div>
    );
};

// --- Child Components for UI States ---

const EmptyState = ({ icon: Icon, title, message, buttonText, onClick, isPending = false }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-600 p-12 text-center"
    >
        <div className={`w-16 h-16 bg-surface-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 ${isPending ? 'text-primary-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
            <Icon size={32} className={isPending ? 'animate-spin' : ''} />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">{message}</p>
        {buttonText && onClick && (
            <button
                onClick={onClick}
                className="btn btn-lg btn-primary shadow-glow inline-flex items-center gap-2"
            >
                {buttonText}
            </button>
        )}
    </motion.div>
);

const GitHubCard = ({ data, formatDate }) => {
    if (!data) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card rounded-2xl shadow-lg"
        >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-900 rounded-t-2xl text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Github size={28} />
                        <h2 className="text-2xl font-bold">{data.username || 'GitHub Profile'}</h2>
                    </div>
                    <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <ExternalLink size={20} />
                    </a>
                </div>
                <p className="mt-4 text-neutral-300">{data.bio}</p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatBox icon={Book} label="Public Repos" value={data.publicRepos} />
                    <StatBox icon={Users} label="Followers" value={data.followers} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Pinned Repositories</h3>
                <div className="space-y-3">
                    {data.pinnedRepos?.map((repo, i) => (
                        <a 
                            key={i} 
                            href={repo.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-4 bg-surface-50 dark:bg-neutral-800 rounded-lg border border-surface-200 dark:border-neutral-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                        >
                            <h4 className="font-bold text-primary-700 dark:text-primary-400">{repo.title}</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{repo.description}</p>
                        </a>
                    ))}
                    {(!data.pinnedRepos || data.pinnedRepos.length === 0) && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">No pinned repositories found.</p>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-6 text-right">Last Generated: {formatDate(data.lastGenerated)}</p>
            </div>
        </motion.div>
    );
};

const LinkedInCard = ({ data, formatDate }) => {
    if (!data) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card rounded-2xl shadow-lg"
        >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-primary-700 rounded-t-2xl text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Linkedin size={28} />
                        <h2 className="text-2xl font-bold">LinkedIn Profile</h2>
                    </div>
                    <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <ExternalLink size={20} />
                    </a>
                </div>
                <p className="mt-4 text-primary-100 font-medium">{data.headline}</p>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Summary</h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-surface-50 dark:bg-neutral-800 p-4 rounded-lg border border-surface-200 dark:border-neutral-700 mb-6">
                    {data.summary || <span className="text-neutral-500 dark:text-neutral-400">No summary found.</span>}
                </p> {/* <--- THIS IS THE FIX */}
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Recent Experience</h3>
                <div className="space-y-4">
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="p-3 bg-surface-100 dark:bg-neutral-800 rounded-lg h-fit">
                                <Briefcase size={20} className="text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{exp.title}</h4>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">{exp.company}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{exp.duration}</p>
                            </div>
                        </div>
                    ))}
                    {(!data.experience || data.experience.length === 0) && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">No work experience found.</p>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-6 text-right">Last Generated: {formatDate(data.lastGenerated)}</p>
            </div>
        </motion.div>
    );
};

const StatBox = ({ icon: Icon, label, value }) => (
    <div className="bg-gradient-to-br from-surface-50 to-surface-100 dark:from-neutral-800 dark:to-neutral-700 p-4 rounded-xl border border-surface-200 dark:border-neutral-600">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                <Icon size={20} className="text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{label}</p>
            </div>
        </div>
    </div>
);

export default ReportCard;