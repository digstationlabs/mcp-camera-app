/**
 * MCP Camera App - Frontend JavaScript
 */

// Popular locations data
const POPULAR_LOCATIONS = [
    {
        name: 'Yosemite National Park',
        description: 'Valley views, waterfalls, and iconic landmarks',
        lat: 37.7456,
        lng: -119.5936,
        radius: 25,
        category: 'National Park'
    },
    {
        name: 'San Francisco Bay Area',
        description: 'Golden Gate, Bay Bridge, and city views',
        lat: 37.7749,
        lng: -122.4194,
        radius: 50,
        category: 'Urban'
    },
    {
        name: 'Yellowstone National Park',
        description: 'Geysers, wildlife, and thermal features',
        lat: 44.4280,
        lng: -110.5885,
        radius: 50,
        category: 'National Park'
    },
    {
        name: 'Grand Canyon National Park',
        description: 'South and North Rim views',
        lat: 36.1069,
        lng: -112.1129,
        radius: 30,
        category: 'National Park'
    },
    {
        name: 'Miami Beach',
        description: 'Ocean views, beaches, and weather stations',
        lat: 25.7907,
        lng: -80.1300,
        radius: 20,
        category: 'Beach'
    }
];

// App state
let currentCameraData = null;

/**
 * Initialize the application
 */
async function initApp() {
    // Check if API key exists
    const apiKey = await window.mcpCamera.api.getKey();
    
    if (!apiKey) {
        showSetupPanel();
    } else {
        const isValid = await window.mcpCamera.api.validate();
        if (isValid) {
            showAppPanel();
        } else {
            showSetupPanel();
        }
    }
    
    setupEventListeners();
    populatePopularLocations();
}

/**
 * Show setup panel for new users
 */
function showSetupPanel() {
    document.getElementById('setupPanel').style.display = 'flex';
    document.getElementById('appPanel').style.display = 'none';
}

/**
 * Show main app panel
 */
function showAppPanel() {
    document.getElementById('setupPanel').style.display = 'none';
    document.getElementById('appPanel').style.display = 'block';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Setup form
    document.getElementById('setupForm').addEventListener('submit', handleApiKeyRegistration);
    document.getElementById('manualKeyForm').addEventListener('submit', handleManualApiKey);
    
    // Search form
    document.getElementById('searchForm').addEventListener('submit', handleCameraSearch);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Header buttons
    document.getElementById('apiUsageBtn').addEventListener('click', showApiUsage);
    document.getElementById('settingsBtn').addEventListener('click', showSettings);
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('downloadImageBtn').addEventListener('click', downloadCurrentImage);
    document.getElementById('viewImageBtn').addEventListener('click', viewCurrentImage);
    
    // Settings
    document.getElementById('updateApiKeyBtn').addEventListener('click', updateApiKey);
    
    // Clear results
    document.getElementById('clearResultsBtn').addEventListener('click', clearResults);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.dataset.modal;
            if (modal) {
                document.getElementById(modal).style.display = 'none';
            }
        });
    });
}

/**
 * Handle API key registration
 */
