'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  kbConfidenceLabels,
  kbFieldCards,
  type KbConfidence,
  type KbFieldCard,
  type KbReviewRating,
} from '@/data/kbFieldCards';
import {
  buildKbFlashcards,
  buildKbScenarioPrompt,
  formatKbReviewDate,
  getKbCardsDueToday,
  getKbEvidenceSummary,
  getKbLearningProgress,
  getLowConfidenceCards,
  mergeKbCardsWithProgress,
  recordKbReview,
  saveKbReflection,
  saveKbScenarioPractice,
  saveKbTicketNotePractice,
  updateKbConfidence,
  type KbProgressByCardId,
  type KbTicketNotePractice,
} from '@/lib/kbLearningProgress';
import {
  Archive,
  BookOpen,
  CalendarClock,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Layers,
  Search,
  Target,
} from 'lucide-react';

type TicketNoteDraft = Omit<KbTicketNotePractice, 'savedAt'>;

const emptyTicketNote: TicketNoteDraft = {
  summary: '',
  environment: '',
  checksPerformed: '',
  actionTaken: '',
  result: '',
  followUp: '',
  escalation: '',
  nextStep: '',
};

const reviewRatings: KbReviewRating[] = ['Again', 'Hard', 'Good', 'Easy'];

const confidenceOptions: KbConfidence[] = [
  'recognise',
  'explain',
  'follow-with-kb',
  'with-support',
  'independent',
  'teach',
];

const ticketNoteFields: Array<{ key: keyof TicketNoteDraft; label: string; placeholder: string }> = [
  { key: 'summary', label: 'Summary', placeholder: 'What was the request or issue?' },
  { key: 'environment', label: 'Environment', placeholder: 'Device, mailbox, tenant, app, or generic context.' },
  { key: 'checksPerformed', label: 'Checks performed', placeholder: 'What did you verify first?' },
  { key: 'actionTaken', label: 'Action taken', placeholder: 'What safe action did you take?' },
  { key: 'result', label: 'Result', placeholder: 'What changed or what did the user confirm?' },
  { key: 'followUp', label: 'Follow-up', placeholder: 'What still needs to happen?' },
  { key: 'escalation', label: 'Escalation', placeholder: 'When would this need escalation?' },
  { key: 'nextStep', label: 'Next step', placeholder: 'What is the next clear action?' },
];

const toTicketNoteMarkdown = (note: TicketNoteDraft) =>
  ticketNoteFields
    .map(({ key, label }) => `${label}: ${note[key].trim() || 'Not captured yet.'}`)
    .join('\n');

