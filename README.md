# 📚 BookNest Microservices Architecture

## 🏗️ System Overview

BookNest is a scalable microservices-based online bookstore platform built using Spring Boot, Spring Cloud, Angular, RabbitMQ, Redis, and MySQL.

The system follows:
- Database-per-service pattern
- Event-driven communication using RabbitMQ
- JWT-based authentication & authorization
- API Gateway routing
- Service discovery using Eureka
- Distributed caching using Redis

---

# 🧩 Architecture Diagram

```mermaid
flowchart TB

%% ================= FRONTEND =================
FE[Angular Frontend<br/>:4200 - authGuard - adminGuard - JWT localStorage]

%% ================= GATEWAY =================
GW[API Gateway :8080<br/>Spring Cloud Gateway - CORS - JWT passthrough - Swagger UI]

%% ================= DISCOVERY =================
EU[Eureka Discovery<br/>:8761 - discovery]

%% ================= MICROSERVICES =================
AUTH[Auth Service<br/>:8081 - JWT - OAuth2]
BOOK[Book Service<br/>:8082 - Redis cache]
CART[Cart Service<br/>:8083 - Feign]
ORDER[Order Service<br/>:8084 - Razorpay]
WALLET[Wallet Service<br/>:8085 - Transactional]
REVIEW[Review Service<br/>:8086 - Feign]
NOTIF[Notification Service<br/>:8087 - AMQP consumer - Gmail]
WISH[Wishlist Service<br/>:8088 - Feign]

%% ================= MESSAGE BROKER =================
RABBIT[RabbitMQ<br/>exchange = order.notification.exchange<br/>queue = order.notification.queue]

%% ================= CACHE =================
REDIS[Redis<br/>OTP - token blacklist - book cache]

%% ================= DATABASES =================
AUTHDB[(auth_db<br/>users)]
BOOKDB[(book_db<br/>books)]
CARTDB[(cart_db<br/>cart-items)]
ORDERDB[(order_db<br/>orders-add)]
WALLETDB[(wallet_db<br/>wallets-stmts)]
REVIEWDB[(review_db<br/>reviews)]
WISHDB[(wishlist_db<br/>wishlists-items)]
NOTIFDB[(notification_db<br/>notifications)]

%% ================= EXTERNAL SERVICES =================
GOOGLE[GitHub OAuth2 / Google OAuth2]
RAZOR[Razorpay Payment Gateway]
SMTP[Gmail SMTP]
SDK[Razorpay SDK]

%% ================= CONNECTIONS =================

FE -->|HTTPS REST| GW

GW --> AUTH
GW --> BOOK
GW --> CART
GW --> ORDER
GW --> WALLET
GW --> REVIEW
GW --> NOTIF
GW --> WISH

AUTH --> EU
BOOK --> EU
CART --> EU
ORDER --> EU
WALLET --> EU
REVIEW --> EU
NOTIF --> EU
WISH --> EU
GW --> EU

%% ================= DATABASE CONNECTIONS =================

AUTH --> AUTHDB
BOOK --> BOOKDB
CART --> CARTDB
ORDER --> ORDERDB
WALLET --> WALLETDB
REVIEW --> REVIEWDB
WISH --> WISHDB
NOTIF --> NOTIFDB

%% ================= REDIS =================

AUTH --> REDIS
BOOK --> REDIS

%% ================= FEIGN =================

CART -. Feign .-> BOOK
REVIEW -. Feign .-> BOOK
WISH -. Feign .-> BOOK
ORDER -. Feign .-> WALLET

%% ================= RABBITMQ =================

ORDER -->|publish| RABBIT
RABBIT -->|consume| NOTIF

%% ================= EXTERNAL SERVICES =================

AUTH --> GOOGLE
ORDER --> RAZOR
ORDER --> SDK
NOTIF --> SMTP
```

---

# ⚙️ Tech Stack

## Frontend
- Angular
- Bootstrap
- JWT Authentication
- Route Guards

## Backend
- Spring Boot
- Spring Security
- Spring Cloud Gateway
- Eureka Discovery Server
- OpenFeign

## Databases & Cache
- MySQL
- Redis

## Messaging
- RabbitMQ

## External Integrations
- Razorpay Payment Gateway
- Gmail SMTP
- OAuth2 Login

---

# 🔐 Security Features

- JWT Authentication
- Role-based Authorization
- Token Blacklisting using Redis
- OAuth2 Login Support
- API Gateway Authentication Filter

---

# 🚀 Microservices

| Service | Port | Responsibility |
|---|---|---|
| API Gateway | 8080 | Routing & Security |
| Eureka Server | 8761 | Service Discovery |
| Auth Service | 8081 | Authentication & JWT |
| Book Service | 8082 | Book Management |
| Cart Service | 8083 | Shopping Cart |
| Order Service | 8084 | Orders & Payments |
| Wallet Service | 8085 | Wallet Transactions |
| Review Service | 8086 | Reviews & Ratings |
| Notification Service | 8087 | Email Notifications |
| Wishlist Service | 8088 | Wishlist Management |

---

# 📦 Key Architecture Patterns

## API Gateway Pattern
All client requests pass through Spring Cloud Gateway.

## Database Per Service
Each microservice maintains its own isolated MySQL schema.

## Event-Driven Architecture
RabbitMQ enables asynchronous communication between services.

## Distributed Caching
Redis is used for:
- OTP storage
- JWT blacklist
- Book caching

## Service Discovery
Eureka dynamically manages service registration and discovery.

---

# 🔄 Order Processing Flow

1. User places order from Angular frontend
2. API Gateway routes request to Order Service
3. Order Service validates payment using Razorpay
4. Wallet Service updates transaction records
5. Order Service publishes event to RabbitMQ
6. Notification Service consumes event
7. Email confirmation sent via Gmail SMTP

---

# 🧠 Highlights

- Scalable microservices architecture
- Async communication using RabbitMQ
- Secure JWT authentication
- Redis caching for performance
- OAuth2 social login
- Clean API Gateway routing
- Independent service databases
- Production-ready backend design

---
