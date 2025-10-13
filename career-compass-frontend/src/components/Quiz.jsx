import React, { useState, useEffect } from 'react';

const Quiz = ({ onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // New state to reliably trigger submission
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/roadmap/quiz');
        if (!response.ok) {
          throw new Error('Failed to fetch quiz questions.');
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // FIXED: This useEffect will run only after isQuizFinished becomes true,
  // guaranteeing that selectedAnswers is up-to-date.
  useEffect(() => {
    if (isQuizFinished) {
      submitAnswers(selectedAnswers);
    }
  }, [isQuizFinished, selectedAnswers]);

  const handleOptionSelect = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer = {
      questionId: currentQuestion._id,
      optionText: option.optionText,
    };
    
    // This state update will queue, but not complete immediately
    setSelectedAnswers(prevAnswers => [...prevAnswers, newAnswer]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Instead of calling submit directly, we set this flag.
      // The useEffect above will detect this change and call submitAnswers.
      setIsQuizFinished(true);
    }
  };

  // The function now accepts the final answers as an argument
  // In Quiz.jsx

  const submitAnswers = async (finalAnswers) => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/roadmap/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ answers: finalAnswers }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to generate recommendations.');

    if (onQuizComplete) {
      onQuizComplete(data.recommendations);
    }
  } catch (err) {
    console.error('Error submitting answers:', err);
    setError(err.message || 'Something went wrong while submitting your answers.');
  } finally {
    setLoading(false);
  }
};


  if (loading || (questions.length === 0 && !error)) return (<div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">Loading Quiz...</div>);
  if (error) return (<div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">Error: {error}</div>);
  if (isQuizFinished) return (<div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">Analyzing your results...</div>);


  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0E0E1A] text-white p-4">
      <div className="w-full max-w-xl p-8 rounded-3xl backdrop-blur-sm bg-white/5 shadow-2xl border border-white/10 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Career Discovery Quiz
        </h2>
        <p className="text-lg text-gray-300 text-center mb-8">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">{currentQuestion.questionText}</h3>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left px-6 py-4 rounded-lg bg-gray-700/50 hover:bg-purple-600/50 transition-colors duration-300"
              >
                {option.optionText}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center">
          Your answers help us find the perfect career path for you.
        </p>
      </div>
    </div>
  );
};

export default Quiz;