import React from 'react';

interface VmcLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const VmcLogo: React.FC<VmcLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  // Height mappings based on size
  const heightClass = {
    sm: 'h-7',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official VMC Red Serif Logo with Curved Swoosh */}
      <div className={`relative ${heightClass} flex items-center shrink-0`}>
        <img
          src="/vmc-logo.svg"
          alt="VMC - Vanita Math Classes"
          className={`${heightClass} w-auto object-contain drop-shadow-xs`}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-red-600 leading-tight uppercase font-serif">
            VANITA MATH CLASSES
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
            Specialized Mathematics · 8th to 12th
          </span>
        </div>
      )}
    </div>
  );
};
