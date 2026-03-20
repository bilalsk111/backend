import React from "react";

const PerplexityLogo = ({ size = 22, className = "" }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand2)] ${className}`}
      style={{ width: size + 10, height: size + 10 }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 4.8V19.2H10.1V12.9H13.4C16 12.9 18 11.3 18 8.9C18 6.4 16 4.8 13.4 4.8H7.5ZM10.1 7.2H13.2C14.5 7.2 15.3 7.9 15.3 8.9C15.3 10 14.5 10.7 13.2 10.7H10.1V7.2Z"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>
    </div>
  );
};

export default PerplexityLogo;