async function handleApiKeyRegistration(e) {
    e.preventDefault();
    
    const email = document.getElementById('emailInput').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;
    
    try {
        const result = await window.mcpCamera.api.register(email);
        
        if (result.success) {
            showMessage('API key registered successfully!', 'success');
            showAppPanel();
        } else {
            showMessage(result.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Registration failed: ' + error.message, 'error');
    } finally {
        submitBtn.textContent = 'Get API Key';
        submitBtn.disabled = false;
    }
}

/**
 * Handle manual API key entry
 */
async function handleManualApiKey(e) {
    e.preventDefault();
    
    const apiKey = document.getElementById('manualKeyInput').value;
    
    if (!apiKey.trim()) {
        showMessage('Please enter an API key', 'error');
        return;
    }
    
    try {
        await window.mcpCamera.api.setKey(apiKey.trim());
        const isValid = await window.mcpCamera.api.validate();
        
        if (isValid) {
            showMessage('API key validated successfully!', 'success');
            showAppPanel();
        } else {
            showMessage('Invalid API key', 'error');
        }
    } catch (error) {
        showMessage('Failed to validate API key: ' + error.message, 'error');
    }
}

/**
 * Handle camera search
 */
async function handleCameraSearch(e) {
    e.preventDefault();
    
    const lat = parseFloat(document.getElementById('latInput').value);
    const lng = parseFloat(document.getElementById('lngInput').value);
    const radius = parseInt(document.getElementById('radiusInput').value);
    
    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        showMessage('Please enter valid coordinates and radius', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const result = await window.mcpCamera.camera.search(lat, lng, radius);
        
        if (result.success) {
            displaySearchResults(result.data);
        } else {
            showMessage(result.error || 'Search failed', 'error');
            hideLoading();
        }
    } catch (error) {
        showMessage('Search failed: ' + error.message, 'error');
        hideLoading();
    }
}

/**
 * Display search results
 */
function displaySearchResults(data) {
    hideLoading();
    
    const container = document.getElementById('resultsContainer');
    
    if (data && data.content && data.content[0] && data.content[0].text) {
        const text = data.content[0].text;
        
        // Parse the text to extract camera information
        const cameras = parseCameraResults(text);
        
        if (cameras.length > 0) {
            renderCameraGrid(cameras);
            document.getElementById('clearResultsBtn').style.display = 'block';
        } else {
            container.innerHTML = '<div class="empty-state"><p>No cameras found in this area</p></div>';
        }
    } else {
        container.innerHTML = '<div class="empty-state"><p>No cameras found in this area</p></div>';
    }
}

/**
 * Parse camera results from text
 */
function parseCameraResults(text) {
    const cameras = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
        // Look for lines that contain camera information
        const match = line.match(/^(\d+)\.\s*(.+?)\s*\((.+?)\)\s*-\s*(.+)$/);
        if (match) {
            cameras.push({
                id: match[3],
                name: match[2].trim(),
                status: match[4].trim(),
                details: line
            });
        }
    }
    
    return cameras;
}

/**
 * Render camera grid
 */
function renderCameraGrid(cameras) {
    const container = document.getElementById('resultsContainer');
    
    const html = `
        <div class="camera-grid">
            ${cameras.map(camera => `
                <div class="camera-card" onclick="showCameraDetails('${camera.id}')">
                    <div class="camera-name">${escapeHtml(camera.name)}</div>
                    <div class="camera-details">ID: ${escapeHtml(camera.id)}</div>
                    <span class="camera-status ${camera.status.toLowerCase().includes('active') ? 'active' : 'inactive'}">
                        ${escapeHtml(camera.status)}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Show camera details in modal
 */
async function showCameraDetails(cameraId) {
    document.getElementById('modalTitle').textContent = `Camera: ${cameraId}`;
    
    try {
        const result = await window.mcpCamera.camera.get(cameraId);
        
        if (result.success && result.data && result.data.content) {
            const content = result.data.content[0].text;
            document.getElementById('modalContent').innerHTML = `<pre>${escapeHtml(content)}</pre>`;
            currentCameraData = { id: cameraId, data: result.data };
            document.getElementById('cameraModal').style.display = 'flex';
        } else {
            showMessage(result.error || 'Failed to get camera details', 'error');
        }
    } catch (error) {
        showMessage('Failed to get camera details: ' + error.message, 'error');
    }
}

/**
 * Download current camera image
 */
async function downloadCurrentImage() {
    if (!currentCameraData) return;
    
    try {
        const result = await window.mcpCamera.camera.download(currentCameraData.id);
        
        if (result.success) {
            showMessage(`Image saved to: ${result.path}`, 'success');
        } else {
            showMessage(result.error || 'Download failed', 'error');
        }
    } catch (error) {
        showMessage('Download failed: ' + error.message, 'error');
    }
}

/**
 * View current camera image in browser
 */
async function viewCurrentImage() {
    if (!currentCameraData) return;
    
    try {
        const result = await window.mcpCamera.camera.getImageUrl(currentCameraData.id);
        
        if (result.success && result.data && result.data.content) {
            const text = result.data.content[0].text;
            const urlMatch = text.match(/https?:\/\/[^\s]+/);
            
            if (urlMatch) {
                window.open(urlMatch[0], '_blank');
            } else {
                showMessage('No image URL found', 'error');
            }
        } else {
            showMessage(result.error || 'Failed to get image URL', 'error');
        }
    } catch (error) {
        showMessage('Failed to get image URL: ' + error.message, 'error');
    }
}

/**
 * Switch tabs
 */
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = content.id === `${tabName}Tab` ? 'block' : 'none';
    });
}

