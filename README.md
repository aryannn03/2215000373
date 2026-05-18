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
flowchart LR

    GUEST(["👤 Guest"])
    CUSTOMER(["🛒 Customer"])
    ADMIN(["🔧 Admin"])

    GUEST --> CUSTOMER

    subgraph PUB["Public Access"]
        direction TB
        UC1([Browse all books])
        UC2([Search books by keyword])
        UC3([Filter by genre / author / price])
        UC4([View book details])
        UC5([View reviews and ratings])
        UC6([Register with OTP verification])
        UC7([Login with email and password])
        UC8([Login with GitHub OAuth2])
        UC9([Login with Google OAuth2])
        UC10([Forgot password via OTP])
    end

    subgraph PROFILE["Profile Management"]
        direction TB
        UC11([View profile])
        UC12([Update profile])
        UC13([Change password])
        UC14([Logout])
    end

    subgraph CART["Cart Management"]
        direction TB
        UC15([Add book to cart])
        UC16([Remove item from cart])
        UC17([Update item quantity])
        UC18([View cart and total])
        UC19([Clear cart])
    end

    subgraph WISH["Wishlist Management"]
        direction TB
        UC20([Add book to wishlist])
        UC21([Remove book from wishlist])
        UC22([Move item to cart])
        UC23([Clear wishlist])
    end

    subgraph ORDER["Order Management"]
        direction TB
        UC24([Save delivery address])
        UC25([Delete delivery address])
        UC26([Place order via COD])
        UC27([Place order via Wallet])
        UC28([Place order via Razorpay])
        UC29([View my orders])
        UC30([Cancel order])
    end

    subgraph WALLET["Wallet Management"]
        direction TB
        UC31([Create wallet])
        UC32([Add money to wallet])
        UC33([View wallet balance])
        UC34([View transaction statements])
    end

    subgraph REVIEW["Review Management"]
        direction TB
        UC35([Write a review])
        UC36([Update own review])
        UC37([Delete own review])
        UC38([View my reviews])
    end

    subgraph NOTIF["Notifications"]
        direction TB
        UC39([View notifications])
        UC40([Mark notification as read])
        UC41([Mark all as read])
        UC42([Delete notification])
        UC43([View unread count])
    end

    subgraph ADMIN_UC["Admin Controls"]
        direction TB
        UC44([View all users])
        UC45([Delete user])
        UC46([Add new book])
        UC47([Update book details])
        UC48([Delete book])
        UC49([Update book stock])
        UC50([View all orders])
        UC51([Change order status])
        UC52([Delete order])
        UC53([View all wallets])
        UC54([View all reviews])
        UC55([View all notifications])
    end

    subgraph SYSTEM["System Automated"]
        direction TB
        UC56([Send OTP email])
        UC57([Generate JWT on login])
        UC58([Blacklist JWT on logout])
        UC59([Refresh live prices in cart])
        UC60([Refresh live prices in wishlist])
        UC61([Deduct wallet on order])
        UC62([Refund wallet on cancel])
        UC63([Deduct stock on order])
        UC64([Clear cart after order])
        UC65([Verify Razorpay signature])
        UC66([Send order confirmation email])
        UC67([Send cancellation email])
        UC68([Verify purchase before review])
        UC69([Sync book rating after review])
        UC70([Cache book data in Redis])
    end

    GUEST --> PUB
    CUSTOMER --> PROFILE
    CUSTOMER --> CART
    CUSTOMER --> WISH
    CUSTOMER --> ORDER
    CUSTOMER --> WALLET
    CUSTOMER --> REVIEW
    CUSTOMER --> NOTIF
    ADMIN --> ADMIN_UC
    ADMIN --> ORDER

    PUB --> SYSTEM
    ORDER --> SYSTEM
    CART --> SYSTEM
    WISH --> SYSTEM
    REVIEW --> SYSTEM
    WALLET --> SYSTEM
```
