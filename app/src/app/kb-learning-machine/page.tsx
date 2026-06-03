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
import { ExternalLearningLinks } from '@/components/ExternalLearningLinks';
import { SaveStatus } from '@/components/SaveStatus';
import { useSaveStatus } from '@/hooks/useSaveStatus';
import { HeroPanel, PageShell, SectionHeader } from '@/components/academy';
import { LearningIllustration } from '@/components/learning/LearningIllustration';
import { LearningDiagram } from '@/components/learning/LearningDiagram';
import {
  recordKbFlashcardEvidence,
  recordKbReflectionEvidence,
  recordKbReviewEvidence,
  recordKbScenarioEvidence,
  recordKbTicketNoteEvidence,
} from '@/lib/learningEvidence';
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
  deleteKbManualCard,
  formatKbReviewDate,
  getKbCardsDueToday,
  getKbEvidenceSummary,
  getKbLearningProgress,
  getKbManualCards,
  getLowConfidenceCards,
  mergeKbCardsWithProgress,
  recordKbReview,
  saveKbManualCards,
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
  Pencil,
  Plus,
  Search,
  Target,
  Trash2,
} from 'lucide-react';

type TicketNoteDraft = Omit<KbTicketNotePractice, 'savedAt'>;

type KbCardDraft = {
  title: string;
  category: string;
  whenToUse: string;
  prerequisites: string;
  firstChecks: string;
  coreSteps: string;
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: KbConfidence;
};

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

