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
    <span className="Links">
      {linksTitle || null}
      {links.map(({ name, link }) => (
        <a
          key={name}
          className={`link ${darkMode ? 'darkMode' : ''}`}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
      ))}
    </span>
  );
}
