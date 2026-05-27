'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { mspLearningActivities, type MspLearningActivity, type MspLearningActivityType } from '@/data/mspLearningActivities';
import { 
  getLearningProgress,
  getLearningStats, 
  getDueReviewSuggestions,
  markActivityComplete,
  unmarkActivityComplete,
  saveActivityReflection,
  saveInteractiveLearningResult,
  type InteractiveLearningResult
} from '@/lib/mspLearningProgress';
import { getStoredQuizAttempts, getBestQuizScore } from '@/lib/mspQuizProgress';
import { getStoredScenarioStatuses, getScenarioProgressStatus } from '@/lib/mspProgress';
import { mspScenarios } from '@/data/mspScenarios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { InteractiveFlashcard } from '@/components/learning/InteractiveFlashcard';
import { InteractiveScenario } from '@/components/learning/InteractiveScenario';
import { MultipleChoiceQuiz } from '@/components/learning/MultipleChoiceQuiz';
import { RolePlayChat } from '@/components/learning/RolePlayChat';
import { ExternalLearningLinks } from '@/components/ExternalLearningLinks';
import { SaveStatus } from '@/components/SaveStatus';
import { useSaveStatus } from '@/hooks/useSaveStatus';
import { recordLearningActivityEvidence } from '@/lib/learningEvidence';
import { Layout } from '@/components/Layout';
import { HeroPanel, LearningCard, PageShell, SectionHeader, StatCard } from '@/components/academy';
import type { StatusBadgeVariant } from '@/components/academy/StatusBadge';
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
  ArrowRight,
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
  const reflectionSaveStatus = useSaveStatus();

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
      recordLearningActivityEvidence({
        activityId: activity.id,
        title: activity.title,
        domain: activity.domainLabel,
        minutes: activity.estimatedMinutes,
        status: 'completed',
      });
    }
  };

  const handleSaveReflection = () => {
    if (!selectedActivity || !reflectionText.trim()) return;
    void reflectionSaveStatus.runSave(async () => {
      saveActivityReflection(selectedActivity.id, reflectionText);
      recordLearningActivityEvidence({
        activityId: selectedActivity.id,
        title: selectedActivity.title,
        domain: selectedActivity.domainLabel,
        minutes: selectedActivity.estimatedMinutes,
        status: 'completed',
        notes: reflectionText,
      });
    });
  };

  const handleInteractiveComplete = (
    activity: MspLearningActivity,
    result: Omit<InteractiveLearningResult, 'activityId' | 'activityType' | 'completedAt'>
  ) => {
    const progressAfterResult = saveInteractiveLearningResult({
      activityId: activity.id,
      activityType: activity.activityType,
      ...result,
    });

    if (!completedIds.includes(activity.id)) {
      const progressAfterComplete = markActivityComplete(
        activity.id,
        activity.activityType,
        activity.domain,
        activity.estimatedMinutes
      );
      setCompletedIds(progressAfterComplete.completedActivityIds);
    } else {
      setCompletedIds(progressAfterResult.completedActivityIds);
    }

    setStats(getLearningStats());

    recordLearningActivityEvidence({
      activityId: activity.id,
      title: activity.title,
      domain: activity.domainLabel,
      minutes: activity.estimatedMinutes,
      status: 'completed',
      result: result.selfScore,
      score: result.score,
      maxScore: result.maxScore,
      notes: result.ticketNote ?? result.learnerAnswer,
    });
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
  const optionalExternalBooster = todayPractice[0];
  const recommendedIdSet = new Set(recommendations);

  const renderActivityInteraction = (activity: MspLearningActivity) => {
    const interactiveResult = getLearningProgress().interactiveResults[activity.id];

    switch (activity.activityType) {
      case 'flashcard':
        if (activity.interactive?.flashcard) {
          return (
            <InteractiveFlashcard
              prompt={activity.interactive.flashcard.prompt}
              answer={activity.interactive.flashcard.answer}
              previousSelfScore={interactiveResult?.selfScore}
              onComplete={(result) => handleInteractiveComplete(activity, result)}
            />
          );
        }

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

      case 'quiz':
        if (activity.interactive?.quiz) {
          return (
            <MultipleChoiceQuiz
              question={activity.interactive.quiz.question}
              choices={activity.interactive.quiz.choices}
              correctChoiceIndex={activity.interactive.quiz.correctChoiceIndex}
              explanation={activity.interactive.quiz.explanation}
              onComplete={(result) => handleInteractiveComplete(activity, result)}
            />
          );
        }
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{activity.instructions}</p>
            <div className="space-y-2">
              <p className="font-medium">Success criteria:</p>
              <ul className="text-sm space-y-1">
                {activity.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">-</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
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
            <SaveStatus status={reflectionSaveStatus.status} />
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
      case 'troubleshooting-flow':
        if (activity.interactive?.troubleshooting) {
          return (
            <InteractiveScenario
              scenarioDescription={activity.interactive.troubleshooting.scenarioDescription}
              steps={activity.interactive.troubleshooting.steps}
              previousTicketNote={interactiveResult?.ticketNote}
              onComplete={(result) => handleInteractiveComplete(activity, result)}
            />
          );
        }

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
        if (activity.interactive?.roleplay) {
          return (
            <RolePlayChat
              initialPrompt={activity.interactive.roleplay.initialPrompt}
              systemInstructions={activity.interactive.roleplay.systemInstructions}
              previousTranscript={interactiveResult?.transcript}
              onComplete={(result) => handleInteractiveComplete(activity, result)}
            />
          );
        }

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
    <Layout>
      <PageShell
        eyebrow="Learning"
        title="Learning Cockpit"
        subtitle="Your personalized MSP professional development coach — practise, reflect, and build evidence."
        actions={
          <Button size="sm" asChild>
            <Link href="/kb-learning-machine">
              <ArrowRight className="w-4 h-4 mr-2" /> KB Learning Machine
            </Link>
          </Button>
        }
      >
        <HeroPanel
          title="Keep your momentum going"
          subtitle="Start with the next best move, mix in today's practice, and save progress to your Evidence Pack."
          stats={[
            { label: 'Completed', value: stats.completedCount, helper: `of ${activities.length}` },
            { label: 'Minutes', value: stats.totalMinutes, helper: `${Math.round(stats.totalMinutes / 60 * 10) / 10}h logged` },
            { label: 'Domains', value: Object.keys(stats.domainCounts).length, helper: 'areas touched' },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CheckCircle} label="Activities completed" value={stats.completedCount} helper={`of ${activities.length} total`} />
          <StatCard icon={Clock} label="Minutes logged" value={stats.totalMinutes} helper={`${Math.round(stats.totalMinutes / 60 * 10) / 10} hours`} />
          <StatCard icon={Brain} label="Activity types" value={Object.values(stats.activityTypeCounts).filter((c) => c > 0).length} helper="types practised" />
          <StatCard icon={Target} label="Domains covered" value={Object.keys(stats.domainCounts).length} helper={`of ${new Set(activities.map((a) => a.domain)).size}`} />
        </div>

        <Card className="border-blue-100/80 dark:border-blue-900/40">
          <CardHeader>
            <SectionHeader
              icon={Lightbulb}
              title="Next best training move"
              description="Curated from your progress, quiz gaps, and scenario practice."
            />
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

        {optionalExternalBooster && (
          <div className="mb-6">
            <ExternalLearningLinks
              domain={optionalExternalBooster.domainLabel}
              activityTitle={optionalExternalBooster.title}
              heading="Optional 10-20 min external booster"
              limit={1}
              compact
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <SectionHeader icon={Target} title="Today's mixed practice" description="A balanced set for recall, scenarios, and communication." />
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
              <div className="mt-4">
                <ExternalLearningLinks
                  domain={weaknessCoaching.domainLabel}
                  activityTitle={`Weak area coaching ${weaknessCoaching.domainLabel}`}
                  heading="Targeted external resource recommendations"
                  limit={2}
                  compact
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <SectionHeader icon={Filter} title="Browse activities" description="Filter by domain, type, or difficulty." />
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => {
            const isCompleted = completedIds.includes(activity.id);
            return (
              <LearningCard
                key={activity.id}
                activityType={activity.activityType}
                title={activity.title}
                domain={activity.domainLabel}
                minutes={activity.estimatedMinutes}
                difficulty={activity.difficulty as StatusBadgeVariant}
                summary={activity.summary}
                isCompleted={isCompleted}
                isRecommended={recommendedIdSet.has(activity.id)}
                onStart={() => handleSelectActivity(activity)}
                onToggleComplete={() => handleToggleComplete(activity)}
              />
            );
          })}
        </div>
      </PageShell>

        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="academy-modal-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto">
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
                  
                  <div className="academy-surface-muted p-4">
                    {renderActivityInteraction(selectedActivity)}
                  </div>

                  <ExternalLearningLinks
                    domain={selectedActivity.domainLabel}
                    activityTitle={selectedActivity.title}
                    heading="Go deeper"
                    limit={3}
                    compact
                  />
                  
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
    </Layout>
  );
}
