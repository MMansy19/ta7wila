## API Reference Documentation
This document provides a detailed explanation of the API endpoints, including their methods, parameters, and responses.

---
## Base URL
All endpoints use the following base URL:
```
https://api.ta7wila.com/v3
```
---
## Endpoints
### 1. Checkout
#### POST `/checkout/generate`
Create checkout page per order/subscription by item details
**Headers:**
```
Authorization: Bearer <API_KEY>
```
**Request:**
```json
{
    "application_id":"2",
    "customer_name":"Ahmed Reda",
    "customer_email":"ahemdreda0219@gmail.com",
    "customer_mobile":"+201145099681",
    "amount":120, // subscription / order total amount should be number
    "item_id":"485939538389", // subscription / order id
    // additional information can send with request
    "extra":"{course_id:"837847373",user_id:"3929423489328"}"
}
```
**Response:**
- **200 OK**
```json
{
  "success": true,
  "result": {
    "redirect_frame_url": "https://{SUBDOMAIN}.ta7wila.com/?application_id=2&amount=120&ref_id=CTRI20250122000006&token={API_KEY}"
  }
}
```
- **422 Validation error**
```json
{
  "result": {
    "application_id": "Required field",
    "customer_name": "Required field",
    "item_id": "Required field",
    "amount": "Required field",
    "customer_mobile": "Required field",
    "customer_email": "Required field"
  },
  "statusCode": 422,
  "status": "failed",
  "success": false
}
```

## Notes

- Ensure to replace `<API_KEY>` with the actual token received from the authentication endpoint.
- All timestamps are in ISO 8601 format.
- For secure access, use HTTPS for all API requests.
---
## Contact
For any questions or issues, contact the API support team at support@ta7wila.com.