import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, Download, Eye, Edit3, Plus, Trash2, Save, 
    User, Mail, Phone, MapPin, Briefcase, GraduationCap,
    Award, Code, Languages, Heart, Palette, Layout
} from 'lucide-react';

const ResumeBuilder = () => {
    const [activeSection, setActiveSection] = useState('personal');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [resumeData, setResumeData] = useState({
        personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: []
    });

    const templates = [
        {
            id: 'modern',
            name: 'Modern Professional',
            preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
            description: 'Clean, modern design perfect for tech roles'
        },
        {
            id: 'creative',
            name: 'Creative Designer',
            preview: 'bg-gradient-to-br from-purple-50 to-pink-100',
            description: 'Eye-catching design for creative professionals'
        },
        {
            id: 'minimal',
            name: 'Minimal Classic',
            preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
            description: 'Simple, elegant design for any industry'
        },
        {
            id: 'executive',
            name: 'Executive',
            preview: 'bg-gradient-to-br from-emerald-50 to-teal-100',
            description: 'Professional design for senior positions'
        }
    ];

    const sections = [
        { id: 'personal', name: 'Personal Info', icon: User },
        { id: 'experience', name: 'Experience', icon: Briefcase },
        { id: 'education', name: 'Education', icon: GraduationCap },
        { id: 'skills', name: 'Skills', icon: Code },
        { id: 'projects', name: 'Projects', icon: FileText },
        { id: 'certifications', name: 'Certifications', icon: Award },
        { id: 'languages', name: 'Languages', icon: Languages }
    ];

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: Date.now(),
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now(),
                degree: '',
                school: '',
                location: '',
                graduationDate: '',
                gpa: '',
                relevant: ''
            }]
        }));
    };

    const addSkill = () => {
        setResumeData(prev => ({
            ...prev,
            skills: [...prev.skills, {
                id: Date.now(),
                name: '',
                level: 'Intermediate',
                category: 'Technical'
            }]
        }));
    };

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personal: {
                ...prev.personal,
                [field]: value
            }
        }));
    };

    const removeItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const updateItem = (section, id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const renderPersonalSection = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        value={resumeData.personal.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        className="input w-full"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        value={resumeData.personal.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="input w-full"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={resumeData.personal.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="input w-full"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        value={resumeData.personal.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="input w-full"
                        placeholder="San Francisco, CA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        LinkedIn
                    </label>
                    <input
                        type="url"
                        value={resumeData.personal.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        className="input w-full"
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        GitHub
                    </label>
                    <input
                        type="url"
                        value={resumeData.personal.github}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        className="input w-full"
                        placeholder="https://github.com/johndoe"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Professional Summary
                </label>
                <textarea
                    value={resumeData.personal.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    rows={4}
                    className="input w-full resize-none"
                    placeholder="Write a compelling summary of your professional background and goals..."
                />
            </div>
        </div>
    );

    const renderExperienceSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Work Experience</h3>
                <button onClick={addExperience} className="btn btn-md btn-primary">
                    <Plus size={16} />
                    Add Experience
                </button>
            </div>
            {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-6 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Experience #{index + 1}</h4>
                        <button
                            onClick={() => removeItem('experience', exp.id)}
                            className="text-error-600 hover:text-error-700 p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)}
                            className="input w-full"
                            placeholder="Job Title"
                        />
                        <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                            className="input w-full"
                            placeholder="Company Name"
                        />
                        <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)}
                            className="input w-full"
                            placeholder="Location"
                        />
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                                className="input flex-1"
                            />
                            <input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                                className="input flex-1"
                                disabled={exp.current}
                            />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateItem('experience', exp.id, 'current', e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">Currently working here</span>
                    </label>
                    <textarea
                        value={exp.description}
                        onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                        rows={3}
                        className="input w-full resize-none"
                        placeholder="Describe your responsibilities and achievements..."
                    />
                </div>
            ))}
        </div>
    );

    const renderSkillsSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Skills</h3>
                <button onClick={addSkill} className="btn btn-md btn-primary">
                    <Plus size={16} />
                    Add Skill
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-3">
                            <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
                                className="input flex-1 mr-2"
                                placeholder="Skill name"
                            />
                            <button
                                onClick={() => removeItem('skills', skill.id)}
                                className="text-error-600 hover:text-error-700 p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={skill.level}
                                onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)}
                                className="input text-sm"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                            <select
                                value={skill.category}
                                onChange={(e) => updateItem('skills', skill.id, 'category', e.target.value)}
                                className="input text-sm"
                            >
                                <option value="Technical">Technical</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Languages">Languages</option>
                                <option value="Tools">Tools</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return renderPersonalSection();
            case 'experience':
                return renderExperienceSection();
            case 'skills':
                return renderSkillsSection();
            default:
                return <div className="text-center py-12 text-neutral-500">Select a section to edit</div>;
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
                    Resume Builder
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Create a professional resume with our easy-to-use builder and modern templates.
                </p>
            </div>

            {/* Template Selection */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Choose Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                selectedTemplate === template.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                        >
                            <div className={`w-full h-32 rounded-lg mb-3 ${template.preview}`}></div>
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{template.name}</h3>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">{template.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="card-hover p-6 sticky top-6">
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">Resume Sections</h3>
                        <nav className="space-y-2">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                            activeSection === section.id
                                                ? 'bg-primary-500 text-white'
                                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-surface-100 dark:hover:bg-neutral-800'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{section.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                        
                        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <button className="btn btn-md btn-primary w-full mb-3">
                                <Eye size={16} />
                                Preview Resume
                            </button>
                            <button className="btn btn-md btn-outline w-full mb-3">
                                <Download size={16} />
                                Download PDF
                            </button>
                            <button className="btn btn-md btn-ghost w-full">
                                <Save size={16} />
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="card-hover p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-info-50 to-primary-50 dark:from-info-950/50 dark:to-primary-950/50 rounded-2xl border border-info-200 dark:border-info-800">
                <h3 className="text-lg font-bold text-info-900 dark:text-info-100 mb-4">Resume Writing Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-info-500 rounded-lg">
                            <Edit3 size={16} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-info-900 dark:text-info-100 text-sm">Keep it Concise</h4>
                            <p className="text-xs text-info-800 dark:text-info-200">Limit to 1-2 pages and use bullet points</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-success-500 rounded-lg">
                            <Award size={16} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-success-900 dark:text-success-100 text-sm">Quantify Achievements</h4>
                            <p className="text-xs text-success-800 dark:text-success-200">Use numbers and percentages when possible</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-warning-500 rounded-lg">
                            <Heart size={16} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-warning-900 dark:text-warning-100 text-sm">Tailor for Each Job</h4>
                            <p className="text-xs text-warning-800 dark:text-warning-200">Customize your resume for each application</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeBuilder;
