# Ticket Management System - API cURL Commands

## **User APIs**

### **1. Signup**

```bash
curl -X POST 'http://localhost:5000/api/users/signup' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Pratik",
    "email": "pratik@test.com",
    "password": "StrongPass@123",
    "role": "user"
  }'
```

### **2. Login**

```bash
curl -X POST 'http://localhost:5000/api/users/login' \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "pratik@test.com",
    "password": "StrongPass@123"
  }'
```

---

## **Ticket APIs**

### **1. Create Ticket**

```bash
curl -X POST 'http://localhost:5000/api/tickets' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --data '{
    "priority": "medium",
    "createdByUsername": "Pratik",
    "createdByUserEmail": "pratik@test.com",
    "createdByUserPhone": "1234567890",
    "IssueCategory": "Delivery Issue",
    "OrderId": "ORD-123456",
    "Subject": "Package delayed",
    "description": "My order has not arrived yet.",
    "AttachmentUrl": "",
    "InternalNotes": "",
    "replay": "",
    "replayAttachmentUrl": ""
  }'
```

### **2. Get Tickets for Logged-in Member**

```bash
curl -X GET 'http://localhost:5000/api/tickets/member' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### **3. Get All Tickets (Team Leader)**

```bash
curl -X GET 'http://localhost:5000/api/tickets' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### **4. Reply to Ticket**

```bash
curl -X PUT 'http://localhost:5000/api/tickets/TICKET_ID/reply' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --data '{
    "replay": "Issue resolved, please check.",
    "replayAttachmentUrl": ""
  }'
```

---

## **Issue Category APIs**

### **1. Create Category**

```bash
curl -X POST 'http://localhost:5000/api/categories' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --data '{
    "typeOfCategory": "Delivery Issue",
    "questions": "How long does delivery take?",
    "answer": "Usually 3-5 business days."
  }'
```

### **2. Get All Categories**

```bash
curl -X GET 'http://localhost:5000/api/categories' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### **3. Update Category**

```bash
curl -X PUT 'http://localhost:5000/api/categories/CATEGORY_ID' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --data '{
    "typeOfCategory": "Payment Issue",
    "questions": "How to make payment?",
    "answer": "You can pay via credit/debit or UPI."
  }'
```

### **4. Delete Category**

```bash
curl -X DELETE 'http://localhost:5000/api/categories/CATEGORY_ID' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN'
```







SMTP password ( email services )----hwpd czuo svyd unzw
