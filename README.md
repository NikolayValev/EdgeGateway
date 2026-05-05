# EdgeGateway

> **Learning Nginx incrementally** — a minimal, well-commented monorepo for
> exploring reverse proxying, caching, rate limiting, load balancing, and
> security headers using small Node.js backend services.

---

## Project purpose

Nginx is the Swiss-army-knife of web infrastructure, but its feature set can feel
overwhelming at first. This repo solves that by:

1. Providing a **working baseline** you can run with a single command.
2. Organising every Nginx feature in its **own config file** so you can learn
   (and toggle) one feature at a time.
3. Including **small, readable Node.js services** so you can observe the effect
   of each Nginx change against a real backend.

---

## Repository structure

```
EdgeGateway/
├── nginx/
│   ├── nginx.conf              ← main config (global settings + includes)
│   └── conf.d/
│       ├── upstreams.conf      ← backend pool definitions
│       ├── routing.conf        ← virtual-host & location rules
│       ├── cache.conf          ← proxy_cache zone (commented out)
│       ├── security.conf       ← security headers (commented out)
│       └── logging.conf        ← custom log_format with timing fields
├── services/
│   ├── api/                    ← Express API on port 3000
│   │   ├── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   └── auth/                   ← Express Auth on port 3001
│       ├── index.js
│       ├── package.json
│       └── Dockerfile
├── static/                     ← Static frontend served by Nginx
│   ├── index.html
│   ├── 404.html
│   └── assets/
│       ├── style.css
│       └── app.js
├── docker-compose.yml
├── package.json                ← root convenience scripts
└── README.md
```

---

## How to run locally with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)

### Start everything

```bash
# Clone the repo
git clone https://github.com/NikolayValev/EdgeGateway.git
cd EdgeGateway

# Build images and start containers
npm start
# equivalent: docker compose up --build
```

Then open **http://localhost** in your browser.

| Route          | Destination              |
| -------------- | ------------------------ |
| `/`            | Static files (Nginx)     |
| `/api/…`       | API service (port 3000)  |
| `/auth/…`      | Auth service (port 3001) |

### Useful commands

```bash
npm run logs            # tail all container logs
npm run restart:nginx   # reload Nginx after config changes
npm run stop            # stop and remove containers
```

### Test the API directly

```bash
# Products endpoint
curl http://localhost/api/products

# Login endpoint
curl -s -X POST http://localhost/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"demo","password":"secret"}' | jq
```

---

## How to deploy to a single VM (e.g. Oracle Cloud Free Tier)

1. **Provision a VM** — Ubuntu 22.04, 1 OCPU / 1 GB RAM is enough to start.

2. **Open port 80** in the VM's security list / firewall:
   ```bash
   sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
   ```

3. **Install Docker** on the VM:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER && newgrp docker
   ```

4. **Clone and start** the project:
   ```bash
   git clone https://github.com/NikolayValev/EdgeGateway.git
   cd EdgeGateway
   docker compose up -d --build
   ```

5. Visit `http://<VM-PUBLIC-IP>` in your browser.

> **Tip:** To keep the stack running after SSH logout use
> `docker compose up -d --build` (detached mode).

---

## Future steps

Each feature has a `TODO` comment in the relevant `conf.d/` file. Work through
them in order:

### 1 — Caching (`conf.d/cache.conf`)

Uncomment `proxy_cache_path` in `cache.conf`, then add `proxy_cache api_cache;`
to the `/api/` location in `routing.conf`. Observe the `cs=` field in
access logs — it should change from `MISS` to `HIT` on the second request.

### 2 — Rate limiting (`conf.d/routing.conf`)

Uncomment the `limit_req_zone` directive and the `limit_req` inside
`/api/`. Hammer the endpoint with `ab` or `wrk` to see 429 responses kick in.

### 3 — Load balancing (`conf.d/upstreams.conf`)

Scale the API service:
```bash
docker compose up -d --scale api=3
```
Add extra `server api:3000;` lines to `api_pool` in `upstreams.conf` and
reload Nginx. Watch round-robin distribute requests in the logs.

### 4 — HTTPS with Let's Encrypt

Use [Certbot](https://certbot.eff.org/) with the Nginx plugin or swap the
`nginx` service for [nginx-proxy + acme-companion](https://github.com/nginx-proxy/acme-companion).
Add a `listen 443 ssl` block and redirect port 80 to 443.

### 5 — Security headers (`conf.d/security.conf`)

Uncomment headers one by one, then verify with
[securityheaders.com](https://securityheaders.com).

---

## License

MIT