# 🏗️ BookNest Microservices Architecture

```mermaid
flowchart TB

%% FRONTEND
A[Angular Frontend<br/>Port: 4200<br/>AuthGuard | JWT | AdminGuard]

%% API GATEWAY
B[API Gateway<br/>Port: 8080<br/>Spring Cloud Gateway<br/>JWT | Routing | Swagger]

%% EUREKA
C[Eureka Server<br/>Port: 8761<br/>Service Discovery]

A -->|HTTPS / REST| B
B <--> C

%% MICROSERVICES
subgraph SERVICES[Microservices]

D[Auth Service<br/>:8081<br/>JWT + OAuth2]
E[Book Service<br/>:8082<br/>Redis Cache]
F[Cart Service<br/>:8083<br/>Feign Client]
G[Order Service<br/>:8084<br/>Razorpay]
H[Wallet Service<br/>:8085<br/>Transactional]
I[Review Service<br/>:8086<br/>Feign Client]
J[Notification Service<br/>:8087<br/>RabbitMQ Consumer]
K[Wishlist Service<br/>:8088<br/>Feign Client]

end

%% GATEWAY ROUTING
B --> D
B --> E
B --> F
B --> G
B --> H
B --> I
B --> J
B --> K

%% FEIGN COMMUNICATION
F -.->|Feign| E
F -.->|Feign| D
G -.->|Feign| H
G -.->|Feign| E
I -.->|Feign| E
K -.->|Feign| E

%% RABBITMQ
L[RabbitMQ<br/>order-exchange<br/>order-notification-queue]

G -->|Publish| L
L -->|Consume| J

%% REDIS
M[Redis<br/>OTP Store<br/>Token Blacklist<br/>Book Cache]

D --> M
E --> M

%% DATABASES
subgraph DATABASES[MySQL Databases]

N[auth_db<br/>users]
O[book_db<br/>books]
P[cart_db<br/>cart_items]
Q[order_db<br/>orders]
R[wallet_db<br/>wallets + txns]
S[review_db<br/>reviews]
T[wishlist_db<br/>wishlists]
U[notification_db<br/>notifications]

end

D --> N
E --> O
F --> P
G --> Q
H --> R
I --> S
K --> T
J --> U

%% EXTERNAL SERVICES
subgraph EXTERNALS[External Services]

V[Google OAuth2]
W[Razorpay Payment Gateway]
X[Gmail SMTP]
Y[Razorpay SDK]

end

D --> V
G --> W
G --> Y
J --> X
```
