import type { ButtonHTMLAttributes } from 'react';

/* BUTTON VARIANTS */
type TButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'dark' | 'plus';

/* BUTTON PROPS */
interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
}

/* BUTTON */
const Button = ({ variant = 'primary', className = '', type = 'button', ...props }: IButtonProps) => {
  const variantClass = `btn-${variant}`;
  const mergedClassName = `btn ${variantClass} ${className}`.trim();

  return <button type={type} className={mergedClassName} {...props} />;
};

export default Button;