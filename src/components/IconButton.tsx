import { motion } from 'framer-motion';
import type { IconButtonProps } from '../types';
import Magnetic from './Magnetic';

export default function IconButton({
  icon,
  onClick,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    default:
      'bg-white/60 hover:bg-white/90 border border-white/40 hover:border-berry-200/60 text-berry-800/70 hover:text-berry-600',
    primary:
      'bg-gradient-to-br from-berry-500 to-berry-600 hover:from-berry-400 hover:to-berry-500 text-white shadow-berry hover:shadow-berry-lg',
    ghost:
      'bg-transparent hover:bg-berry-50/60 text-berry-700/60 hover:text-berry-600',
  };

  const button = (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl flex items-center justify-center
        transition-all duration-200 ease-out
        backdrop-blur-sm cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon}
    </motion.button>
  );

  return disabled ? button : <Magnetic strength={0.3}>{button}</Magnetic>;
}
