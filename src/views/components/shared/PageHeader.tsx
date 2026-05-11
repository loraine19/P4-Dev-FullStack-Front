/* PAGE HEADER PROPS */
interface IPageHeaderProps {
  title: string;
  subtitle?: string;
}

/* PAGE HEADER */
const PageHeader = ({ title, subtitle }: IPageHeaderProps) => {
  return (
    <header className="page-header">
      <h1 className="page-heading">{title}</h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
    </header>
  );
};

export default PageHeader;