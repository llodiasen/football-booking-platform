const Logo = ({ className = "", variant = "full" }) => {
  if (variant === "icon") {
    return (
      <svg
        className={className}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagone */}
        <path
          d="M25 5 L40 14 L40 36 L25 45 L10 36 L10 14 Z"
          className="fill-green-600"
        />
        {/* Ballon de foot stylisé */}
        <circle cx="25" cy="25" r="12" className="fill-white" />
        <path
          d="M25 13 L28 20 L21 20 Z"
          className="fill-green-600"
        />
        <path
          d="M25 37 L28 30 L21 30 Z"
          className="fill-green-600"
        />
        <path
          d="M15 21 L20 25 L15 29 Z"
          className="fill-green-600"
        />
        <path
          d="M35 21 L30 25 L35 29 Z"
          className="fill-green-600"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icône */}
      <svg
        className="w-10 h-10"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagone */}
        <path
          d="M25 5 L40 14 L40 36 L25 45 L10 36 L10 14 Z"
          className="fill-green-600"
        />
        {/* Ballon */}
        <circle cx="25" cy="25" r="11" className="fill-white" />
        <path
          d="M25 14 L27.5 20 L21.5 20 Z"
          className="fill-green-600"
        />
        <path
          d="M25 36 L27.5 30 L21.5 30 Z"
          className="fill-green-600"
        />
        <path
          d="M16 22 L20 25 L16 28 Z"
          className="fill-green-600"
        />
        <path
          d="M34 22 L30 25 L34 28 Z"
          className="fill-green-600"
        />
      </svg>
      
      {/* Texte */}
      <div className="flex flex-col">
        <span className="text-2xl font-black text-green-600 leading-none tracking-tight">
          221FOOT
        </span>
        <span className="text-[10px] text-gray-600 font-medium tracking-wide uppercase">
          Sénégal
        </span>
      </div>
    </div>
  );
};

export default Logo;

