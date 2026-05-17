flowchart TB

end

%% ================= DATABASE CONNECTIONS =================
D --> N
E --> O
F --> P
G --> Q
H --> R
I --> S
K --> T
J --> U

%% ================= EXTERNAL SERVICES =================
subgraph EXTERNAL_SERVICES[External Services]

V[Google OAuth2]
W[Razorpay Payment Gateway]
X[Gmail SMTP]
Y[Razorpay SDK]

end

D --> V
G --> W
G --> Y
J --> X

%% ================= SECURITY =================
Z[Shared JWT Security\nAll Services Validate Tokens Using JwtUtil]

D -.-> Z
E -.-> Z
F -.-> Z
G -.-> Z
H -.-> Z
I -.-> Z
J -.-> Z
K -.-> Z

%% ================= STYLING =================
classDef frontend fill:#6C63FF,color:#fff,stroke:#333,stroke-width:2px;
classDef gateway fill:#2196F3,color:#fff,stroke:#333,stroke-width:2px;
classDef service fill:#16A085,color:#fff,stroke:#333,stroke-width:2px;
classDef db fill:#F39C12,color:#fff,stroke:#333,stroke-width:2px;
classDef infra fill:#8E44AD,color:#fff,stroke:#333,stroke-width:2px;
classDef external fill:#7F8C8D,color:#fff,stroke:#333,stroke-width:2px;
classDef messaging fill:#D35400,color:#fff,stroke:#333,stroke-width:2px;

class A frontend;
class B gateway;
class C,Z infra;
class D,E,F,G,H,I,J,K service;
class N,O,P,Q,R,S,T,U db;
class V,W,X,Y external;
class L messaging;
class M db;
