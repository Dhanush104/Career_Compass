import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, PauseCircle, Clock, Calendar, User, TrendingUp, Briefcase, Brain, Target, Users, Star, Filter, Search } from 'lucide-react';

const Podcast = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const categories = [
        { id: 'all', name: 'All Episodes', icon: PlayCircle },
        { id: 'career-development', name: 'Career Development', icon: TrendingUp },
        { id: 'personal-growth', name: 'Personal Growth', icon: Target },
        { id: 'tech-trends', name: 'Tech Trends', icon: Brain },
        { id: 'leadership', name: 'Leadership', icon: Users },
        { id: 'interviews', name: 'Expert Interviews', icon: User }
    ];

    const episodes = [
        // Career Development
        {
            id: 1,
            title: "Landing Your First Tech Job: A Complete Guide",
            desc: "Comprehensive strategies for breaking into the tech industry, from resume building to interview preparation.",
            category: 'career-development',
            duration: "45:30",
            date: "2024-11-10",
            host: "Sarah Chen",
            guest: "Mike Rodriguez - Senior Hiring Manager at Google",
            tags: ["Job Search", "Resume", "Interviews", "Entry Level"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            description: "In this episode, we dive deep into the strategies that actually work for landing your first tech job. Mike Rodriguez shares insider tips from his 10 years of experience hiring at top tech companies."
        },
        {
            id: 2,
            title: "From Junior to Senior: Accelerating Your Career Growth",
            desc: "Learn how to fast-track your career progression with proven strategies from industry veterans.",
            category: 'career-development',
            duration: "52:15",
            date: "2024-11-08",
            host: "David Kim",
            guest: "Jessica Thompson - VP of Engineering at Stripe",
            tags: ["Career Growth", "Promotion", "Leadership", "Skills"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            description: "Jessica shares her journey from junior developer to VP of Engineering, including the key decisions and skills that accelerated her career."
        },
        {
            id: 3,
            title: "Salary Negotiation Mastery for Tech Professionals",
            desc: "Master the art of salary negotiation with proven techniques that have helped thousands increase their compensation.",
            category: 'career-development',
            duration: "38:45",
            date: "2024-11-05",
            host: "Sarah Chen",
            guest: "Alex Morgan - Career Coach & Former FAANG Recruiter",
            tags: ["Salary", "Negotiation", "Compensation", "Benefits"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            description: "Learn the exact scripts and strategies that top performers use to negotiate higher salaries and better benefits packages."
        },

        // Personal Growth
        {
            id: 4,
            title: "Building Unshakeable Confidence in Your Career",
            desc: "Overcome imposter syndrome and build the confidence needed to excel in your professional life.",
            category: 'personal-growth',
            duration: "41:20",
            date: "2024-11-03",
            host: "Dr. Maria Santos",
            guest: "James Wilson - Executive Coach & Psychologist",
            tags: ["Confidence", "Imposter Syndrome", "Mindset", "Psychology"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            description: "Dr. Santos and James explore practical techniques to build lasting confidence and overcome the mental barriers that hold professionals back."
        },
        {
            id: 5,
            title: "The Power of Continuous Learning in Tech",
            desc: "Stay relevant and advance your career through strategic continuous learning and skill development.",
            category: 'personal-growth',
            duration: "47:10",
            date: "2024-11-01",
            host: "David Kim",
            guest: "Lisa Chang - Learning & Development Director at Microsoft",
            tags: ["Learning", "Skills", "Growth", "Adaptation"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            description: "Lisa shares Microsoft's approach to continuous learning and how individuals can create their own learning roadmap for career success."
        },
        {
            id: 6,
            title: "Work-Life Balance: Myth or Reality?",
            desc: "Practical strategies for maintaining balance while building a successful tech career.",
            category: 'personal-growth',
            duration: "44:35",
            date: "2024-10-29",
            host: "Sarah Chen",
            guest: "Dr. Robert Kim - Workplace Wellness Expert",
            tags: ["Work-Life Balance", "Wellness", "Productivity", "Mental Health"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            description: "Dr. Kim debunks common myths about work-life balance and provides actionable strategies for sustainable career growth."
        },

        // Tech Trends
        {
            id: 7,
            title: "The AI Revolution: How It's Reshaping Every Career Path",
            desc: "Understand how artificial intelligence is transforming industries and what it means for your career.",
            category: 'tech-trends',
            duration: "56:20",
            date: "2024-10-27",
            host: "David Kim",
            guest: "Dr. Priya Patel - AI Research Director at OpenAI",
            tags: ["AI", "Machine Learning", "Future of Work", "Innovation"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
            description: "Dr. Patel discusses the current state of AI, its impact on different career paths, and how professionals can adapt and thrive."
        },
        {
            id: 8,
            title: "Cybersecurity in 2024: Threats, Opportunities, and Career Paths",
            desc: "Explore the evolving cybersecurity landscape and the growing career opportunities in this critical field.",
            category: 'tech-trends',
            duration: "49:15",
            date: "2024-10-24",
            host: "Sarah Chen",
            guest: "Marcus Johnson - CISO at Tesla",
            tags: ["Cybersecurity", "Security", "Career Paths", "Technology"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            description: "Marcus shares insights into the cybersecurity industry, emerging threats, and the skills needed to build a successful security career."
        },
        {
            id: 9,
            title: "Cloud Computing Careers: From Beginner to Architect",
            desc: "Navigate the cloud computing career path from entry-level positions to cloud architecture roles.",
            category: 'tech-trends',
            duration: "43:50",
            date: "2024-10-22",
            host: "David Kim",
            guest: "Amanda Foster - Principal Cloud Architect at AWS",
            tags: ["Cloud Computing", "AWS", "Architecture", "DevOps"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
            description: "Amanda outlines the cloud computing career landscape and provides a roadmap for advancing from beginner to expert level."
        },

        // Leadership
        {
            id: 10,
            title: "From Individual Contributor to Tech Leader",
            desc: "Navigate the transition from coding to leading teams and making strategic technical decisions.",
            category: 'leadership',
            duration: "51:30",
            date: "2024-10-20",
            host: "Dr. Maria Santos",
            guest: "Kevin Park - CTO at Airbnb",
            tags: ["Leadership", "Management", "Team Building", "Strategy"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
            description: "Kevin shares his journey from senior engineer to CTO, including the challenges and strategies for successful leadership transition."
        },
        {
            id: 11,
            title: "Building High-Performance Engineering Teams",
            desc: "Learn the secrets of creating and managing engineering teams that consistently deliver exceptional results.",
            category: 'leadership',
            duration: "46:25",
            date: "2024-10-18",
            host: "Sarah Chen",
            guest: "Rachel Green - VP of Engineering at Spotify",
            tags: ["Team Management", "Performance", "Culture", "Productivity"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
            description: "Rachel discusses Spotify's approach to building high-performance teams and the leadership principles that drive success."
        },

        // Expert Interviews
        {
            id: 12,
            title: "Startup Success Stories: Lessons from Unicorn Founders",
            desc: "Exclusive interviews with founders who built billion-dollar companies from the ground up.",
            category: 'interviews',
            duration: "62:40",
            date: "2024-10-15",
            host: "David Kim",
            guest: "Multiple Founders - Zoom, Slack, Discord",
            tags: ["Startups", "Entrepreneurship", "Success Stories", "Innovation"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
            description: "A special episode featuring insights from multiple unicorn founders sharing their journey, challenges, and key decisions."
        },
        {
            id: 13,
            title: "Women in Tech: Breaking Barriers and Building Futures",
            desc: "Inspiring stories and practical advice from women leaders who are shaping the future of technology.",
            category: 'interviews',
            duration: "48:15",
            date: "2024-10-13",
            host: "Dr. Maria Santos",
            guest: "Panel of Women Tech Leaders",
            tags: ["Diversity", "Women in Tech", "Leadership", "Inspiration"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
            description: "A powerful panel discussion with women leaders from Google, Apple, and Meta sharing their experiences and advice."
        },
        {
            id: 14,
            title: "The Future of Remote Work: Insights from Global Leaders",
            desc: "How remote work is reshaping careers and what it means for the future of professional development.",
            category: 'interviews',
            duration: "54:10",
            date: "2024-10-11",
            host: "Sarah Chen",
            guest: "CEOs from GitLab, Buffer, and Zapier",
            tags: ["Remote Work", "Future of Work", "Productivity", "Culture"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
            description: "Leaders from fully remote companies share insights on building successful remote careers and teams."
        },

        // More Personal Growth
        {
            id: 15,
            title: "Mastering the Art of Professional Networking",
            desc: "Build meaningful professional relationships that accelerate your career growth and open new opportunities.",
            category: 'personal-growth',
            duration: "39:45",
            date: "2024-10-08",
            host: "David Kim",
            guest: "Jennifer Liu - Executive Coach & Former LinkedIn VP",
            tags: ["Networking", "Relationships", "Career Growth", "Communication"],
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
            description: "Jennifer shares proven networking strategies that have helped thousands of professionals advance their careers."
        }
    ];

    const filteredEpisodes = episodes.filter(episode => {
        const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory;
        const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            episode.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            episode.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            episode.guest.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handlePlayPause = (episodeId) => {
        if (currentlyPlaying === episodeId) {
            setCurrentlyPlaying(null);
        } else {
            setCurrentlyPlaying(episodeId);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                    Career Compass Podcast
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Listen to insights from industry experts, learn from their journey, and accelerate your career growth with actionable advice.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search episodes, guests, or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Category Filters */}
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-6">
                {filteredEpisodes.map((episode, i) => (
                    <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-hover p-6 group"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Episode Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {episode.title}
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                                            {episode.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Episode Meta */}
                                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-neutral-500 dark:text-neutral-400">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{episode.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={16} />
                                        <span>{episode.host}</span>
                                    </div>
                                </div>

                                {/* Guest */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        <span className="text-neutral-500 dark:text-neutral-400">Guest: </span>
                                        {episode.guest}
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {episode.tags.map(tag => (
                                        <span 
                                            key={tag} 
                                            className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {episode.description}
                                </p>
                            </div>

                            {/* Play Button & Audio */}
                            <div className="lg:w-80 flex flex-col items-center">
                                <button 
                                    onClick={() => handlePlayPause(episode.id)}
                                    className="mb-4 p-4 bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all group/play"
                                >
                                    {currentlyPlaying === episode.id ? (
                                        <PauseCircle size={32} className="group-hover/play:scale-110 transition-transform" />
                                    ) : (
                                        <PlayCircle size={32} className="group-hover/play:scale-110 transition-transform" />
                                    )}
                                </button>
                                
                                <audio 
                                    controls 
                                    className="w-full h-10 rounded-lg"
                                    style={{ filter: 'hue-rotate(200deg)' }}
                                >
                                    <source src={episode.audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredEpisodes.length === 0 && (
                <div className="text-center py-12">
                    <PlayCircle size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No episodes found
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}

            {/* Stats */}
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50 rounded-2xl border border-primary-200 dark:border-primary-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{episodes.length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Episodes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{categories.length - 1}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Categories</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-success-600 dark:text-success-400">50+</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Expert Guests</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">Weekly</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">New Episodes</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Podcast;