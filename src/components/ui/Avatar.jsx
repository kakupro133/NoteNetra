import React from 'react';

const Avatar = ({ children, className, ...props }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AvatarImage = ({ className, ...props }) => (
  <img
    className={`aspect-square h-full w-full ${className}`}
    {...props}
  />
);

const AvatarFallback = ({ children, className, ...props }) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    {...props}
  >
    {children}
  </div>
);

export { Avatar, AvatarImage, AvatarFallback };
