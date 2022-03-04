import './Links.scss';

export interface Link {
  name: string;
  link: string;
}
export interface LinkProps {
  links: Link[];
  linksTitle?: string;
  darkMode?: boolean;
}
export function Links({ links, linksTitle, darkMode }: LinkProps) {
  return (
    <>
      <span className="Links">
        {linksTitle || null}
        {links.map(({ name, link }, index) => (
          <span key={name}>
            {index > 0 ? ' | ' : ''}
            <span
              key={name}
              className={`link ${darkMode ? 'darkMode' : ''}`}
              onClick={() => {
                const newTab = window.open(link, '_blank');
                if (newTab) newTab.focus();
              }}
            >
              {name}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
