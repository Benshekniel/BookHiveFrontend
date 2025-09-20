// import React, { useState, useEffect } from "react";
// text = "Loading", speed = 500, maxDots = 3, 

const LoadingSpinner = () => {
  
  // const [dots, setDots] = useState("");
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDots((prev) => (prev.length < maxDots ? prev + "." : ""));
  //   }, speed);

  //   return () => clearInterval(interval);
  // }, [speed, maxDots]);

  // <span className={className}>
  //   {text}{dots}
  // </span>
  //  ${className}

  return (

    <div className={`flex items-center justify-center`}>
      <div className="relative flex items-center justify-center">
        {/*  */}
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        {/*  */}
      </div>
    </div>
  );
}

export default LoadingSpinner;
