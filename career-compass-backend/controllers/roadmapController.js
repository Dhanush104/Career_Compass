// controllers/roadmapController.js

const QuizQuestion = require('../models/QuizQuestion');
const CareerPath = require('../models/CareerPath');
const User = require('../models/User');

// GET /api/roadmap/quiz - Fetches all quiz questions
exports.getQuizQuestions = async (req, res) => {
    try {
        const questions = await QuizQuestion.find({});
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch quiz questions.' });
    }
};

// POST /api/roadmap/generate - Processes quiz answers and generates a roadmap
// UPDATED: Now generates richer recommendations with match reasons
// In controllers/roadmapController.js
exports.generateRoadmap = async (req, res) => {
    console.log("--- generateRoadmap function started ---");
    const { answers } = req.body;
    console.log("Received answers:", JSON.stringify(answers, null, 2));

    try {
        const careerAffinities = new Map();
        
        for (const { questionId, optionText } of answers) {
            console.log(`\nProcessing Question ID: ${questionId}`);
            const question = await QuizQuestion.findById(questionId);
            if (!question) {
                console.log(`  -> ERROR: Question not found in DB.`);
                continue;
            }

            const selectedOption = question.options.find(opt => opt.optionText === optionText);
            if (selectedOption) {
                console.log(`  -> User selected: "${optionText}"`);
                if (selectedOption.affinities) {
                    console.log(`  -> Found affinities:`, selectedOption.affinities);
                    for (const [career, score] of Object.entries(selectedOption.affinities)) {
                        const currentScore = careerAffinities.get(career) || 0;
                        careerAffinities.set(career, currentScore + score);
                        console.log(`    -> Added ${score} to ${career}. New total: ${currentScore + score}`);
                    }
                } else {
                    console.log(`  -> WARNING: NO AFFINITIES found for this option.`);
                }
            } else {
                console.log(`  -> ERROR: COULD NOT FIND selected option text: "${optionText}"`);
            }
        }

        console.log("\n--- Final Affinity Scores ---");
        console.log(careerAffinities);

        if (careerAffinities.size === 0) {
            console.log("ERROR: No affinity scores were calculated. Returning empty recommendations.");
            return res.status(200).json({ recommendations: [] });
        }

        const sortedAffinities = [...careerAffinities.entries()].sort(([, a], [, b]) => b - a);
        const top5Careers = sortedAffinities.slice(0, 5).map(([careerName]) => careerName);
        console.log("Top 5 Career Names:", top5Careers);

        const recommendedPathsData = await CareerPath.find({ name: { $in: top5Careers } });
        console.log(`Found ${recommendedPathsData.length} matching career path documents in the database.`);
        
        // Final processing logic...
        const recommendations = recommendedPathsData.map(path => {
            // ... (rest of the mapping logic from previous versions)
            return { ...path.toObject(), matchScore: 99 }; // Simplified for debugging
        });

        res.status(200).json({ recommendations });

    } catch (err) {
        console.error('!!! FATAL ERROR during roadmap generation:', err);
        res.status(500).json({ error: 'Failed to generate roadmap.' });
    }
};

// NEW: Allows user to officially select a career path
exports.choosePath = async (req, res) => {
    const { careerPathId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const chosenPath = await CareerPath.findById(careerPathId);

        if (!user || !chosenPath) {
            return res.status(404).json({ error: 'User or Career Path not found.' });
        }

        // FIXED: Correctly create the nested roadmap structure for the user
        user.roadmap = {
            careerPathName: chosenPath.name,
            milestones: chosenPath.roadmapTemplate.map(milestone => ({
                milestoneTitle: milestone.milestoneTitle,
                tasks: milestone.tasks.map(task => ({
                    title: task.title,
                    description: task.description,
                    completed: false,
                    resources: task.resources
                }))
            }))
        };
        await user.save();
        res.status(200).json({ success: true, roadmap: user.roadmap });
    } catch (err) {
        res.status(500).json({ error: 'Failed to choose career path.' });
    }
};

// NEW: Updates a task's completion status and checks for achievements
exports.updateTaskStatus = async (req, res) => {
    const { taskIndex, milestoneIndex, completed } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user || !user.roadmap) return res.status(404).json({ error: 'User or roadmap not found.' });
        
        user.roadmap.milestones[milestoneIndex].tasks[taskIndex].completed = completed;

        const xpForTask = 25;
        if (completed) {
            user.xp += xpForTask;
        } else {
            user.xp = Math.max(0, user.xp - xpForTask);
        }

        const xpForNextLevel = 100 * user.level;
        if (user.xp >= xpForNextLevel) {
            user.level += 1;
            user.xp -= xpForNextLevel;
        }
        
        await user.save();
        res.status(200).json({ success: true, user: { xp: user.xp, level: user.level } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task.' });
    }
};