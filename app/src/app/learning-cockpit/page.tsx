'use client';

import { useMemo, useState } from 'react';
import { mspLearningActivities, type MspLearningActivity, type MspLearningActivityType } from '@/data/mspLearningActivities';
import { 
  getLearningProgress,
  getLearningStats, 
  getDueReviewSuggestions,
  markActivityComplete,
  unmarkActivityComplete,
  saveActivityReflection
} from '@/lib/mspLearningProgress';
import { getStoredQuizAttempts, getBestQuizScore } from '@/lib/mspQuizProgress';
import { getStoredScenarioStatuses, getScenarioProgressStatus } from '@/lib/mspProgress';
import { mspScenarios } from '@/data/mspScenarios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Target, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  PlayCircle, 
  MessageSquare, 
  ListChecks, 
  FileText, 
  Zap,
  TrendingUp,
  Lightbulb,
  Filter
} from 'lucide-react';

const activityTypeIcons: Record<MspLearningActivityType, React.ComponentType<React.SVGAttributes<SVGElement>>> = {
  read: BookOpen,
  watch: PlayCircle,
  flashcard: Brain,
  scenario: Target,
  quiz: Brain,
  'command-practice': Zap,
  'ticket-note': FileText,
  roleplay: MessageSquare,
  reflection: Lightbulb,
  checklist: ListChecks,
  'mini-project': FileText,
  'troubleshooting-flow': TrendingUp,
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function LearningCockpit() {
  const [activities] = useState<MspLearningActivity[]>(mspLearningActivities);
  const [selectedActivity, setSelectedActivity] = useState<MspLearningActivity | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => getLearningProgress().completedActivityIds);
  const [stats, setStats] = useState(() => getLearningStats());
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterType, setFilterType] = useState<MspLearningActivityType | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [reflectionText, setReflectionText] = useState('');
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);

  const { recommendations, todayPractice } = useMemo(() => {
    const quizAttempts = getStoredQuizAttempts();
    const bestQuizScore = getBestQuizScore();
    const scenarioStatuses = getStoredScenarioStatuses();
    const weakQuizDomains = quizAttempts[0]?.weakestDomains || [];
    const scenariosNeedingPractice = mspScenarios.filter(scenario => {
      const status = getScenarioProgressStatus(scenarioStatuses, scenario.id);
      return status !== 'confident';
    });

    const enhancedRecommendations = getDueReviewSuggestions(activities);

    if (weakQuizDomains.length > 0 || (bestQuizScore && bestQuizScore.percentage < 80)) {
      const weakDomainActivities = activities.filter(a =>
        !completedIds.includes(a.id) &&
        weakQuizDomains.includes(a.relatedQuizDomain || '') &&
        a.activityType !== 'quiz'
      );

      weakDomainActivities.slice(0, 2).forEach(activity => {
        if (!enhancedRecommendations.includes(activity.id)) {
          enhancedRecommendations.unshift(activity.id);
        }
      });
    }

    if (scenariosNeedingPractice.length > 0) {
      const scenarioActivities = activities.filter(a =>
        !completedIds.includes(a.id) &&
        (a.activityType === 'scenario' || a.activityType === 'troubleshooting-flow')
      );

      scenarioActivities.slice(0, 1).forEach(activity => {
        if (!enhancedRecommendations.includes(activity.id)) {
          enhancedRecommendations.unshift(activity.id);
        }
      });
    }

    const incomplete = activities.filter(a => !completedIds.includes(a.id));
    const practice: MspLearningActivity[] = [];

    const recall = incomplete.find(a => a.activityType === 'flashcard' || a.activityType === 'quiz');
    if (recall) practice.push(recall);

    let scenario = incomplete.find(a => a.activityType === 'scenario' || a.activityType === 'troubleshooting-flow');
    if (!scenario && scenariosNeedingPractice.length > 0) {
      const weakScenarioCategories = [...new Set(scenariosNeedingPractice.map(s => s.category))];
      scenario = incomplete.find(a =>
        (a.activityType === 'scenario' || a.activityType === 'troubleshooting-flow') &&
        weakScenarioCategories.includes(a.domain)
      );
    }
    if (scenario) practice.push(scenario);

    const communication = incomplete.find(a => a.activityType === 'roleplay' || a.activityType === 'reflection');
    if (communication) practice.push(communication);

    const evidence = incomplete.find(a => a.activityType === 'checklist' || a.activityType === 'mini-project' || a.activityType === 'ticket-note');
    if (evidence) practice.push(evidence);

    return {
      recommendations: enhancedRecommendations.slice(0, 5),
      todayPractice: practice.slice(0, 4),
    };
  }, [activities, completedIds]);

  const handleSelectActivity = (activity: MspLearningActivity) => {
    const progress = getLearningProgress();
    setSelectedActivity(activity);
    setReflectionText(progress.reflections[activity.id] || '');
    setShowFlashcardAnswer(false);
  };

  const filteredActivities = activities.filter(activity => {
    if (filterDomain !== 'all' && activity.domain !== filterDomain) return false;
    if (filterType !== 'all' && activity.activityType !== filterType) return false;
    if (filterDifficulty !== 'all' && activity.difficulty !== filterDifficulty) return false;
    return true;
  });

  const handleToggleComplete = (activity: MspLearningActivity) => {
    if (completedIds.includes(activity.id)) {
      const newProgress = unmarkActivityComplete(activity.id);
      setCompletedIds(newProgress.completedActivityIds);
      setStats(getLearningStats());
    } else {
      const newProgress = markActivityComplete(activity.id, activity.activityType, activity.domain, activity.estimatedMinutes);
      setCompletedIds(newProgress.completedActivityIds);
      setStats(getLearningStats());
    }
  };

  const handleSaveReflection = () => {
    if (selectedActivity && reflectionText.trim()) {
      saveActivityReflection(selectedActivity.id, reflectionText);
    }
  };

  const getRecommendedActivities = () => {
    return recommendations
      .slice(0, 3)
      .map(id => activities.find(a => a.id === id))
      .filter((activity): activity is MspLearningActivity => Boolean(activity));
  };

  const getWeaknessCoaching = () => {
    const domainScores = activities.reduce<Record<string, { label: string; total: number; completed: number }>>((acc, activity) => {
      acc[activity.domain] ??= { label: activity.domainLabel, total: 0, completed: 0 };
      acc[activity.domain].total += 1;
      if (completedIds.includes(activity.id)) {
        acc[activity.domain].completed += 1;
      }
      return acc;
    }, {});

    const weakestDomain = Object.entries(domainScores)
      .filter(([, score]) => score.completed < score.total)
      .sort(([, a], [, b]) => (a.completed / a.total) - (b.completed / b.total))[0];

    if (!weakestDomain) return null;

    const [weakDomain, score] = weakestDomain;
    const domainActivities = activities.filter(a => a.domain === weakDomain && !completedIds.includes(a.id));
    const readActivity = domainActivities.find(a => a.activityType === 'read');
    const scenarioActivity = domainActivities.find(a => a.activityType === 'scenario');
    const checklistActivity = domainActivities.find(a => a.activityType === 'checklist');
    const quizActivity = domainActivities.find(a => a.activityType === 'quiz');
    
    return {
      domain: weakDomain,
      domainLabel: score.label,
      activities: { readActivity, scenarioActivity, checklistActivity, quizActivity }
    };
  };

  const weaknessCoaching = getWeaknessCoaching();
  const recommendedActivities = getRecommendedActivities();

  const renderActivityInteraction = (activity: MspLearningActivity) => {
    switch (activity.activityType) {
      case 'flashcard':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <p className="font-medium">{activity.instructions}</p>
            </div>
            {!showFlashcardAnswer && (
              <Button onClick={() => setShowFlashcardAnswer(true)} variant="outline">
                Reveal Answer
              </Button>
            )}
            {showFlashcardAnswer && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm">{activity.successCriteria.join(', ')}</p>
              </div>
            )}
          </div>
        );
      
      case 'reflection':
        const progress = getLearningProgress();
        const savedReflection = progress.reflections[activity.id];
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{activity.instructions}</p>
            {savedReflection && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Previous reflection:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{savedReflection}</p>
              </div>
            )}
            <Textarea
              placeholder="Write your reflection here..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSaveReflection} disabled={!reflectionText.trim()}>
              Save Reflection
            </Button>
          </div>
        );
      
      case 'checklist':
        return (
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-400">{activity.instructions}</p>
            {activity.successCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <label className="text-sm">{criteria}</label>
              </div>
            ))}
          </div>
        );
      
      case 'scenario':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
              <p className="font-medium">Scenario:</p>
              <p className="text-sm mt-1">{activity.instructions}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Key considerations:</p>
              <ul className="text-sm space-y-1">
                {activity.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'command-practice':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{activity.instructions}</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <p># Commands to practice:</p>
              <p>ipconfig /all</p>
              <p>ping 8.8.8.8</p>
              <p>nslookup google.com</p>
              <p>tracert 8.8.8.8</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Each command helps verify different aspects of network connectivity.
            </p>
          </div>
        );
      
      case 'roleplay':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="font-medium text-purple-800 dark:text-purple-300">User says:</p>
              <p className="text-sm mt-1 italic">&quot;I don&apos;t understand why I need this MFA thing. It&apos;s so annoying!&quot;</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-medium text-blue-800 dark:text-blue-300">Your response should:</p>
              <ul className="text-sm mt-2 space-y-1">
                {activity.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{activity.instructions}</p>
            <div className="space-y-2">
              <p className="font-medium">Success criteria:</p>
              <ul className="text-sm space-y-1">
                {activity.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Cockpit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your personalized MSP professional development coach
          </p>
        </div>

        {/* Readiness Pulse */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCount}</div>
              <p className="text-xs text-muted-foreground">
                of {activities.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minutes Logged</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMinutes}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(stats.totalMinutes / 60 * 10) / 10} hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity Types</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(stats.activityTypeCounts).filter(count => count > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                types practiced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domains Covered</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.domainCounts).length}</div>
              <p className="text-xs text-muted-foreground">
                of {new Set(activities.map(a => a.domain)).size} domains
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Next Best Training Move */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Next Best Training Move
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendedActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedActivities.map(activity => {
                  const Icon = activityTypeIcons[activity.activityType];
                  
                  return (
                    <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={difficultyColors[activity.difficulty]}>
                          {activity.difficulty}
                        </Badge>
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <h3 className="font-medium text-sm">{activity.title}</h3>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{activity.domainLabel}</Badge>
                        <span>{activity.estimatedMinutes} min</span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.whyItMatters}
                      </p>
                      
                    <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleSelectActivity(activity)}
                      >
                        Start Activity
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Great progress! No specific recommendations right now.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Today's Mixed Practice */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today&apos;s Mixed Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayPractice.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {todayPractice.map(activity => {
                  const Icon = activityTypeIcons[activity.activityType];
                  const isCompleted = completedIds.includes(activity.id);
                  
                  return (
                    <div key={activity.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{activity.activityType}</Badge>
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <h3 className="font-medium text-sm">{activity.title}</h3>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.estimatedMinutes} min</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.difficulty}
                        </Badge>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant={isCompleted ? "secondary" : "default"}
                        className="w-full"
                        onClick={() => handleSelectActivity(activity)}
                      >
                        {isCompleted ? "Review" : "Start"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No mixed practice activities available. Complete some activities to unlock new recommendations!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weak Area Coaching */}
        {weaknessCoaching && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weak Area Coaching: {weaknessCoaching.domainLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Focus on {weaknessCoaching.domainLabel} with this learning sequence:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { activity: weaknessCoaching.activities.readActivity, label: "Read" },
                  { activity: weaknessCoaching.activities.scenarioActivity, label: "Scenario" },
                  { activity: weaknessCoaching.activities.checklistActivity, label: "Checklist" },
                  { activity: weaknessCoaching.activities.quizActivity, label: "Quiz" }
                ].map(({ activity, label }, index) => (
                  <div key={index} className="border rounded-lg p-3 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                    {activity ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={() => handleSelectActivity(activity)}
                      >
                        {activity.title.slice(0, 30)}...
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">No {label.toLowerCase()} available</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Mode Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Learning Mode Selector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Domain</label>
                <select 
                  value={filterDomain} 
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Domains</option>
                  {Array.from(new Map(activities.map(a => [a.domain, a.domainLabel])).entries()).map(([domain, label]) => (
                    <option key={domain} value={domain}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Activity Type</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value as MspLearningActivityType | 'all')}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  {Array.from(new Set(activities.map(a => a.activityType))).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <select 
                  value={filterDifficulty} 
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map(activity => {
            const Icon = activityTypeIcons[activity.activityType];
            const isCompleted = completedIds.includes(activity.id);
            
            return (
              <Card key={activity.id} className={`relative ${isCompleted ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {activity.activityType}
                    </Badge>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm text-gray-900 dark:text-white">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {activity.domainLabel}
                    </Badge>
                    <span>{activity.estimatedMinutes} min</span>
                    <Badge className={difficultyColors[activity.difficulty]}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {activity.summary}
                  </p>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.whyItMatters}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSelectActivity(activity)}
                    >
                      {isCompleted ? "Review" : "Start"}
                    </Button>
                    <Button
                      size="sm"
                      variant={isCompleted ? "secondary" : "outline"}
                      onClick={() => handleToggleComplete(activity)}
                    >
                      {isCompleted ? "✓" : "○"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedActivity.title}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedActivity(null);
                      setShowFlashcardAnswer(false);
                      setReflectionText('');
                    }}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedActivity.activityType}</Badge>
                    <Badge variant="outline">{selectedActivity.domainLabel}</Badge>
                    <Badge className={difficultyColors[selectedActivity.difficulty]}>
                      {selectedActivity.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedActivity.estimatedMinutes} minutes
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Summary</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedActivity.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Why It Matters</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedActivity.whyItMatters}
                    </p>
                  </div>
                  
                  {renderActivityInteraction(selectedActivity)}
                  
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Evidence Examples</h3>
                    <ul className="text-sm space-y-1">
                      {selectedActivity.evidenceExamples.map((example, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => handleToggleComplete(selectedActivity)}
                    >
                      {completedIds.includes(selectedActivity.id) ? "Mark as Incomplete" : "Mark as Complete"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedActivity(null);
                        setShowFlashcardAnswer(false);
                        setReflectionText('');
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
