```mermaid
flowchart TB

%% ================= FRONTEND =================
FE[Angular Frontend<br/>4200]

%% ================= GATEWAY =================
GW[API Gateway<br/>8080]

%% ================= DISCOVERY =================
EU[Eureka Server<br/>8761]

%% ================= MICROSERVICES =================
AUTH[Auth Service<br/>8081]
BOOK[Book Service<br/>8082]
CART[Cart Service<br/>8083]
ORDER[Order Service<br/>8084]
WALLET[Wallet Service<br/>8085]
REVIEW[Review Service<br/>8086]
NOTIF[Notification Service<br/>8087]
WISH[Wishlist Service<br/>8088]

%% ================= MESSAGING =================
RABBIT[RabbitMQ]
REDIS[Redis Cache]

%% ================= DATABASES =================
AUTHDB[(auth_db)]
BOOKDB[(book_db)]
CARTDB[(cart_db)]
ORDERDB[(order_db)]
WALLETDB[(wallet_db)]
REVIEWDB[(review_db)]
WISHDB[(wishlist_db)]
NOTIFDB[(notification_db)]

%% ================= EXTERNAL =================
GOOGLE[OAuth2]
RAZOR[Razorpay]
SMTP[Gmail SMTP]

%% ================= FLOW =================

FE --> GW

GW --> AUTH
GW --> BOOK
GW --> CART
GW --> ORDER
GW --> WALLET
GW --> REVIEW
GW --> NOTIF
GW --> WISH

%% Eureka
AUTH -.-> EU
BOOK -.-> EU
CART -.-> EU
ORDER -.-> EU
WALLET -.-> EU
REVIEW -.-> EU
NOTIF -.-> EU
WISH -.-> EU
GW -.-> EU

%% Databases
AUTH --> AUTHDB
BOOK --> BOOKDB
CART --> CARTDB
ORDER --> ORDERDB
WALLET --> WALLETDB
REVIEW --> REVIEWDB
WISH --> WISHDB
NOTIF --> NOTIFDB

%% Redis
AUTH --> REDIS
BOOK --> REDIS

%% RabbitMQ
ORDER --> RABBIT
RABBIT --> NOTIF

%% Feign
CART -. Feign .-> BOOK
REVIEW -. Feign .-> BOOK
WISH -. Feign .-> BOOK
ORDER -. Feign .-> WALLET

%% External Services
AUTH --> GOOGLE
ORDER --> RAZOR
NOTIF --> SMTP
```
