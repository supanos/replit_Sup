import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'spicy' | 'hot' | 'new' | 'popular' | 'league';
  className?: string;
}

const badgeVariants = {
  default: 'bg-gray-500 text-white',
  spicy: 'bg-red-500 text-white',
  hot: 'bg-orange-500 text-white',
  new: 'bg-green-500 text-white',
  popular: 'bg-blue-500 text-white',
  league: 'bg-brand-gold text-brand-navy'
};

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  if (!children || children === '0' || children === '') {
    return null;
  }
  
  return (
    <span 
      className={cn(
        'px-2 py-1 rounded-full text-xs font-bold',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
