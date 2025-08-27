import React from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

const Button: React.FC<Props> = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'ps-btn';
  const v = variant === 'primary' ? 'ps-btn--primary' : variant === 'outline' ? 'ps-btn--outline' : 'ps-btn--ghost';
  return (
    <a {...props} className={[base, v, className].filter(Boolean).join(' ')}>
      {children}
    </a>
  );
};

export default Button;
