import { useMemo, useState } from 'react';
import type { ExternalLearningProgress, ExternalLearningResource } from './externalLearningTypes';

type ExternalLearningLinksProps = {
  resources: ExternalLearningResource[];
  progress?: ExternalLearningProgress;
  onSave?: (resourceId: string) => void;
  onStart?: (resourceId: string) => void;
  onComplete?: (resourceId: string) => void;
  title?: string;
  maxVisible?: number;
};

function badgeClass(value: string) {
  switch (value) {
    case 'free':
    case 'beginner':
    case 'course':
      return 'status-chip info';
    case 'free audit':
    case 'intermediate':
    case 'module':
      return 'status-chip warn';
    case 'free with paid certificate option':
    case 'advanced':
    case 'reference':
    case 'curated library':
      return 'status-chip success';
    default:
      return 'status-chip info';
  }
}

function ExternalLearningLinks({
  resources,
  progress,
  onSave,
  onStart,
  onComplete,
  title = 'Helpful external learning',
  maxVisible = 3
}: ExternalLearningLinksProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleResources = useMemo(() => {
    if (expanded) return resources;
    return resources.slice(0, maxVisible);
  }, [expanded, maxVisible, resources]);

  if (resources.length === 0) {
    return null;
  }

  return (
    <section className="card external-learning-panel">
      <div className="skill-card-header">
        <div>
          <h3>{title}</h3>
          <p className="page-help">External course availability and free/audit options may change. Open links in a new tab.</p>
        </div>
        <div className="metric-row">
          <span className="status-chip info">{resources.length} resources</span>
          <span className="status-chip success">{expanded ? 'expanded' : 'collapsed'}</span>
        </div>
      </div>
      <div className="card-grid">
        {visibleResources.map((resource) => {
          const saved = progress?.savedExternalResourceIds.includes(resource.id);
          const started = progress?.startedExternalResourceIds.includes(resource.id);
          const completed = progress?.completedExternalResourceIds.includes(resource.id);
          return (
            <article key={resource.id} className="mini-card external-resource-card">
              <div className="skill-card-header">
                <div>
                  <h4>{resource.title}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                    <span className={badgeClass(resource.provider)}>{resource.provider}</span>
                    <span className={badgeClass(resource.costLabel)}>{resource.costLabel}</span>
                    <span className={badgeClass(resource.level)}>{resource.level}</span>
                    <span className={badgeClass(resource.format)}>{resource.format}</span>
                  </div>
                </div>
              </div>
              <p>{resource.whyItHelps}</p>
              <p><strong>Best use:</strong> {resource.bestUse}</p>
              <p><strong>Time:</strong> {resource.estimatedTime}</p>
              {resource.cautionNote && <p className="health-muted">{resource.cautionNote}</p>}
              <div className="status-button-row">
                <a className="small-action" href={resource.url} target="_blank" rel="noreferrer">Open learning resource</a>
                {onSave && (
                  <button type="button" className="small-action" onClick={() => onSave(resource.id)}>
                    {saved ? 'Saved' : 'Save for later'}
                  </button>
                )}
              </div>
              <div className="status-button-row">
                {onStart && (
                  <button type="button" className="small-action" onClick={() => onStart(resource.id)}>
                    {started ? 'Started' : 'Mark started'}
                  </button>
                )}
                {onComplete && (
                  <button type="button" className="small-action" onClick={() => onComplete(resource.id)}>
                    {completed ? 'Completed' : 'Mark completed'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {resources.length > maxVisible && (
        <button type="button" className="small-action" onClick={() => setExpanded((current) => !current)}>
          {expanded ? 'Show fewer resources' : `Show all ${resources.length} resources`}
        </button>
      )}
    </section>
  );
}

export default ExternalLearningLinks;
