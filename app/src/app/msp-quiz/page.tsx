'use client';

import { useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mspQuizQuestions, MspQuizQuestion, MspQuizDomain } from '@/data/mspQuizQuestions';
import { getStoredQuizAttempts, saveQuizAttempt, getBestQuizScore, MspQuizAttempt } from '@/lib/mspQuizProgress';
import { CheckCircle2, XCircle, Trophy, Target, TrendingUp } from 'lucide-react';

const domainLabels: Record<MspQuizDomain, string> = {
  "helpdesk-triage": "Helpdesk Triage",
  "ticketing-escalation": "Ticketing & Escalation",
  "windows-support": "Windows Support",
  "m365-admin": "Microsoft 365 Admin",
  "entra-identity": "Entra ID & Identity",
  "intune-endpoint": "Intune & Endpoint",
  "google-workspace-admin": "Google Workspace Admin",
  "email-dns": "Email & DNS",
  "networking": "Networking",
  "wifi": "Wi-Fi",
  "printers": "Printers",
  "cybersecurity": "Cybersecurity",
  "backup-dr": "Backup & DR",
  "rmm-psa": "RMM & PSA",
  "powershell-cli": "PowerShell & CLI",
  "client-communication": "Client Communication",
  "change-risk": "Change & Risk",
  "passwords-identity": "Passwords & Identity",
  "macos-support": "macOS Support",
  "mobile-support": "Mobile Support"
};

type QuizState = 'setup' | 'quiz' | 'result';

type QuizAnswer = {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  question: MspQuizQuestion;
};

