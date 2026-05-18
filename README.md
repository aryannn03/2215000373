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

    USERS {
        int userId PK
        string fullName
        string email
        string passwordHash
        string role
        string provider
        bigint mobile
        datetime createdAt
    }

    BOOKS {
        int bookId PK
        string title
        string author
        string isbn
        double price
        int stock
        string genre
        string publisher
        double rating
        text description
        string coverImageUrl
        date publishedDate
        boolean featured
    }

    CARTS {
        int cartId PK
        int userId
        double totalPrice
    }

    CART_ITEMS {
        int itemId PK
        int bookId
        string bookTitle
        double price
        int quantity
        int cartId FK
    }

    ORDERS {
        int orderId PK
        int userId
        date orderDate
        double amountPaid
        string modeOfPayment
        string razorpayPaymentId
        string orderStatus
        int quantity
        int bookId
        string bookTitle
        double bookPrice
        int addressId FK
    }

    ADDRESSES {
        int addressId PK
        int customerId
        string fullName
        string mobileNumber
        string flatNumber
        string street
        string city
        string pincode
        string state
    }

    WALLETS {
        int walletId PK
        int userId
        double currentBalance
    }

    STATEMENTS {
        int statementId PK
        string transactionType
        double amount
        datetime dateTime
        int orderId
        string transactionRemarks
        int walletId FK
    }

    REVIEWS {
        int reviewId PK
        int bookId
        int userId
        string fullName
        int rating
        text comment
        date reviewDate
        boolean verified
    }

    NOTIFICATIONS {
        int notificationId PK
        int userId
        string type
        text message
        boolean isRead
        datetime createdAt
    }

    WISHLISTS {
        int wishlistId PK
        int userId
        date createdAt
    }

    WISHLIST_ITEMS {
        int itemId PK
        int bookId
        string bookTitle
        double bookPrice
        int wishlistId FK
    }

    CARTS ||--o{ CART_ITEMS : contains
    WALLETS ||--o{ STATEMENTS : records
    WISHLISTS ||--o{ WISHLIST_ITEMS : contains
    ORDERS }o--|| ADDRESSES : "ships to"
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CARTS : owns
    USERS ||--o{ WALLETS : owns
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ WISHLISTS : owns
    BOOKS ||--o{ CART_ITEMS : "referenced in"
    BOOKS ||--o{ ORDERS : "ordered as"
    BOOKS ||--o{ REVIEWS : "reviewed in"
    BOOKS ||--o{ WISHLIST_ITEMS : "saved in"
```


```mermaid
flowchart TD
    subgraph GUEST["👤 Guest User"]
        G1[Browse books]
        G2[Search books]
        G3[Filter by genre / author / price]
        G4[View book details]
        G5[View reviews and ratings]
        G6[Register with OTP verification]
        G7[Login with email and password]
        G8[Login with GitHub OAuth2]
        G9[Login with Google OAuth2]
        G10[Forgot password with OTP reset]
    end

    subgraph CUSTOMER["🛒 Customer"]
        C1[View and update profile]
        C2[Change password]
        C3[Add book to cart]
        C4[Remove item from cart]
        C5[Update item quantity]
        C6[View cart total]
        C7[Add book to wishlist]
        C8[Remove book from wishlist]
        C9[Move wishlist item to cart]
        C10[Save delivery address]
        C11[Delete delivery address]
        C12[Place order via COD]
        C13[Place order via Wallet]
        C14[Place order via Razorpay]
        C15[View my orders]
        C16[Cancel order]
        C17[Create wallet]
        C18[Add money to wallet]
        C19[View wallet balance]
        C20[View transaction statements]
        C21[Write a review]
        C22[Update own review]
        C23[Delete own review]
        C24[View my reviews]
        C25[View notifications]
        C26[Mark notification as read]
        C27[Mark all notifications as read]
        C28[Delete notification]
        C29[View unread notification count]
        C30[Logout]
    end

    subgraph ADMIN["🔧 Admin"]
        A1[View all users]
        A2[Delete user]
        A3[Add new book]
        A4[Update book details]
        A5[Delete book]
        A6[Update book stock]
        A7[View all orders]
        A8[Change order status]
        A9[Delete order]
        A10[View all wallets]
        A11[View all reviews]
        A12[View all notifications]
        A13[View all addresses]
    end

    subgraph SYSTEM["⚙️ System Automated"]
        S1[Send OTP email on registration]
        S2[Send OTP email on forgot password]
        S3[Generate JWT on login]
        S4[Blacklist JWT on logout]
        S5[Refresh live book prices in cart]
        S6[Refresh live book prices in wishlist]
        S7[Deduct wallet balance on order]
        S8[Refund wallet on cancellation]
        S9[Deduct book stock on order]
        S10[Clear cart after order placed]
        S11[Verify Razorpay signature]
        S12[Send order confirmation email]
        S13[Send order cancellation email]
        S14[Send status change email]
        S15[Save in-app notification on order]
        S16[Verify purchase before review]
        S17[Sync book rating after review]
        S18[Register all services with Eureka]
        S19[Route requests via API Gateway]
        S20[Cache book data in Redis]
    end

    GUEST --> CUSTOMER
    CUSTOMER --> ADMIN
```
