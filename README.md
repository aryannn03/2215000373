# 🏗️ BookNest Microservices Architecture

```mermaid
flowchart TB

%% ================= FRONTEND =================
A["Angular Frontend<br/>Port: 4200<br/>JWT Authentication"]

%% ================= API GATEWAY =================
B["API Gateway<br/>Port: 8080<br/>Spring Cloud Gateway"]

%% ================= EUREKA =================
C["Eureka Server<br/>Port: 8761<br/>Service Discovery"]

A -->|HTTPS REST| B
B <--> C

%% ================= MICROSERVICES =================
subgraph SERVICES [Microservices]

D["Auth Service<br/>8081"]

E["Book Service<br/>8082"]

F["Cart Service<br/>8083"]

G["Order Service<br/>8084"]

H["Wallet Service<br/>8085"]

I["Review Service<br/>8086"]

J["Notification Service<br/>8087"]

K["Wishlist Service<br/>8088"]

end

%% ================= GATEWAY ROUTING =================
B --> D
B --> E
B --> F
B --> G
B --> H
B --> I
B --> J
B --> K

%% ================= INTER SERVICE COMMUNICATION =================
F -.->|Feign| E
G -.->|Feign| H
I -.->|Feign| E
K -.->|Feign| E

%% ================= RABBITMQ =================
L["RabbitMQ<br/>Async Messaging"]

G -->|Publish Event| L
L -->|Consume Event| J

%% ================= REDIS =================
M["Redis Cache<br/>OTP Store<br/>Token Blacklist"]

D --> M
E --> M

%% ================= DATABASES =================
subgraph DATABASES [MySQL Databases]

N["auth_db"]

O["book_db"]

P["cart_db"]

Q["order_db"]

R["wallet_db"]

S["review_db"]

T["wishlist_db"]

U["notification_db"]

end

D --> N
E --> O
F --> P
G --> Q
H --> R
I --> S
K --> T
J --> U

%% ================= EXTERNAL SERVICES =================
subgraph EXTERNALS [External Services]

V["Google OAuth2"]

W["Razorpay Payment Gateway"]

X["Gmail SMTP"]

end

D --> V
G --> W
J --> X
```

---

## 🔧 Tech Stack

- Angular
- Spring Boot
- Spring Cloud Gateway
- Eureka Discovery Server
- RabbitMQ
- Redis
- MySQL
- JWT Authentication
- Razorpay Integration
- Gmail SMTP
- Docker

---

## ✨ Key Features

- Microservices Architecture
- API Gateway Routing
- JWT Authentication & Authorization
- Service Discovery using Eureka
- Asynchronous Communication using RabbitMQ
- Redis Caching & Token Blacklisting
- Razorpay Payment Integration
- Wishlist, Cart & Wallet Modules
- Email Notification System
- Independent Databases per Service
