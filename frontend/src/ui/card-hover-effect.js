import React from 'react';
import { cn } from '../lib/utils';

const CardHoverEffect = ({ items, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item) => (
        <div
          key={item.id || item.title}
          className="relative group cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-6">
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              {item.title}
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
              {item.description}
            </p>
            
            {item.link && (
              <div className="flex items-center justify-between">
                <span className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                  Learn more
                </span>
                <svg
                  className="w-4 h-4 text-teal-600 dark:text-teal-400 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
      ))}
    </div>
  );
};

export { CardHoverEffect };
export default CardHoverEffect;