import { useState, useMemo } from 'react';
import mspQuizQuestions, { quizCategories, quizDifficulties, type QuizQuestion, type QuizDifficulty, type QuizType } from '../data/mspQuiz';
import { microLearningCards } from '../data/microLearning';
import { mspScenarios } from '../data/mspScenarios';
import type { AvanceProgress } from '../utils/progressStorage';

type MspQuizProps = {
  progress: AvanceProgress;
  onNavigate?: (page: string) => void;
  updateProgress?: (newProgress: AvanceProgress) => void;
};

function MspQuiz({ progress, onNavigate, updateProgress }: MspQuizProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('All');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Filter questions based on selected criteria
  const filteredQuestions = useMemo(() => {
    return mspQuizQuestions.filter(q => {
      const categoryMatch = selectedCategory === 'All' || q.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  // Get random question from filtered pool
  const getRandomQuestion = () => {
    if (filteredQuestions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  };

  // Handle new question selection
  const handleNewQuestion = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setSelectedAnswer('');
    setShowResult(false);
    setIsCorrect(false);
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return;

    let correct = false;
    if (currentQuestion.type === 'true-false') {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.correctOptionId) {
      correct = selectedAnswer === currentQuestion.correctOptionId;
    }

    setIsCorrect(correct);
    setShowResult(true);
  };

  // Get similar questions for "try another"
  const getSimilarQuestions = () => {
    if (!currentQuestion) return [];
    return mspQuizQuestions.filter(q => 
      q.category === currentQuestion.category && 
      q.id !== currentQuestion.id &&
      q.difficulty === currentQuestion.difficulty
    ).slice(0, 3);
  };

  // Get linked learning content
  const getLinkedMicroCards = () => {
    if (!currentQuestion) return [];
    return microLearningCards.filter(card => 
      currentQuestion.linkedMicroCardIds.includes(card.id)
    );
  };

  const getLinkedScenarios = () => {
    if (!currentQuestion) return [];
    return mspScenarios.filter(scenario => 
      currentQuestion.linkedScenarioIds.includes(scenario.id)
    );
  };

  // Calculate quiz stats from progress
  const quizStats = useMemo(() => {
    const attempts = 0;
    const correct = 0;
    const incorrect = 0;
    const accuracy = 0;
    const missedCount = 0;
    const completedCount = 0;
    const lastQuizDate = 'Never';

    return { attempts, correct, incorrect, accuracy, missedCount, completedCount, lastQuizDate };
  }, [progress]);

  return (
    <div>
      <section className="card">
        <h1>Strict MSP Quiz</h1>
        <p>
          Test your knowledge with strict factual recall and decision-making questions. 
          These quizzes check whether you actually know MSP concepts, not just whether you can write a decent response.
        </p>
        
        {/* Quiz Stats */}
        <div className="metric-row">
          <span className="status-chip info">{quizStats.attempts} attempts</span>
          <span className="status-chip success">{quizStats.accuracy}% accuracy</span>
          <span className="status-chip warn">{quizStats.missedCount} missed</span>
          <span className="status-chip info">Last: {quizStats.lastQuizDate}</span>
        </div>
      </section>

      <section className="card">
        {/* Filters */}
        <div className="quiz-filters">
          <div className="filter-group">
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {quizCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Difficulty</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value as QuizDifficulty)}>
              <option value="All">All Levels</option>
              {quizDifficulties.map(diff => (
                <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
              ))}
            </select>
          </div>

          <button type="button" className="quiz-random-btn" onClick={handleNewQuestion}>
            🎲 Random Question
          </button>
        </div>

        {/* Question Count */}
        <div className="quiz-info">
          <p>{filteredQuestions.length} questions available</p>
        </div>

        {/* Question Display */}
        {currentQuestion ? (
          <div className="quiz-question-card">
            <div className="quiz-question-header">
              <span className={`quiz-category ${currentQuestion.difficulty}`}>
                {currentQuestion.category}
              </span>
              <span className={`quiz-difficulty ${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="quiz-type">{currentQuestion.type.replace('-', ' ')}</span>
            </div>

            <div className="quiz-question-content">
              <h3>{currentQuestion.question}</h3>

              {/* Answer Options */}
              <div className="quiz-options">
                {currentQuestion.type === 'true-false' ? (
                  <div className="quiz-true-false">
                    <label className="quiz-option">
                      <input
                        type="radio"
                        name="answer"
                        value="True"
                        checked={selectedAnswer === 'True'}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={showResult}
                      />
                      <span>True</span>
                    </label>
                    <label className="quiz-option">
                      <input
                        type="radio"
                        name="answer"
                        value="False"
                        checked={selectedAnswer === 'False'}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={showResult}
                      />
                      <span>False</span>
                    </label>
                  </div>
                ) : (
                  currentQuestion.options?.map(option => (
                    <label key={option.id} className={`quiz-option ${showResult ? (option.id === currentQuestion.correctOptionId ? 'correct' : option.id === selectedAnswer ? 'incorrect' : '') : ''}`}>
                      <input
                        type="radio"
                        name="answer"
                        value={option.id}
                        checked={selectedAnswer === option.id}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={showResult}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))
                )}
              </div>

              {/* Submit Button */}
              {!showResult && (
                <button 
                  type="button" 
                  className="quiz-submit-btn"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                >
                  Submit Answer
                </button>
              )}

              {/* Results */}
              {showResult && (
                <div className={`quiz-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="quiz-result-header">
                    <span className={`status-chip ${isCorrect ? 'success' : 'error'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>

                  <div className="quiz-explanation">
                    <h4>Explanation</h4>
                    <p>{currentQuestion.explanation}</p>
                    
                    {currentQuestion.whyTheWrongAnswersAreWrong && !isCorrect && (
                      <div className="quiz-wrong-explanation">
                        <h4>Why this is incorrect</h4>
                        <p>{currentQuestion.whyTheWrongAnswersAreWrong}</p>
                      </div>
                    )}
                  </div>

                  {/* Linked Learning */}
                  {(getLinkedMicroCards().length > 0 || getLinkedScenarios().length > 0) && (
                    <div className="quiz-linked-learning">
                      <h4>Related Learning</h4>
                      
                      {getLinkedMicroCards().length > 0 && (
                        <div className="quiz-linked-section">
                          <p>Micro-Learning cards:</p>
                          <div className="quiz-linked-items">
                            {getLinkedMicroCards().map(card => (
                              <button
                                key={card.id}
                                type="button"
                                className="quiz-linked-btn"
                                onClick={() => onNavigate?.('microLearning')}
                              >
                                📚 {card.topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {getLinkedScenarios().length > 0 && (
                        <div className="quiz-linked-section">
                          <p>Practice scenarios:</p>
                          <div className="quiz-linked-items">
                            {getLinkedScenarios().map(scenario => (
                              <button
                                key={scenario.id}
                                type="button"
                                className="quiz-linked-btn"
                                onClick={() => onNavigate?.('mspScenarios')}
                              >
                                🎯 {scenario.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="quiz-actions">
                    <button type="button" className="quiz-another-btn" onClick={handleNewQuestion}>
                      Try Another Question
                    </button>
                    
                    {getSimilarQuestions().length > 0 && (
                      <button 
                        type="button" 
                        className="quiz-similar-btn"
                        onClick={() => {
                          const similar = getSimilarQuestions();
                          if (similar.length > 0) {
                            setCurrentQuestion(similar[0]);
                            setSelectedAnswer('');
                            setShowResult(false);
                            setIsCorrect(false);
                          }
                        }}
                      >
                        Try Similar ({getSimilarQuestions().length} available)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="quiz-empty-state">
            <h3>Ready to test your knowledge?</h3>
            <p>Click "Random Question" to start the quiz, or filter by category and difficulty first.</p>
            <button type="button" className="quiz-start-btn" onClick={handleNewQuestion}>
              Start Quiz
            </button>
          </div>
        )}
      </section>

          </div>
  );
}

export default MspQuiz;
