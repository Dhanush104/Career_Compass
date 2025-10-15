import React, { useState, useEffect, useMemo } from 'react';
import { 
    Compass, Star, RefreshCw, BarChart3, LogOut, Menu, X, TrendingUp, 
    Award, User as UserIcon, ExternalLink, FolderKanban, Users, 
    PlusCircle, Bell, Calendar, Zap, Search, Filter, 
    Trash2, BookMarked, Target, Trophy, Flame, Code, BookOpen, Mic, 
    Briefcase, Rocket, ChevronDown, Circle, CheckCircle, PlayCircle
} from 'lucide-react';
import LandingPage from './LandingPage.jsx'; 


// --- LoginPage Component ---
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginAttempt = (e) => {
        e.preventDefault();
        // Simulate checking credentials. Use your own logic here.
        if (username === 'user' && password === 'password') {
            setError('');
            const userData = { username: 'Dhanush', email: 'dhanush@example.com' };
            // If successful, call the function from App.jsx
            onLogin(userData);
        } else {
            setError('Invalid username or password. (Hint: user / password)');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-4 mb-8">
                <span className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-white text-2xl">U</span>
                <h1 className="text-4xl font-bold text-gray-800">UNDERRATED CODER</h1>
            </div>
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Dashboard</h2>
                <form onSubmit={handleLoginAttempt} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="user"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};



// Mock career path data
const mockCareerPathDataFromBackend = [
    {
        name: "Full-Stack Web Developer",
        description: "Master both front-end and back-end technologies to build complete web applications.",
        milestones: [
            {
                title: "Module 1: Frontend Fundamentals",
                tasks: [ 
                    { name: "HTML & CSS Basics", completed: true }, 
                    { name: "JavaScript Essentials", completed: true }, 
                    { name: "Build a Static Portfolio Website", completed: false } 
                ]
            },
            {
                title: "Module 2: Advanced Frontend with React",
                tasks: [ 
                    { name: "Learn React Components, State, and Props", completed: true }, 
                    { name: "Master Tailwind CSS for Styling", completed: false }, 
                    { name: "Project: Build a Dynamic To-Do App", completed: false } 
                ]
            }
        ]
    }
];

// Quiz Component
const Quiz = ({ onQuizComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 1,
            question: "What interests you most?",
            options: ["Frontend Development", "Backend Development", "Full-Stack Development", "Mobile Development"]
        },
        {
            id: 2,
            question: "What's your current skill level?",
            options: ["Beginner", "Intermediate", "Advanced", "Expert"]
        },
        {
            id: 3,
            question: "What's your learning goal?",
            options: ["Get a job", "Freelance", "Build my own product", "Learn for fun"]
        }
    ];

    const handleAnswer = (answer) => {
        setAnswers({ ...answers, [currentQuestion]: answer });
        
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Quiz complete
            setTimeout(() => {
                onQuizComplete(mockCareerPathDataFromBackend);
            }, 500);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
                        <span className="text-sm font-semibold text-amber-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">{questions[currentQuestion].question}</h2>

                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all"
                        >
                            <span className="text-gray-800 font-medium">{option}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Add Project Modal
const AddProjectModal = ({ isOpen, onClose, onAddProject }) => {
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        technologies: '', 
        status: 'in-progress', 
        githubUrl: '', 
        liveUrl: '' 
    });
    
    if (!isOpen) return null;
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        onAddProject({ 
            ...formData, 
            technologies: formData.technologies.split(',').map(t => t.trim()) 
        }); 
        onClose(); 
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[101] p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Project Title *</label>
                        <input 
                            type="text" 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            className="w-full bg-gray-100 text-gray-800 rounded-lg p-3 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Description *</label>
                        <textarea 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            className="w-full bg-gray-100 text-gray-800 rounded-lg p-3 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none h-24" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Technologies (comma-separated) *</label>
                        <input 
                            type="text" 
                            value={formData.technologies} 
                            onChange={e => setFormData({...formData, technologies: e.target.value})} 
                            className="w-full bg-gray-100 text-gray-800 rounded-lg p-3 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
                            required 
                        />
                    </div>
                    <div className="flex space-x-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-semibold hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 bg-yellow-400 rounded-lg text-black font-semibold hover:bg-yellow-500"
                        >
                            Add Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = ({ onLogout, user }) => {
    const [loading, setLoading] = useState(true);
    const [userStatus, setUserStatus] = useState('not-taken');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAddProjectModalOpen, setAddProjectModalOpen] = useState(false);
    
    const [projects, setProjects] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [streak, setStreak] = useState(12);
    const [level, setLevel] = useState(2);
    const [xp, setXp] = useState(125);
    const [recommendedPaths, setRecommendedPaths] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedMilestones, setExpandedMilestones] = useState({});

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setProjects([
                { 
                    _id: 'proj1', 
                    title: 'Personal Portfolio', 
                    description: 'Built a responsive portfolio to showcase my skills.', 
                    technologies: ['React', 'Tailwind'], 
                    status: 'completed', 
                    githubUrl: '#', 
                    liveUrl: '#' 
                }
            ]);
            setUserSkills([
                { name: 'React', level: 75, description: 'UI Library' }, 
                { name: 'Node.js', level: 50, description: 'Backend Runtime' }
            ]);
            setLoading(false);
        }, 500);
    }, [user]);

    const handleQuizComplete = (recommendationsFromBackend) => {
        const detailedData = recommendationsFromBackend || mockCareerPathDataFromBackend;
        if (detailedData && detailedData.length > 0) {
            setRecommendedPaths(detailedData);
            setUserStatus('completed');
            setActiveTab('roadmap');
        }
    };

    const handleAddProject = (projectData) => {
        setProjects(prev => [{ ...projectData, _id: Date.now().toString() }, ...prev]);
    };

    const filteredProjects = useMemo(() => 
        projects.filter(p => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            (filterStatus === 'all' || p.status === filterStatus)
        ), 
        [projects, searchQuery, filterStatus]
    );

    const handleToggleMilestone = (pathIndex, milestoneIndex) => {
        const key = `${pathIndex}-${milestoneIndex}`;
        setExpandedMilestones(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Sidebar
    const renderSidebar = () => {
        const NavButton = ({ tabName, icon, label }) => (
            <li>
                <button 
                    onClick={() => {setActiveTab(tabName); setMobileMenuOpen(false);}} 
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors ${
                        activeTab === tabName 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                    {icon}<span>{label}</span>
                </button>
            </li>
        );

        return (
            <div 
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 p-6 z-40 transform transition-transform ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div 
                        className="flex items-center space-x-2 mb-10 cursor-pointer" 
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <span className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center font-bold text-white text-lg">🧭</span>
                        <span className="font-bold text-lg text-gray-800">Career Compass</span>
                    </div>
                    <nav className="flex-1 overflow-y-auto -mr-4 pr-4">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                        <ul className="space-y-2">
                            <NavButton tabName="dashboard" icon={<BarChart3 size={20} />} label="Dashboard" />
                            {recommendedPaths.length > 0 && <NavButton tabName="roadmap" icon={<Rocket size={20} />} label="My Roadmap" />}
                            <NavButton tabName="projects" icon={<FolderKanban size={20} />} label="My Projects" />
                            <NavButton tabName="skills" icon={<Target size={20} />} label="My Skills" />
                            <NavButton tabName="profile" icon={<UserIcon size={20} />} label="My Profile" />
                        </ul>
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Discover</p>
                        <ul className="space-y-2">
                            <li>
                                <a 
                                    href="https://discord.gg/q7RjKEss" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                >
                                    <Users size={20} />
                                    <span>Join Community</span>
                                </a>
                            </li>
                            <NavButton tabName="freeCourses" icon={<BookOpen size={20} />} label="Free Courses" />
                            <NavButton tabName="mentorship" icon={<Users size={20} />} label="1:1 Mentorship" />
                            <NavButton tabName="placement" icon={<Briefcase size={20} />} label="Placement" />
                            <NavButton tabName="podcast" icon={<Mic size={20} />} label="Podcast" />
                        </ul>
                    </nav>
                    <div className="mt-4 border-t pt-4 border-gray-200">
                        <button 
                            onClick={onLogout} 
                            className="w-full flex items-center space-x-3 p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} /><span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderRoadmapView = () => (
        <div className="opacity-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Recommended Roadmap</h1>
            <p className="text-gray-500 mb-8">Follow these milestones and tasks to achieve your career goals.</p>
            <div className="space-y-8">
                {recommendedPaths.map((path, pathIndex) => (
                    <div key={pathIndex} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start mb-4">
                            <div className="p-3 rounded-lg bg-amber-100 mr-4">
                                <Rocket className="text-amber-600" size={24}/>
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-gray-800">{path.name}</h2>
                                <p className="text-sm text-gray-600">{path.description}</p>
                            </div>
                        </div>
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            {path.milestones.map((milestone, milestoneIndex) => {
                                const key = `${pathIndex}-${milestoneIndex}`;
                                const isExpanded = !!expandedMilestones[key];
                                return (
                                    <div key={milestoneIndex} className="border-b border-gray-100 last:border-b-0">
                                        <button 
                                            onClick={() => handleToggleMilestone(pathIndex, milestoneIndex)} 
                                            className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-semibold text-gray-700">{milestone.title}</span>
                                            <ChevronDown 
                                                size={20} 
                                                className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                            />
                                        </button>
                                        {isExpanded && (
                                            <div className="overflow-hidden pl-6 pr-3 pb-3">
                                                <ul className="mt-2 space-y-3">
                                                    {milestone.tasks.map((task, taskIndex) => (
                                                        <li 
                                                            key={taskIndex} 
                                                            className={`flex items-center space-x-3 ${
                                                                task.completed ? 'text-gray-500' : 'text-gray-800'
                                                            }`}
                                                        >
                                                            {task.completed ? (
                                                                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                                            ) : (
                                                                <Circle size={18} className="text-gray-300 flex-shrink-0" />
                                                            )}
                                                            <span className={task.completed ? 'line-through' : ''}>
                                                                {task.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDashboardView = () => (
        <div className="opacity-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center space-x-4">
                        <div className="p-3 bg-amber-100 rounded-full">
                            <Flame size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-gray-800 font-bold text-xl">{streak} Day Streak</p>
                            <p className="text-gray-500 text-sm">Keep up the great work!</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="mr-3 text-amber-500" />Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-amber-600">{projects.length}</p>
                                <p className="text-gray-500 text-sm">Projects</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-amber-600">{userSkills.length}</p>
                                <p className="text-gray-500 text-sm">Skills</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-green-500">{level}</p>
                                <p className="text-gray-500 text-sm">Level</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-yellow-500">{xp}</p>
                                <p className="text-gray-500 text-sm">Total XP</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Top Skills</h3>
                        <div className="space-y-3">
                            {userSkills.slice(0, 5).map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-800 font-medium">{skill.name}</span>
                                        <span className="text-amber-600 font-bold">{skill.level}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {userSkills.length === 0 && (
                                <p className="text-gray-500 text-sm">Complete tasks to develop skills!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProjectsView = () => (
        <div className="opacity-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
                    <p className="text-gray-500">Showcase your work and track progress</p>
                </div>
                <button 
                    onClick={() => setAddProjectModalOpen(true)} 
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                    <PlusCircle size={18} />
                    <span>Add Project</span>
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" 
                    />
                </div>
            </div>
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div 
                            key={project._id} 
                            className="bg-white p-5 rounded-xl border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-800 text-lg group-hover:text-amber-600 transition-colors">
                                    {project.title}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies?.map((tech, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <span className="text-xs px-3 py-1 rounded-full font-medium capitalize bg-green-100 text-green-700">
                                    {project.status}
                                </span>
                                <div className="flex space-x-2">
                                    {project.githubUrl && (
                                        <a 
                                            href={project.githubUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-gray-500 hover:text-gray-800"
                                        >
                                            <Code size={18} />
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a 
                                            href={project.liveUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-gray-500 hover:text-amber-600"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <FolderKanban size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">You haven't added any projects yet</p>
                    <button 
                        onClick={() => setAddProjectModalOpen(true)} 
                        className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        Add Your First Project
                    </button>
                </div>
            )}
        </div>
    );

    const renderSkillsView = () => (
        <div className="opacity-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Skills</h1>
            <p className="text-gray-500 mb-8">Track your skill development and progress</p>
            {userSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userSkills.map((skill, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-800 font-bold text-lg">{skill.name}</h3>
                                <span className="text-amber-600 font-bold text-xl">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                <div 
                                    className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>
                            <p className="text-gray-600 text-sm">{skill.description || 'Keep practicing to improve!'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <Target size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Complete tasks in your roadmap to develop skills!</p>
                </div>
            )}
        </div>
    );

    const renderProfileView = () => (
        <div className="opacity-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-3xl">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user?.username || 'User'}</h2>
                        <p className="text-gray-500">{user?.email || 'user@email.com'}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFreeCoursesView = () => {
        const courses = [
            { title: "JavaScript for Beginners", desc: "A comprehensive introduction to the most popular language on the web.", tags: ["JavaScript", "Beginner"] },
            { title: "React Fundamentals", desc: "Learn the basics of React to build modern, interactive user interfaces.", tags: ["React", "Frontend"] },
            { title: "Node.js Express API", desc: "Create robust and scalable backend APIs with Node.js and Express.", tags: ["Node.js", "Backend", "API"] }
        ];
        return (
            <div className="opacity-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Free Courses</h1>
                <p className="text-gray-500 mb-8">Kickstart your learning journey with our curated list of free courses.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow flex flex-col">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">{course.desc}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {course.tags.map(t => (
                                        <span key={t} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <button className="text-sm font-semibold text-amber-600 hover:text-amber-800">Start &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMentorshipView = () => {
        const mentors = [
            { name: "John Doe", title: "Senior Software Engineer @ Google", expertise: ["System Design", "Algorithms"] },
            { name: "Jane Smith", title: "Frontend Lead @ Vercel", expertise: ["React", "Next.js", "UI/UX"] },
            { name: "Sam Wilson", title: "DevOps Specialist @ AWS", expertise: ["Cloud", "CI/CD", "Docker"] }
        ];
        return (
            <div className="opacity-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">1:1 Mentorship</h1>
                <p className="text-gray-500 mb-8">Get personalized guidance from industry experts.</p>
                <div className="space-y-4">
                    {mentors.map((mentor, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div>
                                    <p className="font-bold text-gray-800">{mentor.name}</p>
                                    <p className="text-sm text-gray-500">{mentor.title}</p>
                                    <div className="flex gap-2 mt-1">
                                        {mentor.expertise.map(e => (
                                            <span key={e} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                {e}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors text-sm">
                                Book Session
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPlacementView = () => {
        const jobs = [
            { title: "Frontend Developer", company: "Stripe", location: "Remote", type: "Full-time" },
            { title: "Backend Engineer", company: "Shopify", location: "Coimbatore, IN", type: "Full-time" },
            { title: "Web Dev Intern", company: "Local Startup", location: "Coimbatore, IN", type: "Internship" }
        ];
        return (
            <div className="opacity-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Placement Assistance</h1>
                <p className="text-gray-500 mb-8">Find your dream job with our curated list of opportunities.</p>
                <div className="space-y-4">
                    {jobs.map((job, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-800">{job.title}</p>
                                <p className="text-sm text-gray-500">
                                    {job.company} &middot; <span className="text-amber-700 font-medium">{job.location}</span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                                    {job.type}
                                </span>
                                <button className="text-sm font-semibold text-amber-600 hover:text-amber-800">
                                    Apply &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPodcastView = () => {
        const episodes = [
            { title: "Ep #1: Landing Your First Tech Job", desc: "Tips and tricks from a hiring manager." },
            { title: "Ep #2: The Rise of AI in Development", desc: "How AI is changing the way we code." }
        ];
        return (
            <div className="opacity-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Podcast</h1>
                <p className="text-gray-500 mb-8">Listen to insights from experts and learn from their journey in tech.</p>
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                    {episodes.map((ep, i) => (
                        <div key={i} className="p-4 border-b last:border-b-0 border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-800">{ep.title}</p>
                                    <p className="text-sm text-gray-500">{ep.desc}</p>
                                </div>
                                <button className="p-2 rounded-full hover:bg-amber-100 text-amber-600">
                                    <PlayCircle size={28} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        const tabs = {
            dashboard: renderDashboardView(),
            projects: renderProjectsView(),
            skills: renderSkillsView(),
            profile: renderProfileView(),
            roadmap: renderRoadmapView(),
            freeCourses: renderFreeCoursesView(),
            mentorship: renderMentorshipView(),
            placement: renderPlacementView(),
            podcast: renderPodcastView(),
        };
        return tabs[activeTab] || renderDashboardView();
    };
    
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            {renderSidebar()}
            <div className="relative md:pl-64">
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
                    <button 
                        className="text-gray-600" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </header>
                <main className="p-6 md:p-10">
                    {userStatus === 'completed' ? (
                        renderContent()
                    ) : userStatus === 'quiz' ? (
                        <Quiz onQuizComplete={handleQuizComplete} />
                    ) : (
                        <div className="text-center p-12 bg-white rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Underrated Coder!</h2>
                            <p className="text-gray-600 mb-6">Take our career discovery quiz to unlock your personalized dashboard.</p>
                            <button 
                                onClick={() => setUserStatus('quiz')} 
                                className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                            >
                                Start Quiz
                            </button>
                        </div>
                    )}
                </main>
            </div>
            {isAddProjectModalOpen && (
                <AddProjectModal 
                    isOpen={isAddProjectModalOpen} 
                    onClose={() => setAddProjectModalOpen(false)} 
                    onAddProject={handleAddProject} 
                />
            )}
        </div>
    );
};

// App wrapper with default user
// --- App Component (The Main Controller) ---
const App = () => {
    // Manages the current user. null means logged out.
    const [user, setUser] = useState(null);

    // This runs once when the app starts to check for a saved session.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // This function is called when login is successful.
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // This function is called when the user clicks "Logout".
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Clear the session
        localStorage.removeItem('careerPaths'); // Optional: also clear the roadmap
    };

    // If a 'user' exists, show the Dashboard. Otherwise, show the LoginPage.
    return user ? (
        <Dashboard onLogout={handleLogout} user={user} />
    ) : (
        <LoginPage onLogin={handleLogin} />
    );
};

export default Dashboard;