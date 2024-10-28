import React from 'react';

const Card = ({ children, title, icon: Icon }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-6">
        {(title || Icon) && (
          <div className="flex items-center gap-3 mb-6">
            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
            {title && <h2 className="text-xl font-semibold text-gray-200">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;