/**
 * Populate popular locations
 */
function populatePopularLocations() {
    const container = document.getElementById('popularLocations');
    
    const html = POPULAR_LOCATIONS.map(location => `
        <div class="location-card" onclick="searchLocation(${location.lat}, ${location.lng}, ${location.radius})">
            <div class="location-name">${escapeHtml(location.name)}</div>
            <div class="location-description">${escapeHtml(location.description)}</div>
            <div class="location-coords">${location.lat}, ${location.lng} (${location.radius} miles)</div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

/**
 * Search a specific location
 */
function searchLocation(lat, lng, radius) {
    document.getElementById('latInput').value = lat;
    document.getElementById('lngInput').value = lng;
    document.getElementById('radiusInput').value = radius;
    
    // Switch to location tab and trigger search
    switchTab('location');
    document.getElementById('searchForm').dispatchEvent(new Event('submit'));
}

/**
 * Show API usage
 */
async function showApiUsage() {
    try {
        const result = await window.mcpCamera.server.info();
        
        if (result.success && result.data && result.data.content) {
            const content = result.data.content[0].text;
            document.getElementById('usageContent').innerHTML = `<pre>${escapeHtml(content)}</pre>`;
        } else {
            document.getElementById('usageContent').innerHTML = '<p>Could not retrieve usage information</p>';
        }
    } catch (error) {
        document.getElementById('usageContent').innerHTML = `<p>Error: ${escapeHtml(error.message)}</p>`;
    }
    
    document.getElementById('usageModal').style.display = 'flex';
}

/**
 * Show settings
 */
async function showSettings() {
    const apiKey = await window.mcpCamera.api.getKey();
    document.getElementById('currentApiKey').value = apiKey ? apiKey.substring(0, 20) + '...' : 'Not set';
    document.getElementById('settingsModal').style.display = 'flex';
}

/**
 * Update API key
 */
async function updateApiKey() {
    const newKey = document.getElementById('newApiKey').value;
    
    if (!newKey.trim()) {
        showMessage('Please enter a new API key', 'error');
        return;
    }
    
    try {
        await window.mcpCamera.api.setKey(newKey.trim());
        const isValid = await window.mcpCamera.api.validate();
        
        if (isValid) {
            showMessage('API key updated successfully!', 'success');
            document.getElementById('settingsModal').style.display = 'none';
            document.getElementById('currentApiKey').value = newKey.substring(0, 20) + '...';
            document.getElementById('newApiKey').value = '';
        } else {
            showMessage('Invalid API key', 'error');
        }
    } catch (error) {
        showMessage('Failed to update API key: ' + error.message, 'error');
    }
}

/**
 * Utility functions
 */
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('resultsContainer').innerHTML = '';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function closeModal() {
    document.getElementById('cameraModal').style.display = 'none';
    currentCameraData = null;
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = '<div class="empty-state"><p>🗺️ Search for cameras to see results here</p></div>';
    document.getElementById('clearResultsBtn').style.display = 'none';
}

function showMessage(message, type) {
    // Simple message display - could be enhanced with a proper notification system
    const color = type === 'success' ? '#2e7d32' : '#c62828';
    const backgroundColor = type === 'success' ? '#e8f5e8' : '#ffebee';
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: ${color};
        padding: 1rem 1.5rem;
        border-radius: 6px;
        border: 1px solid ${color}33;
        max-width: 400px;
        z-index: 9999;
        font-weight: 500;
    `;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);