const emptyCardDraft: KbCardDraft = {
  title: '',
  category: 'Custom',
  whenToUse: '',
  prerequisites: '',
  firstChecks: '',
  coreSteps: '',
  commonMistake: '',
  escalateIf: '',
  relatedSkill: '',
  confidence: 'recognise',
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
  const [manualCards, setManualCards] = useState<KbFieldCard[]>(() => getKbManualCards());
  const cardCollection = useMemo(() => [...manualCards, ...kbFieldCards], [manualCards]);
  const cards = useMemo(() => mergeKbCardsWithProgress(cardCollection, progress), [cardCollection, progress]);
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? '');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingManualCardId, setEditingManualCardId] = useState<string | null>(null);
  const [cardDraft, setCardDraft] = useState<KbCardDraft>(emptyCardDraft);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [scenarioResponse, setScenarioResponse] = useState('');
  const [ticketNote, setTicketNote] = useState<TicketNoteDraft>(emptyTicketNote);
  const [reflectionText, setReflectionText] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const reviewSaveStatus = useSaveStatus();
  const scenarioSaveStatus = useSaveStatus();
  const ticketSaveStatus = useSaveStatus();
  const reflectionSaveStatus = useSaveStatus();
  const flashcardSaveStatus = useSaveStatus();

  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? cards[0];
  const selectedProgress = selectedCard ? progress[selectedCard.id] : undefined;
  const manualCardIds = useMemo(() => new Set(manualCards.map((card) => card.id)), [manualCards]);
  const selectedCardIsManual = selectedCard ? manualCardIds.has(selectedCard.id) : false;
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

  const handleCardDraftChange = <K extends keyof KbCardDraft>(field: K, value: KbCardDraft[K]) => {
    setCardDraft((current) => ({ ...current, [field]: value }));
  };

  const resetCardDraft = () => {
    setEditingManualCardId(null);
    setCardDraft(emptyCardDraft);
  };

  const handleSaveManualCard = () => {
    const now = new Date().toISOString();
    const existingCard = editingManualCardId
      ? manualCards.find((card) => card.id === editingManualCardId)
      : undefined;
    const nextCard: KbFieldCard = {
      id: existingCard?.id ?? `manual-kb-${Date.now()}`,
      title: cardDraft.title.trim() || 'Untitled field card',
      category: cardDraft.category.trim() || 'Custom',
      whenToUse: cardDraft.whenToUse.trim() || 'Add when this KB should be used.',
      prerequisites: splitDraftLines(cardDraft.prerequisites, 'Confirm prerequisites before starting.'),
      firstChecks: splitDraftLines(cardDraft.firstChecks, 'Record the safest first check.'),
      coreSteps: splitDraftLines(cardDraft.coreSteps, 'Add the approved step-by-step workflow.'),
      commonMistake: cardDraft.commonMistake.trim() || 'Add the mistake to avoid.',
      escalateIf: cardDraft.escalateIf.trim() || 'Add escalation triggers.',
      relatedSkill: cardDraft.relatedSkill.trim() || 'Custom skill',
      confidence: cardDraft.confidence,
      reviewDueDate: existingCard?.reviewDueDate ?? now,
      lastReviewedAt: existingCard?.lastReviewedAt,
      reviewHistory: existingCard?.reviewHistory ?? [],
    };
    const nextManualCards = existingCard
      ? manualCards.map((card) => (card.id === existingCard.id ? nextCard : card))
      : [nextCard, ...manualCards];

    saveKbManualCards(nextManualCards);
    setManualCards(nextManualCards);
    setSelectedCardId(nextCard.id);
    setSaveMessage(existingCard ? 'KB card updated' : 'KB card created');
    window.setTimeout(() => setSaveMessage(''), 1800);
    resetCardDraft();
  };

  const handleEditManualCard = (card: KbFieldCard) => {
    if (!manualCardIds.has(card.id)) return;
    setEditingManualCardId(card.id);
    setCardDraft({
      title: card.title,
      category: card.category,
      whenToUse: card.whenToUse,
      prerequisites: card.prerequisites.join('\n'),
      firstChecks: card.firstChecks.join('\n'),
      coreSteps: card.coreSteps.join('\n'),
      commonMistake: card.commonMistake,
      escalateIf: card.escalateIf,
      relatedSkill: card.relatedSkill,
      confidence: card.confidence,
    });
  };

  const handleDeleteManualCard = (card: KbFieldCard) => {
    if (!manualCardIds.has(card.id)) return;
    if (!window.confirm(`Delete custom KB card "${card.title}" and its local practice progress?`)) return;

    const next = deleteKbManualCard(card.id);
    setManualCards(next.cards);
    setProgress({ ...next.progress });
    setSelectedCardId(next.cards[0]?.id ?? kbFieldCards[0]?.id ?? '');
    setSaveMessage('KB card deleted');
    window.setTimeout(() => setSaveMessage(''), 1800);
    resetCardDraft();
  };

  const handleReview = (rating: KbReviewRating) => {
    if (!selectedCard) return;
    void reviewSaveStatus.runSave(async () => {
      const nextProgress = recordKbReview(selectedCard.id, rating);
      setProgress({ ...nextProgress });
      recordKbReviewEvidence({
        cardId: selectedCard.id,
        title: selectedCard.title,
        skill: selectedCard.relatedSkill,
        rating,
      });
      setSaveMessage(`Review saved: ${rating}`);
      window.setTimeout(() => setSaveMessage(''), 1800);
    });
  };

  const handleConfidenceChange = (confidence: KbConfidence) => {
    if (!selectedCard) return;
    refreshProgress(updateKbConfidence(selectedCard.id, confidence), 'Confidence updated');
  };

  const handleSaveScenario = () => {
    if (!selectedCard || !scenarioResponse.trim()) return;
    void scenarioSaveStatus.runSave(async () => {
      const nextProgress = saveKbScenarioPractice(selectedCard.id, scenarioResponse);
      setProgress({ ...nextProgress });
      recordKbScenarioEvidence({
        cardId: selectedCard.id,
        title: selectedCard.title,
        skill: selectedCard.relatedSkill,
        notes: scenarioResponse,
      });
      setSaveMessage('Scenario evidence saved');
      window.setTimeout(() => setSaveMessage(''), 1800);
    });
  };

  const handleSaveTicketNote = () => {
    if (!selectedCard) return;
    void ticketSaveStatus.runSave(async () => {
      const nextProgress = saveKbTicketNotePractice(selectedCard.id, ticketNote);
      setProgress({ ...nextProgress });
      recordKbTicketNoteEvidence({
        cardId: selectedCard.id,
        title: selectedCard.title,
        skill: selectedCard.relatedSkill,
        notes: toTicketNoteMarkdown(ticketNote),
      });
      setSaveMessage('Ticket note saved');
      window.setTimeout(() => setSaveMessage(''), 1800);
    });
  };

  const handleSaveReflection = () => {
    if (!selectedCard || !reflectionText.trim()) return;
    void reflectionSaveStatus.runSave(async () => {
      const nextProgress = saveKbReflection(selectedCard.id, reflectionText);
      setProgress({ ...nextProgress });
      recordKbReflectionEvidence({
        cardId: selectedCard.id,
        title: selectedCard.title,
        skill: selectedCard.relatedSkill,
        notes: reflectionText,
      });
      setSaveMessage('Reflection saved');
      window.setTimeout(() => setSaveMessage(''), 1800);
    });
  };

  const handleFlashcardScore = (result: 'right' | 'wrong') => {
    if (!selectedCard) return;
    void flashcardSaveStatus.runSave(async () => {
      recordKbFlashcardEvidence({
        cardId: selectedCard.id,
        title: selectedCard.title,
        skill: selectedCard.relatedSkill,
        flashcardIndex: activeFlashcardIndex,
        result,
      });
      setSaveMessage(result === 'right' ? 'Flashcard marked correct' : 'Flashcard marked for review');
      window.setTimeout(() => setSaveMessage(''), 1800);
    });
  };

  return (
    <Layout>
      <PageShell
        eyebrow="KB study"
        title="KB Learning Machine"
        subtitle="Turn safe Avance KB topics into field cards, spaced reviews, flashcards, scenario practice, ticket-note drills, and evidence."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/learning-cockpit">Learning Cockpit</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/evidence-pack">Evidence Pack</Link>
            </Button>
          </>
        }
      >
        <HeroPanel
          title="Today's study cockpit"
          subtitle="Review due cards, run flashcards, practise scenarios, and save ticket-note evidence."
          illustration={<LearningIllustration variant="kb-field-card" size="lg" decorative />}
          stats={[
            { label: 'Due today', value: dueCards.length },
            { label: 'KB cards', value: cards.length },
            { label: 'Scenarios saved', value: evidenceSummary.scenariosCompleted },
          ]}
        />

          <LearningDiagram variant="troubleshooting-ladder" compact />

          <Card>
            <CardHeader>
              <SectionHeader icon={Target} title="Daily learning plan" description="A simple rhythm for steady KB confidence." />
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

          {dailyScenarioCard && (
            <ExternalLearningLinks
              skill={dailyScenarioCard.relatedSkill}
              activityTitle={dailyScenarioCard.title}
              heading="Optional 10-20 min external booster"
              limit={1}
              compact
            />
          )}

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
                            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/80'
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
                          {manualCardIds.has(card.id) && <Badge variant="outline">Manual</Badge>}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingManualCardId ? 'Edit Custom KB Card' : 'Create Custom KB Card'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-title">Title</Label>
                      <Input
                        id="kb-card-title"
                        value={cardDraft.title}
                        onChange={(event) => handleCardDraftChange('title', event.target.value)}
                        placeholder="Example: Shared mailbox delegation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-category">Category</Label>
                      <Input
                        id="kb-card-category"
                        value={cardDraft.category}
                        onChange={(event) => handleCardDraftChange('category', event.target.value)}
                        placeholder="Microsoft 365"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kb-card-when">When to use</Label>
                    <Textarea
                      id="kb-card-when"
                      value={cardDraft.whenToUse}
                      onChange={(event) => handleCardDraftChange('whenToUse', event.target.value)}
                      rows={2}
                      placeholder="When this KB is useful in real work."
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-prerequisites">Prerequisites</Label>
                      <Textarea
                        id="kb-card-prerequisites"
                        value={cardDraft.prerequisites}
                        onChange={(event) => handleCardDraftChange('prerequisites', event.target.value)}
                        rows={4}
                        placeholder="One prerequisite per line."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-first-checks">First checks</Label>
                      <Textarea
                        id="kb-card-first-checks"
                        value={cardDraft.firstChecks}
                        onChange={(event) => handleCardDraftChange('firstChecks', event.target.value)}
                        rows={4}
                        placeholder="One safe first check per line."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kb-card-core-steps">Core steps</Label>
                    <Textarea
                      id="kb-card-core-steps"
                      value={cardDraft.coreSteps}
                      onChange={(event) => handleCardDraftChange('coreSteps', event.target.value)}
                      rows={4}
                      placeholder="One repeatable step per line."
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-mistake">Common mistake</Label>
                      <Textarea
                        id="kb-card-mistake"
                        value={cardDraft.commonMistake}
                        onChange={(event) => handleCardDraftChange('commonMistake', event.target.value)}
                        rows={3}
                        placeholder="The risky or wasteful mistake to avoid."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-escalate">Escalate if</Label>
                      <Textarea
                        id="kb-card-escalate"
                        value={cardDraft.escalateIf}
                        onChange={(event) => handleCardDraftChange('escalateIf', event.target.value)}
                        rows={3}
                        placeholder="Clear escalation triggers."
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-skill">Related skill</Label>
                      <Input
                        id="kb-card-skill"
                        value={cardDraft.relatedSkill}
                        onChange={(event) => handleCardDraftChange('relatedSkill', event.target.value)}
                        placeholder="Client communication"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kb-card-confidence">Starting confidence</Label>
                      <select
                        id="kb-card-confidence"
                        value={cardDraft.confidence}
                        onChange={(event) => handleCardDraftChange('confidence', event.target.value as KbConfidence)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {confidenceOptions.map((confidence) => (
                          <option key={confidence} value={confidence}>
                            {kbConfidenceLabels[confidence]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={handleSaveManualCard}>
                      <Plus className="mr-2 h-4 w-4" />
                      {editingManualCardId ? 'Save card' : 'Create card'}
                    </Button>
                    {editingManualCardId && (
                      <Button type="button" variant="outline" onClick={resetCardDraft}>
                        Cancel edit
                      </Button>
                    )}
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
                        {selectedCardIsManual && <Badge variant="secondary">Manual card</Badge>}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{selectedCard.whenToUse}</p>
                      {selectedCardIsManual && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditManualCard(selectedCard)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteManualCard(selectedCard)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )}
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
                      <div className="academy-callout-caution text-sm">
                        <p className="font-semibold">Common mistake</p>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedCard.commonMistake}</p>
                      </div>
                      <div className="academy-callout-danger text-sm">
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
                    <SaveStatus status={reviewSaveStatus.status} />
                    <ExternalLearningLinks
                      skill={selectedCard.relatedSkill}
                      activityTitle={selectedCard.title}
                      heading="Go deeper with free learning"
                      limit={3}
                      compact
                    />
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
                    <div className="academy-inset-panel">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeFlashcard?.question}</p>
                      {showFlashcardAnswer ? (
                        <>
                          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{activeFlashcard?.answer}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => handleFlashcardScore('right')}>
                              I was right
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleFlashcardScore('wrong')}>
                              I was wrong
                            </Button>
                          </div>
                          <SaveStatus status={flashcardSaveStatus.status} />
                        </>
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
                    <div className="academy-inset-panel">
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
                    <SaveStatus status={scenarioSaveStatus.status} />
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
                    <div className="academy-inset-panel whitespace-pre-wrap text-sm">
                      {toTicketNoteMarkdown(ticketNote)}
                    </div>
                    <Button onClick={handleSaveTicketNote}>Save ticket-note practice</Button>
                    <SaveStatus status={ticketSaveStatus.status} />
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
                    <SaveStatus status={reflectionSaveStatus.status} />
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
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Activity</p>
                <p className="text-sm text-muted-foreground">KBs studied: {evidenceSummary.kbsStudied}</p>
                <p className="text-sm text-muted-foreground">Reviews completed: {evidenceSummary.reviewsCompleted}</p>
                <p className="text-sm text-muted-foreground">Scenarios completed: {evidenceSummary.scenariosCompleted}</p>
                <p className="text-sm text-muted-foreground">Ticket notes practised: {evidenceSummary.ticketNotesPractised}</p>
              </div>
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Current gaps</p>
                {evidenceSummary.currentGaps.map((gap) => (
                  <p key={gap} className="text-sm text-muted-foreground">
                    - {gap}
                  </p>
                ))}
              </div>
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Next goals</p>
                {evidenceSummary.nextGoals.map((goal) => (
                  <p key={goal} className="text-sm text-muted-foreground">
                    - {goal}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
      </PageShell>
    </Layout>
  );
}

function splitDraftLines(value: string, fallback: string) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines : [fallback];
}
