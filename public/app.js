// Initialize the map
const map = L.map('map', {
    worldCopyJump: true, // Jump to the real world copy when panning
    maxBounds: [[-90, -180], [90, 180]], // Limit to one world
    maxBoundsViscosity: 1.0, // Stronger resistance at edges
    minZoom: 3, // Tighter minimum zoom - can't see outside the world
    maxZoom: 19 // Maximum zoom level
}).setView([40.7128, -74.0060], 4); // Default view: USA

// Mapbox access token
const mapboxToken = 'pk.eyJ1IjoiamFzb25sb3JkODQiLCJhIjoiY21qa3FlZWVpMGUzdzNmcHY2d2d1ejY2dCJ9.vWiLbqQ0umwGGnpeS7U96Q';

// Add Mapbox tiles - Using custom style
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 19,
    zoomOffset: -1,
    id: 'jasonlord84/cmdra3zcw000h01r17km26edi', // Your custom Mapbox style
    accessToken: mapboxToken,
    noWrap: true // Prevent tiles from repeating horizontally
}).addTo(map);

// Store for pins and temporary pin location
let pins = [];
let tempPinLocation = null;

// DOM elements
const modal = document.getElementById('pinModal');
const pinMessage = document.getElementById('pinMessage');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const pinCount = document.getElementById('pinCount');

// Custom icon for pins
const pinIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Map click event - open modal to add pin
map.on('click', function(e) {
    tempPinLocation = e.latlng;
    showModal();
});

// Show modal
function showModal() {
    modal.classList.add('show');
    pinMessage.value = '';
    pinMessage.focus();
}

// Hide modal
function hideModal() {
    modal.classList.remove('show');
    tempPinLocation = null;
}

// Cancel button
cancelBtn.addEventListener('click', hideModal);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        hideModal();
    }
});

// Save pin
saveBtn.addEventListener('click', async function() {
    if (!tempPinLocation) return;
    
    const message = pinMessage.value.trim() || 'No message';
    
    const pin = {
        lat: tempPinLocation.lat,
        lng: tempPinLocation.lng,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Disable button during save
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch('/api/pins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pin)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save pin');
        }
        
        const result = await response.json();
        
        // Add pin to map
        addPinToMap(result.pin);
        pins.push(result.pin);
        updatePinCount();
        
        hideModal();
        
        // Show success feedback
        showNotification('Pin dropped successfully! 📍', 'success');
        
    } catch (error) {
        console.error('Error saving pin:', error);
        showNotification('Failed to save pin. Please try again.', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Drop Pin';
    }
});

// Add pin to map
function addPinToMap(pin) {
    const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon })
        .addTo(map);
    
    const popupContent = `
        <div style="min-width: 200px;">
            <strong style="font-size: 16px; color: #667eea;">📍 Pin Message</strong>
            <p style="margin: 10px 0; color: #495057;">${escapeHtml(pin.message)}</p>
            <small style="color: #6c757d;">Dropped: ${formatDate(pin.timestamp)}</small>
        </div>
    `;
    
    marker.bindPopup(popupContent);
}

// Load all pins from server
async function loadPins() {
    try {
        const response = await fetch('/api/pins');
        
        if (!response.ok) {
            throw new Error('Failed to load pins');
        }
        
        const data = await response.json();
        pins = data.pins || [];
        
        // Clear existing markers
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        
        // Add all pins to map
        pins.forEach(pin => addPinToMap(pin));
        updatePinCount();
        
        showNotification('Pins refreshed! 🔄', 'success');
        
    } catch (error) {
        console.error('Error loading pins:', error);
        showNotification('Failed to load pins', 'error');
    }
}

// Update pin count display
function updatePinCount() {
    pinCount.textContent = pins.length;
}

// Refresh button
refreshBtn.addEventListener('click', loadPins);

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Load pins on page load
loadPins();

