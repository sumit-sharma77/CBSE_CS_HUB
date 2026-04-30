# CBSE CS Hub

A full-stack CBSE Class 11/12 Computer Science adaptive MCQ practice platform.

## Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Spring Boot 3.4.5, Java 21, Flyway, Spring Security 6 |
| Database   | PostgreSQL 16 (JPA/Hibernate), Redis 7 (cache + leaderboard) |
| Frontend   | Angular 21.2.9, Tailwind CSS 4, Angular Signals |
| Payments   | Razorpay Subscriptions |
| Realtime   | Spring WebSocket + STOMP |
| Deploy     | Railway (API) + Vercel (Angular) |

## Quick Start

```powershell
# Clone
git clone https://github.com/YOUR_ORG/cbse-cs-hub.git
cd cbse-cs-hub

# First run — creates .env from example
./start.ps1
# Edit .env with your secrets, then run again
./start.ps1
```

## Development

### Backend only
```bash
cd cbse-api
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend only
```bash
cd cbse-cs-hub
ng serve --proxy-config proxy.conf.json --open
```

### Docker Compose (all services)
```bash
docker compose up --build
```

## Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | ≥32-char random secret |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API keys |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | Gmail App Password |
| `CORS_ORIGINS` | Comma-separated allowed origins |

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | ✗ | Register user |
| POST | `/api/v1/auth/login` | ✗ | Login (sets cookies) |
| POST | `/api/v1/auth/logout` | ✓ | Logout |
| POST | `/api/v1/auth/refresh` | ✓ | Refresh access token |
| GET | `/api/v1/users/me` | ✓ | Current user |
| GET | `/api/v1/users/me/progress` | ✓ | Badges + stats |
| GET | `/api/v1/plans` | ✗ | List subscription plans |
| POST | `/api/v1/subscriptions/checkout` | ✓ | Initiate Razorpay checkout |
| POST | `/api/v1/tests/sessions` | ✓ | Start test session |
| POST | `/api/v1/tests/sessions/{id}/submit` | ✓ | Submit test |
| GET | `/api/v1/tests/history` | ✓ | Test history (paginated) |
| GET | `/api/v1/leaderboard/global` | ✓ | Global top 10 + my rank |
| GET | `/api/v1/leaderboard/weekly` | ✓ | Weekly top 10 |
| GET | `/api/v1/entitlement/check?topic={id}` | ✓ | Free tier gate |

## Testing

```bash
# Unit + integration tests
cd cbse-api && mvn verify

# Load test (requires k6 + running API)
k6 run k6/load-test.js -e BASE_URL=http://localhost:8080

# Smoke test
chmod +x smoke-test.sh && ./smoke-test.sh http://localhost:8080
```

## Deployment

- **API**: Railway — auto-deploys from `main` branch via GitHub Actions
- **Frontend**: Vercel — connect the `cbse-cs-hub` directory, set `VITE_API_URL` if needed

## Architecture

```
Browser ←→ Angular (Vercel)
              │  withCredentials: true (httpOnly cookies)
              ↓
         Spring Boot API (Railway)
              ├── Spring Security (JWT filter)
              ├── Flyway (13 migrations)
              ├── JPA / PostgreSQL
              ├── Redis (rate limit, blocklist, leaderboard, daily limits)
              └── Razorpay (subscription billing)
```

## License

MIT
