import React from 'react';
import { cn } from "../../../lib/utils";

// Card component with flexible title and icon support
const Card = ({ 
  children, 
  title, 
  icon: Icon, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "rounded-lg border border-gray-700/50 bg-gray-900/50 shadow-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Card Header */}
      {(title || Icon) && (
        <div className="flex items-center p-4 border-b border-gray-700/30 bg-gray-800/30">
          {Icon && <Icon className="mr-3 w-6 h-6 text-blue-400" />}
          {title && (
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// CardHeader component for more granular control
Card.Header = ({ children, className, ...props }) => (
  <div 
    className={cn(
      "p-4 border-b border-gray-700/30 bg-gray-800/30",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// CardContent component for more granular control
Card.Content = ({ children, className, ...props }) => (
  <div 
    className={cn(
      "p-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// CardFooter component for more granular control
Card.Footer = ({ children, className, ...props }) => (
  <div 
    className={cn(
      "p-4 border-t border-gray-700/30 bg-gray-800/30",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export { Card };