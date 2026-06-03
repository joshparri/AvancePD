type MobileBottomActionsProps = {
  onNavigate: (page: string) => void;
};

function MobileBottomActions({ onNavigate }: MobileBottomActionsProps) {
  return (
    <nav className="mobile-bottom-actions" aria-label="Quick actions">
      <button type="button" onClick={() => onNavigate('dashboard')}>Capture</button>
      <button type="button" onClick={() => onNavigate('promptPacks')}>Prompts</button>
      <button type="button" onClick={() => onNavigate('healthOutdoors')}>Reset</button>
      <button type="button" onClick={() => onNavigate('shiftCommandCenter')}>Now</button>
    </nav>
  );
}

export default MobileBottomActions;
