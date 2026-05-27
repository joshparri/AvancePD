export const reviewIntervals = {
  sameDay: 0,
  oneDay: 1,
  threeDays: 3,
  sevenDays: 7,
  fourteenDays: 14,
  thirtyDays: 30
} as const;

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export type ReviewStatus = 'due' | 'upcoming' | 'overdue' | 'unscheduled';

export function getNextReviewDate(params: {
  currentStage: keyof typeof reviewIntervals;
  rating: ReviewRating;
  fromDate?: string;
}): string {
  const { currentStage, rating, fromDate } = params;
  const baseDate = fromDate ? new Date(fromDate) : new Date();

  // Normalize date to midnight for consistent scheduling.
  const checkDate = new Date(baseDate);
  checkDate.setHours(0, 0, 0, 0);

  let intervalDays: number = reviewIntervals[currentStage];
  let nextStage = currentStage;

  switch (rating) {
    case 'again':
      // If the review was failed, retry tomorrow and keep the same stage.
      intervalDays = reviewIntervals.oneDay;
      break;
    case 'hard':
      // Hard ratings advance slower: schedule in two days and keep stage.
      intervalDays = 2;
      break;
    case 'good':
      // Good ratings move to the next normal interval stage.
      nextStage = getNextStage(currentStage);
      intervalDays = reviewIntervals[nextStage];
      break;
    case 'easy':
      // Easy ratings skip forward one stage for faster repetition spacing.
      nextStage = getNextStage(currentStage);
      const skipStage = getNextStage(nextStage);
      intervalDays = reviewIntervals[skipStage] ?? reviewIntervals[nextStage];
      break;
    default:
      intervalDays = reviewIntervals.oneDay;
  }

  const nextReview = new Date(checkDate);
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview.toISOString().slice(0, 10);
}

function getNextStage(stage: keyof typeof reviewIntervals): keyof typeof reviewIntervals {
  const order: Array<keyof typeof reviewIntervals> = [
    'sameDay',
    'oneDay',
    'threeDays',
    'sevenDays',
    'fourteenDays',
    'thirtyDays'
  ];

  const index = order.indexOf(stage);
  if (index === -1 || index === order.length - 1) {
    return stage;
  }
  return order[index + 1];
}

export function getReviewStatus(nextReviewAt?: string): ReviewStatus {
  if (!nextReviewAt) {
    return 'unscheduled';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reviewDate = new Date(nextReviewAt);
  reviewDate.setHours(0, 0, 0, 0);

  if (reviewDate.getTime() === today.getTime()) {
    return 'due';
  }

  if (reviewDate < today) {
    return 'overdue';
  }

  return 'upcoming';
}

export function sortCardsByReviewPriority<T extends { nextReviewAt?: string }>(cards: T[]): T[] {
  return [...cards].sort((a, b) => {
    const statusOrder: Record<ReviewStatus, number> = {
      overdue: 0,
      due: 1,
      upcoming: 2,
      unscheduled: 3
    };

    const statusA = getReviewStatus(a.nextReviewAt);
    const statusB = getReviewStatus(b.nextReviewAt);

    const orderA = statusOrder[statusA];
    const orderB = statusOrder[statusB];
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const dateA = a.nextReviewAt ? new Date(a.nextReviewAt).getTime() : Infinity;
    const dateB = b.nextReviewAt ? new Date(b.nextReviewAt).getTime() : Infinity;
    return dateA - dateB;
  });
}
