import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Remove lovable badge
const badge = document.getElementById('lovable-badge');
if (badge) badge.remove();

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node instanceof Element && node.id === 'lovable-badge') {
                node.remove();
            } else if (node instanceof Element && node.querySelector) {
                const nestedBadge = node.querySelector('#lovable-badge');
                if (nestedBadge) nestedBadge.remove();
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker registered to block badge');
    });
};
