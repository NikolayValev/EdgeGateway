/* =============================================================================
   app.js — EdgeGateway static frontend
   Demonstrates calling the API and Auth services through the Nginx gateway.
   ============================================================================= */

'use strict';

const output = document.getElementById('output');

function show(data) {
    output.textContent = JSON.stringify(data, null, 2);
}

// ---------------------------------------------------------------------------
// GET /api/products
// ---------------------------------------------------------------------------
document.getElementById('btn-products').addEventListener('click', async () => {
    output.textContent = 'Loading…';
    try {
        const res  = await fetch('/api/products');
        const data = await res.json();
        show(data);
    } catch (err) {
        show({ error: err.message });
    }
});

// ---------------------------------------------------------------------------
// POST /auth/login  (demo credentials — backend accepts anything non-empty)
// ---------------------------------------------------------------------------
document.getElementById('btn-login').addEventListener('click', async () => {
    output.textContent = 'Loading…';
    try {
        const res  = await fetch('/auth/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username: 'demo', password: 'secret' }),
        });
        const data = await res.json();
        show(data);
    } catch (err) {
        show({ error: err.message });
    }
});
