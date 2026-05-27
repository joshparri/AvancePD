import { externalLearningResources } from './externalLearningResources';
import type { ExternalLearningMatchInput, ExternalLearningResource } from './externalLearningTypes';
import type { KbFieldCard } from '../kb-learning/kbLearningTypes';

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();
const splitTerms = (value: string) => normalize(value).split(/\s+/).filter(Boolean);

function scoreResource(resource: ExternalLearningResource, input: ExternalLearningMatchInput) {
  const titleText = normalize(resource.title);
  const keywordText = normalize([...resource.skillAreas, ...resource.relatedKbKeywords].join(' '));
  const inputText = normalize([input.skillArea, input.kbTitle, input.kbCategory, input.relatedSkill, input.searchText].filter(Boolean).join(' '));
  let score = 0;

  if (input.skillArea) {
    const skillArea = normalize(input.skillArea);
    if (resource.skillAreas.some((area) => normalize(area) === skillArea)) {
      score += 6;
    }
    if (keywordText.includes(skillArea)) {
      score += 2;
    }
  }

  if (input.relatedSkill) {
    const relatedSkill = normalize(input.relatedSkill);
    if (keywordText.includes(relatedSkill)) {
      score += 5;
    }
    if (titleText.includes(relatedSkill)) {
      score += 3;
    }
  }

  if (input.kbCategory) {
    const category = normalize(input.kbCategory);
    if (keywordText.includes(category)) {
      score += 3;
    }
  }

  if (input.kbTitle) {
    const title = normalize(input.kbTitle);
    const titleTerms = splitTerms(title);
    titleTerms.forEach((term) => {
      if (keywordText.includes(term)) score += 1;
      if (titleText.includes(term)) score += 1;
    });
  }

  if (input.searchText) {
    const searchTerms = splitTerms(input.searchText);
    searchTerms.forEach((term) => {
      if (keywordText.includes(term)) score += 1;
      if (titleText.includes(term)) score += 1;
    });
  }

  if (resource.relatedKbKeywords.some((keyword) => inputText.includes(normalize(keyword)))) {
    score += 2;
  }

  return score;
}

export function rankExternalResources(resources: ExternalLearningResource[], input: ExternalLearningMatchInput) {
  return [...resources]
    .map((resource) => ({ resource, score: scoreResource(resource, input) }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.resource.title.localeCompare(right.resource.title);
    })
    .map(({ resource }) => resource);
}

export function getRelevantExternalResources(input: ExternalLearningMatchInput) {
  const ranked = rankExternalResources(externalLearningResources, input);
  const hasMatch = ranked.some((resource) => scoreResource(resource, input) > 0);
  if (hasMatch) {
    return ranked.slice(0, 5);
  }
  return ranked.slice(0, 3);
}

export function getResourcesBySkillArea(skillArea: string) {
  const normalized = normalize(skillArea);
  return externalLearningResources.filter((resource) =>
    resource.skillAreas.some((area) => normalize(area) === normalized)
  );
}

export function getResourcesByProvider(provider: string) {
  return externalLearningResources.filter((resource) => resource.provider === provider);
}

export function getResourcesForKbCard(card: KbFieldCard) {
  return getRelevantExternalResources({
    skillArea: card.relatedSkill || card.category,
    kbTitle: card.title,
    kbCategory: card.category,
    relatedSkill: card.relatedSkill,
    searchText: [card.title, card.category, card.relatedSkill].filter(Boolean).join(' ')
  });
}
