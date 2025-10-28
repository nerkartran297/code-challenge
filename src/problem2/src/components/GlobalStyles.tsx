/**
 * GlobalStyles component - Global CSS styles cho app
 */
export const GlobalStyles = () => {
  return (
    <style>{`
      .scrollbar-custom::-webkit-scrollbar {
        width: 4px;
      }
      
      /* Dark mode scrollbar */
      body.dark .scrollbar-custom::-webkit-scrollbar-track {
        background: #252a42;
      }
      body.dark .scrollbar-custom::-webkit-scrollbar-thumb {
        background: #50DA63;
      }
      body.dark .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: #5eec72;
      }
      
      /* Light mode scrollbar */
      body.light .scrollbar-custom::-webkit-scrollbar-track {
        background: #f3f4f6;
      }
      body.light .scrollbar-custom::-webkit-scrollbar-thumb {
        background: #50DA63;
      }
      body.light .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: #4ad65a;
      }
      
      .scrollbar-custom::-webkit-scrollbar-track {
        border-radius: 10px;
      }
      .scrollbar-custom::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideIn {
        from {
          transform: translate(100%, 100%);
          opacity: 0;
        }
        to {
          transform: translate(0, 0);
          opacity: 1;
        }
      }
      
      @keyframes shine {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.95);
        }
      }
      
      .shine-effect {
        position: relative;
        overflow: hidden;
      }
      
      .shine-effect::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(80, 218, 99, 0) 0%,
          rgba(80, 218, 99, 0.3) 50%,
          rgba(80, 218, 99, 0) 100%
        );
        animation: shine 0.6s ease-in-out;
        pointer-events: none;
      }
      
      .animate-fadeOut {
        animation: fadeOut 0.3s ease-out forwards;
      }
    `}</style>
  );
};
