import React, { useState, useEffect } from 'react';

const Quiz = ({ onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

    setSelectedAnswers((prev) => [...prev, newAnswer]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

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

  if (loading || (questions.length === 0 && !error))
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700">Loading Quiz...</div>;
  if (error)
    return <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">Error: {error}</div>;
  if (isQuizFinished)
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700">Analyzing your results...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-10 border border-gray-200">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm mt-1 text-orange-600 font-medium">
            {Math.round(progress)}%
          </p>
        </div>

        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left px-6 py-4 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:border-orange-500 transition-all duration-300 text-gray-800"
            >
              {option.optionText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
