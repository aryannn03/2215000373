## 🏗️ BookNest Microservices Architecture

```mermaid
flowchart TB

%% =====================================================
%% FRONTEND
%% =====================================================

FE[Angular Frontend<br/>Port: 4200<br/>AuthGuard + AdminGuard<br/>JWT + localStorage]

%% =====================================================
%% API GATEWAY & DISCOVERY
%% =====================================================

GW[API Gateway<br/>Port: 8080<br/>Spring Cloud Gateway<br/>CORS + JWT passthrough + Swagger UI]

EU[Eureka Discovery Server<br/>Port: 8761<br/>Service Discovery]

FE -->|HTTPS + Bearer JWT| GW
GW --> EU

%% =====================================================
%% JWT SHARED INFRASTRUCTURE
%% =====================================================

JWT[Shared JWT Secret<br/>Auth issues token<br/>All services validate locally<br/>using JwtUtil]

AUTH --> JWT
BOOK --> JWT
CART --> JWT
ORDER --> JWT
WALLET --> JWT
REVIEW --> JWT
NOTIF --> JWT
WISHLIST --> JWT

%% =====================================================
%% MICROSERVICES
%% =====================================================

AUTH[Auth Service<br/>Port: 8081<br/>JWT + OAuth2]

BOOK[Book Service<br/>Port: 8082<br/>Redis Cache]

CART[Cart Service<br/>Port: 8083<br/>Feign Clients]

ORDER[Order Service<br/>Port: 8084<br/>Razorpay + RabbitMQ]

WALLET[Wallet Service<br/>Port: 8085<br/>Transactional]

REVIEW[Review Service<br/>Port: 8086<br/>Ratings + Verification]

NOTIF[Notification Service<br/>Port: 8087<br/>RabbitMQ Consumer + Gmail]

WISHLIST[Wishlist Service<br/>Port: 8088<br/>Save for Later]

%% =====================================================
%% API GATEWAY ROUTING
%% =====================================================

GW --> AUTH
GW --> BOOK
GW --> CART
GW --> ORDER
GW --> WALLET
GW --> REVIEW
GW --> NOTIF
GW --> WISHLIST

%% =====================================================
%% INTER-SERVICE FEIGN COMMUNICATION
%% =====================================================

CART -.->|Live price & stock| BOOK

ORDER -->|Fetch user email| AUTH
ORDER -->|Wallet pay/refund| WALLET
ORDER -->|In-app notification| NOTIF

REVIEW -.->|Purchase verification| ORDER
REVIEW -->|Update ratings| BOOK

WISHLIST -.->|Refresh prices| BOOK
WISHLIST -->|Move to cart| CART

%% =====================================================
%% MESSAGE BROKER
%% =====================================================

RMQ[RabbitMQ<br/>orderExchange<br/>order.notification.queue]

ORDER -->|Publish Order Event| RMQ
RMQ -->|Consume Email Event| NOTIF

%% =====================================================
%% REDIS CACHE
%% =====================================================

REDIS[Redis Cache<br/>OTP Storage<br/>Token Blacklist<br/>Books Cache]

AUTH -->|OTP + blacklist| REDIS
BOOK -->|Book caching| REDIS

%% =====================================================
%% DATABASES
%% =====================================================

ADB[(auth_db)]
BDB[(book_db)]
CDB[(cart_db)]
ODB[(order_db)]
WDB[(wallet_db)]
RDB[(review_db)]
NDB[(notif_db)]
WLDB[(wishlist_db)]

AUTH --> ADB
BOOK --> BDB

CART -->|Store cart data| CDB

ORDER --> ODB

WALLET --> WDB

REVIEW -->|Store reviews| RDB

NOTIF -->|Store notifications| NDB

WISHLIST -->|Store wishlist| WLDB

%% =====================================================
%% EXTERNAL SERVICES
%% =====================================================

GOOGLE[Google OAuth2]
GITHUB[GitHub OAuth2]
RAZOR[Razorpay Gateway]
MAIL[Gmail SMTP]

AUTH --> GOOGLE
AUTH --> GITHUB

ORDER --> RAZOR

NOTIF --> MAIL
```
---



## 📌 Entity Relationship Diagram (ERD)

```mermaid
erDiagram

%% =====================================================
%% USERS
%% =====================================================

USERS {
    int id PK
    string name
    string email
    string passwordHash
    string provider
    string role
    boolean enabled
    datetime createdAt
}

%% =====================================================
%% BOOKS
%% =====================================================

BOOKS {
    int id PK
    string title
    string author
    decimal price
    string isbn
    string publisher
    integer stock
    string category
    string imageUrl
    text description
    decimal avgRating
    datetime publishedDate
}

%% =====================================================
%% CART
%% =====================================================

CARTS {
    int id PK
    int userId FK
}

CART_ITEMS {
    int id PK
    int cartId FK
    int bookId FK
    decimal price
    int quantity
    int count
}

%% =====================================================
%% ORDERS
%% =====================================================

ORDERS {
    int id PK
    int userId FK
    decimal totalAmount
    string paymentMethod
    string orderStatus
    string shippingAddress
    datetime createdAt
}

ORDER_ITEMS {
    int id PK
    int orderId FK
    int bookId FK
    decimal price
    int quantity
}

%% =====================================================
%% REVIEWS
%% =====================================================

REVIEWS {
    int id PK
    int userId FK
    int bookId FK
    int rating
    string comment
    datetime createdAt
}

%% =====================================================
%% WISHLIST
%% =====================================================

WISHLISTS {
    int id PK
    int userId FK
}

WISHLIST_ITEMS {
    int id PK
    int wishlistId FK
    int bookId FK
}

%% =====================================================
%% WALLET
%% =====================================================

WALLETS {
    int id PK
    int userId FK
    decimal balance
}

TRANSACTIONS {
    int id PK
    int walletId FK
    string type
    decimal amount
    string status
    datetime createdAt
}

%% =====================================================
%% ADDRESSES
%% =====================================================

ADDRESSES {
    int id PK
    int userId FK
    string fullName
    string mobileNumber
    string addressLine
    string city
    string pincode
    string state
}

%% =====================================================
%% RELATIONSHIPS
%% =====================================================

USERS ||--o{ ORDERS : places
USERS ||--|| CARTS : owns
USERS ||--|| WISHLISTS : owns
USERS ||--|| WALLETS : has
USERS ||--o{ REVIEWS : writes
USERS ||--o{ ADDRESSES : saves

BOOKS ||--o{ CART_ITEMS : added_in
BOOKS ||--o{ ORDER_ITEMS : ordered
BOOKS ||--o{ REVIEWS : reviewed_in
BOOKS ||--o{ WISHLIST_ITEMS : saved_in

CARTS ||--o{ CART_ITEMS : contains

ORDERS ||--o{ ORDER_ITEMS : contains

WALLETS ||--o{ TRANSACTIONS : records

WISHLISTS ||--o{ WISHLIST_ITEMS : contains
```
