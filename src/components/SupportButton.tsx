'use client'

interface SupportButtonProps {
  variant?: 'primary' | 'secondary' | 'link'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function SupportButton({ 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: SupportButtonProps) {
  const handleSupportClick = () => {
    window.open('https://ryuzo.support', '_blank', 'noopener,noreferrer')
  }

  const baseClasses = 'font-mono transition-opacity focus:outline-none focus:ring-2 focus:ring-link inline-block'
  
  const variantClasses = {
    primary: 'bg-foreground text-background hover:opacity-90',
    secondary: 'border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors',
    link: 'text-link hover:underline bg-transparent'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button
      onClick={handleSupportClick}
      className={classes}
      title="Support Ryuzo's work on Kokoro Wiki"
    >
      💝 Support
    </button>
  )
}
