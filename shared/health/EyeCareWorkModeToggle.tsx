import type { ChangeEvent } from 'react';

type EyeCareWorkModeToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function EyeCareWorkModeToggle({ checked, onChange }: EyeCareWorkModeToggleProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="checklist-item">
      <input type="checkbox" checked={checked} onChange={handleChange} />
      Enable Eye Care Work Mode: add extra gentle eye reset reminders during work shifts.
    </label>
  );
}
