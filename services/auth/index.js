/**
 * Auth Service — EdgeGateway
 *
 * A minimal Express server that demonstrates authentication routing via Nginx.
 * Runs on port 3001 inside the Docker network.
 *
 * Endpoints:
 *   POST /login    — accepts credentials, returns a mock token
 *   GET  /health   — simple liveness probe for Docker health checks
 */

'use strict';

const express = require('express');

const app  = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * POST /login
 * Accepts { username, password } in the request body.
 * Returns a mock JWT-style token (not a real JWT — for learning only).
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({
            error: 'username and password are required',
        });
    }

    // In a real service you would validate credentials against a database.
    // Here we always issue a token so you can focus on the Nginx layer.
    return res.json({
        service:   'auth',
        timestamp: new Date().toISOString(),
        token:     `mock-token-for-${username}`,
        expiresIn: 3600,
    });
});

/**
 * GET /health
 * Used by Docker / load balancers to verify the service is alive.
 */
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'auth' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`[auth-service] listening on port ${PORT}`);
});
