// import React from "react";
// import PropTypes from "prop-types";

// const NewButton = ({ variant = "primary", size = "md", children, icon, disabled, onClick, ...props }) => {
//   const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
//   const variantStyles = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//     outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
//     success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
//     danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//   };

//   const sizeStyles = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 text-base",
//   };

//   const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

//   const className = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${disabledStyles}`;

//   return (
//     <button
//       className={className}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </button>
//   );
// };

// NewButton.propTypes = {
//   variant: PropTypes.oneOf(["primary", "outline", "success", "danger"]),
//   size: PropTypes.oneOf(["sm", "md"]),
//   children: PropTypes.node.isRequired,
//   icon: PropTypes.node,
//   disabled: PropTypes.bool,
//   onClick: PropTypes.func,
// };

// export const getStatusColor = (status) => {
//   switch (status) {
//     case "Draft":
//       return "bg-gray-100 text-gray-800 border-gray-300";
//     case "Submitted":
//       return "bg-blue-100 text-blue-800 border-blue-300";
//     case "Under Review":
//       return "bg-yellow-100 text-yellow-800 border-yellow-300";
//     case "Winner":
//       return "bg-green-100 text-green-800 border-green-300";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-300";
//   }
// };

// export default NewButton;