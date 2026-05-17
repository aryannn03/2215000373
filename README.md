# 🏗️ BookNest Microservices Architecture

<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY/main/assets/architecture.png" alt="BookNest Architecture Diagram" width="100%">
</p>

---

## 📌 Overview

BookNest is a scalable **Microservices-based Online Bookstore Application** built using:

- Angular
- Spring Boot
- Spring Cloud Gateway
- Eureka Discovery Server
- RabbitMQ
- Redis
- MySQL
- JWT Authentication
- Razorpay Integration

The system follows a distributed microservices architecture where each service is independently deployable and communicates using REST APIs and asynchronous messaging.

---

# ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular |
| Backend | Spring Boot |
| API Gateway | Spring Cloud Gateway |
| Service Discovery | Eureka |
| Security | Spring Security + JWT |
| OAuth | Google OAuth2 |
| Communication | REST + OpenFeign |
| Messaging | RabbitMQ |
| Cache | Redis |
| Database | MySQL |
| Payment Gateway | Razorpay |
| Email Service | Gmail SMTP |

---

# 🧩 Microservices

| Service | Port | Responsibility |
|---|---|---|
| API Gateway | 8080 | Routing, JWT Validation, CORS |
| Auth Service | 8081 | Authentication & Authorization |
| Book Service | 8082 | Book Management |
| Cart Service | 8083 | Cart Operations |
| Order Service | 8084 | Order & Payment Processing |
| Wallet Service | 8085 | Wallet Transactions |
| Review Service | 8086 | Ratings & Reviews |
| Notification Service | 8087 | Email Notifications |
| Wishlist Service | 8088 | Wishlist Management |
| Eureka Server | 8761 | Service Discovery |

---

# 🔐 Security Features

- JWT Authentication
- Role-Based Authorization
- OAuth2 Login
- API Gateway Security
- Token Blacklisting using Redis
- BCrypt Password Encryption

---

# 📨 Messaging Architecture

RabbitMQ is used for asynchronous communication between services.

### Flow
1. Order Service publishes order events
2. RabbitMQ processes the message
3. Notification Service consumes the event
4. Email notification is sent to the user

---

# ⚡ Redis Usage

Redis is used for:

- OTP Storage
- JWT Token Blacklisting
- Book Data Caching
- Performance Optimization

---

# 🌐 External Integrations

- Google OAuth2
- Razorpay Payment Gateway
- Gmail SMTP
- Razorpay Signature Verification

---

# 🚀 Future Improvements

- Docker & Kubernetes Deployment
- CI/CD Pipeline
- Distributed Tracing
- Centralized Logging
- Monitoring with Prometheus & Grafana

---

# 👨‍💻 Author

**Aryan Malik**  
B.Tech CSE Student  
Full Stack Java Developer 🚀