export default function MspQuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [selectedDomain, setSelectedDomain] = useState<MspQuizDomain | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const filteredQuestions = useMemo(() => {
    let questions = mspQuizQuestions;

    if (selectedDomain !== 'all') {
      questions = questions.filter(q => q.domain === selectedDomain);
    }

    if (selectedDifficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === selectedDifficulty);
    }

    // Shuffle and limit
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  }, [selectedDomain, selectedDifficulty, questionCount]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedAnswer,
      isCorrect,
      question: currentQuestion
    };

    setAnswers(prev => [...prev, answer]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate results
      const correct = answers.filter(a => a.isCorrect).length + (selectedAnswer === currentQuestion.correctAnswerIndex ? 1 : 0);
      const total = filteredQuestions.length;
      const percentage = Math.round((correct / total) * 100);

      // Domain breakdown
      const allAnswers = [...answers];
      if (selectedAnswer !== null) {
        allAnswers.push({
          questionId: currentQuestion.id,
          selectedIndex: selectedAnswer,
          isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex,
          question: currentQuestion
        });
      }

      const domainBreakdown: Record<string, { correct: number; total: number }> = {};
      allAnswers.forEach(answer => {
        const domain = answer.question.domain;
        if (!domainBreakdown[domain]) {
          domainBreakdown[domain] = { correct: 0, total: 0 };
        }
        domainBreakdown[domain].total++;
        if (answer.isCorrect) {
          domainBreakdown[domain].correct++;
        }
      });

      // Weakest domains
      const weakestDomains = Object.entries(domainBreakdown)
        .map(([domain, stats]) => ({
          domain,
          percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
        }))
        .sort((a, b) => a.percentage - b.percentage)
        .slice(0, 3)
        .map(item => domainLabels[item.domain as MspQuizDomain] || item.domain);

      const attempt: MspQuizAttempt = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        totalQuestions: total,
        correct,
        percentage,
        domainBreakdown,
        weakestDomains
      };

      saveQuizAttempt(attempt);
      setQuizState('result');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleStartQuiz = () => {
    if (filteredQuestions.length === 0) return;
    setQuizState('quiz');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleRestart = () => {
    setQuizState('setup');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const correctCount = answers.filter(a => a.isCorrect).length + (showFeedback && selectedAnswer === currentQuestion?.correctAnswerIndex ? 1 : 0);
  const totalAnswered = answers.length + (showFeedback ? 1 : 0);

  const recentAttempts = getStoredQuizAttempts().slice(0, 3);
  const bestScore = getBestQuizScore();

  if (quizState === 'result') {
    const finalCorrect = answers.filter(a => a.isCorrect).length;
    const finalTotal = filteredQuestions.length;
    const finalPercentage = Math.round((finalCorrect / finalTotal) * 100);

    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Here's how you performed
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-blue-600">{finalPercentage}%</div>
                  <div className="text-xl text-gray-600 dark:text-gray-400">
                    {finalCorrect} out of {finalTotal} correct
                  </div>
                  <div className="flex justify-center gap-2">
                    {finalPercentage >= 80 && <Badge className="bg-green-100 text-green-800">Excellent!</Badge>}
                    {finalPercentage >= 60 && finalPercentage < 80 && <Badge className="bg-yellow-100 text-yellow-800">Good job</Badge>}
                    {finalPercentage < 60 && <Badge className="bg-red-100 text-red-800">Keep practicing</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Domain Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(
                    answers.reduce((acc, answer) => {
                      const domain = answer.question.domain;
                      if (!acc[domain]) acc[domain] = { correct: 0, total: 0 };
                      acc[domain].total++;
                      if (answer.isCorrect) acc[domain].correct++;
                      return acc;
                    }, {} as Record<string, { correct: number; total: number }>)
                  ).map(([domain, stats]) => (
                    <div key={domain} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{domainLabels[domain as MspQuizDomain]}</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.correct}/{stats.total}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(
                      answers.reduce((acc, answer) => {
                        const domain = answer.question.domain;
                        if (!acc[domain]) acc[domain] = { correct: 0, total: 0 };
                        acc[domain].total++;
                        if (answer.isCorrect) acc[domain].correct++;
                        return acc;
                      }, {} as Record<string, { correct: number; total: number }>)
                    )
                      .map(([domain, stats]) => ({
                        domain,
                        percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
                      }))
                      .sort((a, b) => a.percentage - b.percentage)
                      .slice(0, 3)
                      .map(item => (
                        <li key={item.domain} className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          {domainLabels[item.domain as MspQuizDomain]}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={handleRestart} size="lg">
                Take Another Quiz
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (quizState === 'quiz' && currentQuestion) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Score: {correctCount}/{totalAnswered}
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <CardTitle className="text-xl leading-tight">{currentQuestion.question}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{currentQuestion.domainLabel}</Badge>
                    <Badge variant="outline" className="capitalize">{currentQuestion.difficulty}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "w-full text-left justify-start p-4 h-auto whitespace-normal";
                    let icon = null;

                    if (showFeedback) {
                      if (index === currentQuestion.correctAnswerIndex) {
                        buttonClass += " bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200";
                        icon = <CheckCircle2 className="h-4 w-4 text-green-600" />;
                      } else if (index === selectedAnswer) {
                        buttonClass += " bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200";
                        icon = <XCircle className="h-4 w-4 text-red-600" />;
                      } else {
                        buttonClass += " opacity-50";
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className={buttonClass}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                      >
                        <div className="flex items-start gap-3 w-full">
                          {icon}
                          <span className="flex-1">{option}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      {selectedAnswer === currentQuestion.correctAnswerIndex ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-200">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800 dark:text-red-200">Incorrect</span>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Explanation:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{currentQuestion.explanation}</p>
                    </div>
                    {currentQuestion.commonMistake && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Common Mistake:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{currentQuestion.commonMistake}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <div></div>
                  {showFeedback ? (
                    <Button onClick={handleNextQuestion}>
                      {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                    >
                      Submit Answer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MSP Quiz Trainer</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
              Test your MSP knowledge across helpdesk, technical, and professional domains. Get instant feedback and track your improvement over time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Domain</label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value as MspQuizDomain | 'all')}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Domains</option>
                    {Object.entries(domainLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'all')}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Questions</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={40}>40 Questions</option>
                  </select>
                </div>

                <Button
                  onClick={handleStartQuiz}
                  disabled={filteredQuestions.length === 0}
                  className="w-full"
                  size="lg"
                >
                  Start Quiz ({filteredQuestions.length} questions)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Attempts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAttempts.length > 0 ? (
                  recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="text-sm">
                      <div className="font-medium">{attempt.percentage}%</div>
                      <div className="text-muted-foreground">
                        {new Date(attempt.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No attempts yet</p>
                )}
                {bestScore && (
                  <div className="pt-3 border-t">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      Best: {bestScore.percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(bestScore.date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}