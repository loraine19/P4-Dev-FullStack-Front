import { Link } from 'react-router-dom';

/* NAVBAR PROPS */
interface INavbarProps {
  ctaLabel?: string;
  ctaPath?: string;
}

/* NAVBAR */
const Navbar = ({ ctaLabel = 'Se connecter', ctaPath = '/' }: INavbarProps) => {
  return (
    <header className="app-navbar">
      <Link to="/" className="app-logo">
        <span className="app-brand">DataShare</span>
      </Link>
      <Link
        to={ctaPath}
        className="btn btn-dark">
        {ctaLabel}
      </Link>
    </header>
  );
};

export default Navbar;
