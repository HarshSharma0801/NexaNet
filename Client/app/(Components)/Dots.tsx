import React from "react";

const DotsAnimation = () => {
  return (
    <div className="flex space-x-2">
      <div className="md:w-2 w-1 md:h-2 h-1 bg-black rounded-full animate-bounce"></div>
      <div className="md:w-2 w-1 md:h-2  h-1 bg-black rounded-full animate-bounce delay-100"></div>
      <div className="md:w-2 w-1 md:h-2  h-1 bg-black rounded-full animate-bounce delay-200"></div>
      <div className="md:w-2 w-1 md:h-2  h-1 bg-black rounded-full animate-bounce delay-00"></div>
      <div className="md:w-2 w-1 md:h-2 h-1  bg-black rounded-full animate-bounce delay-400"></div>
    </div>
  );
};

export default DotsAnimation;
