const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Get the blob store
        const store = getStore({
            name: 'map-pins',
            siteID: process.env.SITE_ID || context.site?.id || 'default'
        });

        // GET - Retrieve all pins
        if (event.httpMethod === 'GET') {
            try {
                const pinsData = await store.get('pins', { type: 'json' });
                const pins = pinsData || [];
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ pins })
                };
            } catch (error) {
                // If no pins exist yet, return empty array
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ pins: [] })
                };
            }
        }

        // POST - Add a new pin
        if (event.httpMethod === 'POST') {
            const newPin = JSON.parse(event.body);
            
            // Validate pin data
            if (!newPin.lat || !newPin.lng) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid pin data: lat and lng are required' })
                };
            }

            // Add unique ID and ensure timestamp
            newPin.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            newPin.timestamp = newPin.timestamp || new Date().toISOString();
            
            // Sanitize message
            if (newPin.message) {
                newPin.message = newPin.message.substring(0, 500); // Limit message length
            }

            // Get existing pins
            let pins = [];
            try {
                const pinsData = await store.get('pins', { type: 'json' });
                pins = pinsData || [];
            } catch (error) {
                // If no pins exist yet, start with empty array
                pins = [];
            }

            // Add new pin
            pins.push(newPin);

            // Keep only last 1000 pins to prevent unlimited growth
            if (pins.length > 1000) {
                pins = pins.slice(-1000);
            }

            // Save updated pins
            await store.setJSON('pins', pins);

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ 
                    message: 'Pin added successfully',
                    pin: newPin 
                })
            };
        }

        // Method not allowed
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error in pins function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

