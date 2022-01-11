import { Links, Link } from './Links';

interface Input {
  name: string;
  value: string;
  options?: string[];
  type?: string;
  onChange: (arg: string) => void;
}
interface KinActionProps {
  title: string;
  subTitle?: string;
  actionName: string;
  action: () => void;
  inputs?: Input[];
  displayValue?: string;
  disabled?: boolean;
  links?: Link[];
  linksTitle?: string;
}
export function KinAction({
  title,
  subTitle,
  actionName,
  action,
  inputs,
  displayValue,
  disabled = false,
  links = [],
  linksTitle = '',
}: KinActionProps) {
  return (
    <>
      <div className="Kin-action-title">{title}</div>
      {subTitle ? <div className="Kin-action-subTitle">{subTitle}</div> : null}
      <div className="Kin-action">
        {links.length ? (
          <p className="links">
            <Links links={links} linksTitle={linksTitle} darkMode />
          </p>
        ) : null}
        {inputs?.length
          ? inputs.map(({ type = 'text', name, value, options, onChange }) => (
              <div key={name} className="Kin-action-input-container">
                <label
                  htmlFor={`Kin-action-for-${name}`}
                  className="Kin-action-label"
                >
                  {name}
                </label>
                {options?.length ? (
                  <select
                    id={`Kin-action-for-${name}`}
                    className="Kin-action-input"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    onChange={(event) => onChange(event.target.value)}
                    type={type}
                    value={value}
                    id={`Kin-action-for-${name}`}
                    className="Kin-action-input"
                  />
                )}
              </div>
            ))
          : null}
        {displayValue ? <p>{displayValue}</p> : null}
        <button
          type="button"
          className={`Kin-action-button ${disabled ? 'disabled' : 'enabled'}`}
          onClick={action}
        >
          {actionName}
        </button>
      </div>
    </>
  );
}
