/**
 * API Service — EdgeGateway
 *
 * A minimal Express server that demonstrates routing through Nginx.
 * Runs on port 3000 inside the Docker network.
 *
 * Endpoints:
 *   GET /products  — returns a product list with a server timestamp
 *   GET /health    — simple liveness probe for Docker health checks
 */

'use strict';

const express = require('express');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /products
 * Returns a static product catalogue with a live timestamp so you can
 * observe Nginx caching behaviour (timestamp should freeze when cached).
 */
app.get('/products', (_req, res) => {
    res.json({
        service:   'api',
        timestamp: new Date().toISOString(),
        products: [
            { id: 1, name: 'Widget A', price: 9.99 },
            { id: 2, name: 'Widget B', price: 19.99 },
            { id: 3, name: 'Widget C', price: 4.99 },
        ],
    });
});

/**
 * GET /health
 * Used by Docker / load balancers to verify the service is alive.
 */
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'api' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`[api-service] listening on port ${PORT}`);
});
