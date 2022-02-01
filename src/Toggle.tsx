import './Toggle.scss';

interface ToggleProps {
  title?: string;
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
}

export function Toggle({ title, options, selected, onChange }: ToggleProps) {
  return (
    <div className="Toggle">
      {title ? <p className="Toggle-title">{title}</p> : null}
      <div className="Toggle-options">
        {options.map((option) => (
          <div
            className={`Toggle-option ${option === selected ? 'selected' : ''}`}
            key={option}
            onClick={() => onChange(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
