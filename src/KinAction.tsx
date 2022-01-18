import { Links, Link } from './Links';

interface Input {
  name: string;
  value?: string;
  options?: string[];
  type?: string;
  invoice?: boolean;
  disabledInput?: boolean;
  onChange?: (arg: string) => void;
  inputs?: Input[];
}
interface KinActionProps {
  title: string;
  subTitle?: string;
  subTitleLinks?: Link[];
  actionName: string;
  action: () => void;
  inputs?: Input[];
  displayValue?: string;
  disabled?: boolean;
  links?: Link[];
  linksTitle?: string;
  displayOutput?: object | null;
}
export function KinAction({
  title,
  subTitle,
  subTitleLinks,
  actionName,
  action,
  inputs,
  displayValue,
  disabled = false,
  links = [],
  linksTitle = '',
  displayOutput,
}: KinActionProps) {
  function generateInputs(inputsToGenerate: Input[]) {
    return inputsToGenerate.map(
      ({
        type = 'text',
        name,
        value,
        options,
        onChange,
        disabledInput,
        inputs: nestedInputs,
      }) => (
        <div
          key={name}
          className={`Kin-action-input-container ${
            disabledInput ? 'disabled' : ''
          }`}
        >
          <label
            htmlFor={`Kin-action-for-${name}`}
            className="Kin-action-label"
          >
            {name}
          </label>
          {(() => {
            if (name === 'Invoice' && nestedInputs?.length) {
              return (
                <div className="Kin-action-input-nested">
                  {generateInputs(nestedInputs)}
                </div>
              );
            }

            if (options?.length) {
              return (
                <select
                  id={`Kin-action-for-${name}`}
                  className="Kin-action-input"
                  value={value}
                  onChange={(event) => onChange && onChange(event.target.value)}
                >
                  {options.map((option) => {
                    return (
                      <option
                        className="Kin-action-input-option"
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    );
                  })}
                </select>
              );
            }

            return (
              <input
                onChange={(event) => onChange && onChange(event.target.value)}
                type={type}
                value={value}
                id={`Kin-action-for-${name}`}
                className="Kin-action-input"
              />
            );
          })()}
        </div>
      )
    );
  }

  return (
    <>
      <div className="Kin-action-title">{title}</div>
      {subTitle ? <div className="Kin-action-subTitle">{subTitle}</div> : null}
      {subTitleLinks ? (
        <div className="Kin-action-subTitle">
          <Links links={subTitleLinks} darkMode />
        </div>
      ) : null}
      <div className="Kin-action">
        {links.length ? (
          <p className="links">
            <Links links={links} linksTitle={linksTitle} darkMode />
          </p>
        ) : null}
        {inputs?.length ? generateInputs(inputs) : null}
        <button
          type="button"
          className={`Kin-action-button ${disabled ? 'disabled' : 'enabled'}`}
          onClick={action}
        >
          {actionName}
        </button>
        {displayValue ? (
          <p className="Kin-action-display">{displayValue}</p>
        ) : null}
        {displayOutput ? (
          <p className="Kin-action-display">
            <pre>{JSON.stringify(displayOutput, null, 2)}</pre>
          </p>
        ) : null}
      </div>
    </>
  );
}
