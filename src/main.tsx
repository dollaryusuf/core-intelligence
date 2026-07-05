import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-serif: "Playfair Display", serif;
  
  --color-bg: #0D0E12;
  --color-card: #15171C;
  --color-accent: #00FFA3;
  --color-danger: #FF4B4B;
  --color-muted: #8E9299;
}

@layer base {
  body {
    @apply bg-bg text-white font-sans antialiased;
  }
}

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scroll-bottom {
    overflow-anchor: auto;
  }
}

.glow-accent {
  box-shadow: 0 0 15px rgba(0, 255, 156, 0.3);
}

.grid-bg {
  background-size: 40px 40px;
  background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 75, 75, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 75, 75, 0.8); }
}

.animate-pulse-red {
  animation: pulse-red 1.5s infinite;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}

@keyframes pulse-amber {
  0%, 100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.35); }
  50% { box-shadow: 0 0 28px rgba(251, 191, 36, 0.7); }
}

.glow-amber {
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