export default function KbLearningMachinePage() {
  const [progress, setProgress] = useState<KbProgressByCardId>(() => getKbLearningProgress());
  const cards = useMemo(() => mergeKbCardsWithProgress(kbFieldCards, progress), [progress]);
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? '');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [scenarioResponse, setScenarioResponse] = useState('');
  const [ticketNote, setTicketNote] = useState<TicketNoteDraft>(emptyTicketNote);
  const [reflectionText, setReflectionText] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? cards[0];
  const selectedProgress = selectedCard ? progress[selectedCard.id] : undefined;
  const dueCards = getKbCardsDueToday(cards);
  const lowConfidenceCards = getLowConfidenceCards(cards);
  const evidenceSummary = getKbEvidenceSummary(cards, progress);

  const categories = Array.from(new Set(cards.map((card) => card.category))).sort();

  const filteredCards = cards.filter((card) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      [
        card.title,
        card.category,
        card.whenToUse,
        card.relatedSkill,
        ...card.prerequisites,
        ...card.firstChecks,
        ...card.coreSteps,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    const matchesCategory = categoryFilter === 'all' || card.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selectedFlashcards = selectedCard ? buildKbFlashcards(selectedCard) : [];
  const activeFlashcard = selectedFlashcards[activeFlashcardIndex] ?? selectedFlashcards[0];
  const dailyReviewCard = dueCards[0] ?? lowConfidenceCards[0] ?? cards[0];
  const dailyScenarioCard = lowConfidenceCards.find((card) => card.id !== dailyReviewCard?.id) ?? dailyReviewCard;

  const refreshProgress = (nextProgress: KbProgressByCardId, message: string) => {
    setProgress({ ...nextProgress });
    setSaveMessage(message);
    window.setTimeout(() => setSaveMessage(''), 1800);
  };

  const handleSelectCard = (card: KbFieldCard) => {
    setSelectedCardId(card.id);
    setActiveFlashcardIndex(0);
    setShowFlashcardAnswer(false);
    setScenarioResponse(progress[card.id]?.scenarioPractice?.response ?? '');
    const savedNote = progress[card.id]?.ticketNotePractice;
    setTicketNote(savedNote ? {
      summary: savedNote.summary,
      environment: savedNote.environment,
      checksPerformed: savedNote.checksPerformed,
      actionTaken: savedNote.actionTaken,
      result: savedNote.result,
      followUp: savedNote.followUp,
      escalation: savedNote.escalation,
      nextStep: savedNote.nextStep,
    } : emptyTicketNote);
    setReflectionText(progress[card.id]?.reflection?.text ?? '');
  };

  const handleReview = (rating: KbReviewRating) => {
    if (!selectedCard) return;
    refreshProgress(recordKbReview(selectedCard.id, rating), `Review saved: ${rating}`);
  };

  const handleConfidenceChange = (confidence: KbConfidence) => {
    if (!selectedCard) return;
    refreshProgress(updateKbConfidence(selectedCard.id, confidence), 'Confidence updated');
  };

  const handleSaveScenario = () => {
    if (!selectedCard || !scenarioResponse.trim()) return;
    refreshProgress(saveKbScenarioPractice(selectedCard.id, scenarioResponse), 'Scenario evidence saved');
  };

  const handleSaveTicketNote = () => {
    if (!selectedCard) return;
    refreshProgress(saveKbTicketNotePractice(selectedCard.id, ticketNote), 'Ticket note saved');
  };

  const handleSaveReflection = () => {
    if (!selectedCard || !reflectionText.trim()) return;
    refreshProgress(saveKbReflection(selectedCard.id, reflectionText), 'Reflection saved');
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KB Learning Machine</h1>
              <p className="mt-2 max-w-3xl text-gray-600 dark:text-gray-400">
                Turn safe Avance KB topics into field cards, spaced reviews, flashcards, scenario practice,
                ticket-note drills, and evidence of learning.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/learning-cockpit">Learning Cockpit</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/evidence-pack">Evidence Pack</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Reviews due today</p>
                <p className="mt-2 text-3xl font-bold">{dueCards.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">KB cards</p>
                <p className="mt-2 text-3xl font-bold">{cards.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Scenario evidence</p>
                <p className="mt-2 text-3xl font-bold">{evidenceSummary.scenariosCompleted}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Ticket notes practised</p>
                <p className="mt-2 text-3xl font-bold">{evidenceSummary.ticketNotesPractised}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Learning Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-5">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Review</p>
                <p className="mt-1 text-sm font-medium">{dailyReviewCard?.title ?? 'Create a KB card'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Flashcards</p>
                <p className="mt-1 text-sm font-medium">{dailyReviewCard ? 'Run six recall prompts' : 'No card selected'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Scenario</p>
                <p className="mt-1 text-sm font-medium">{dailyScenarioCard?.title ?? 'Pick a KB scenario'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Ticket note</p>
                <p className="mt-1 text-sm font-medium">Write one clean PSA-style note</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Reflection</p>
                <p className="mt-1 text-sm font-medium">What would you check first next time?</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    KB Card List
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search KB cards, checks, skills..."
                    />
                    <select
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value)}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="all">All categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    {filteredCards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectCard(card)}
                        className={`w-full rounded-lg border p-4 text-left transition hover:border-blue-500 ${
                          selectedCard?.id === card.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                            : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{card.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{card.category}</p>
                          </div>
                          <Badge variant="outline">{formatKbReviewDate(card.reviewDueDate)}</Badge>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{card.whenToUse}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge>{kbConfidenceLabels[card.confidence]}</Badge>
                          <Badge variant="secondary">{card.relatedSkill}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    Reviews Due Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dueCards.length > 0 ? (
                    dueCards.slice(0, 6).map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectCard(card)}
                        className="flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm hover:border-blue-500"
                      >
                        <span className="font-medium">{card.title}</span>
                        <Badge variant="outline">{card.category}</Badge>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No reviews are due today. Use the lowest-confidence card for practice.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedCard && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Selected Field Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedCard.title}</h2>
                        <Badge variant="outline">{selectedCard.category}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{selectedCard.whenToUse}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold">Prerequisites</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                          {selectedCard.prerequisites.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">First checks</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                          {selectedCard.firstChecks.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">Core steps</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                        {selectedCard.coreSteps.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-900 dark:bg-yellow-950/30">
                        <p className="font-semibold">Common mistake</p>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedCard.commonMistake}</p>
                      </div>
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900 dark:bg-red-950/30">
                        <p className="font-semibold">Escalate if</p>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedCard.escalateIf}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                      <div>
                        <Label htmlFor="confidence">Confidence</Label>
                        <select
                          id="confidence"
                          value={selectedCard.confidence}
                          onChange={(event) => handleConfidenceChange(event.target.value as KbConfidence)}
                          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {confidenceOptions.map((confidence) => (
                            <option key={confidence} value={confidence}>
                              {kbConfidenceLabels[confidence]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="rounded-lg border p-3 text-sm">
                        <p className="text-xs text-muted-foreground">Review due</p>
                        <p className="font-medium">{formatKbReviewDate(selectedCard.reviewDueDate)}</p>
                        {selectedCard.lastReviewedAt && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Last: {formatKbReviewDate(selectedCard.lastReviewedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold">Spaced review</p>
                      <div className="flex flex-wrap gap-2">
                        {reviewRatings.map((rating) => (
                          <Button key={rating} size="sm" variant="outline" onClick={() => handleReview(rating)}>
                            {rating}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {saveMessage && <p className="text-sm text-green-600">{saveMessage}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Flashcards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedFlashcards.map((flashcard, index) => (
                        <Button
                          key={flashcard.question}
                          size="sm"
                          variant={activeFlashcardIndex === index ? 'secondary' : 'outline'}
                          onClick={() => {
                            setActiveFlashcardIndex(index);
                            setShowFlashcardAnswer(false);
                          }}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-semibold">{activeFlashcard?.question}</p>
                      {showFlashcardAnswer ? (
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{activeFlashcard?.answer}</p>
                      ) : (
                        <Button className="mt-3" size="sm" onClick={() => setShowFlashcardAnswer(true)}>
                          Show answer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      Scenario Drill
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border bg-gray-50 p-4 text-sm dark:bg-gray-950">
                      {buildKbScenarioPrompt(selectedCard)}
                    </div>
                    <Textarea
                      value={scenarioResponse}
                      onChange={(event) => setScenarioResponse(event.target.value)}
                      rows={5}
                      placeholder="Write your first checks, safest next step, escalation point, and ticket note outline."
                    />
                    <Button onClick={handleSaveScenario} disabled={!scenarioResponse.trim()}>
                      Save scenario evidence
                    </Button>
                    {selectedProgress?.scenarioPractice && (
                      <p className="text-xs text-muted-foreground">Saved scenario evidence for this card.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Ticket-Note Drill
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {ticketNoteFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key}>{field.label}</Label>
                          <Textarea
                            id={field.key}
                            value={ticketNote[field.key]}
                            onChange={(event) =>
                              setTicketNote((current) => ({
                                ...current,
                                [field.key]: event.target.value,
                              }))
                            }
                            rows={3}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border bg-gray-50 p-3 text-sm whitespace-pre-wrap dark:bg-gray-950">
                      {toTicketNoteMarkdown(ticketNote)}
                    </div>
                    <Button onClick={handleSaveTicketNote}>Save ticket-note practice</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      What would you check first next time, and what part of this KB still feels unclear?
                    </p>
                    <Textarea
                      value={reflectionText}
                      onChange={(event) => setReflectionText(event.target.value)}
                      rows={4}
                      placeholder="Write a short learning reflection."
                    />
                    <Button onClick={handleSaveReflection} disabled={!reflectionText.trim()}>
                      Save reflection
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                KB Evidence Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2 rounded-lg border p-4">
                <p className="text-sm font-semibold">Activity</p>
                <p className="text-sm text-muted-foreground">KBs studied: {evidenceSummary.kbsStudied}</p>
                <p className="text-sm text-muted-foreground">Reviews completed: {evidenceSummary.reviewsCompleted}</p>
                <p className="text-sm text-muted-foreground">Scenarios completed: {evidenceSummary.scenariosCompleted}</p>
                <p className="text-sm text-muted-foreground">Ticket notes practised: {evidenceSummary.ticketNotesPractised}</p>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <p className="text-sm font-semibold">Current gaps</p>
                {evidenceSummary.currentGaps.map((gap) => (
                  <p key={gap} className="text-sm text-muted-foreground">
                    - {gap}
                  </p>
                ))}
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <p className="text-sm font-semibold">Next goals</p>
                {evidenceSummary.nextGoals.map((goal) => (
                  <p key={goal} className="text-sm text-muted-foreground">
                    - {goal}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
