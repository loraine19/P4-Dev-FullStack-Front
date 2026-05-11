/* FOOTER PROPS */
interface IFooterProps {
  text?: string;
}

/* FOOTER */
const Footer = ({ text = 'Copyright DataShare 2026' }: IFooterProps) => {
  return <footer className="app-footer">{text}</footer>;
};

export default Footer;