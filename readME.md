# Manga Blog API Documentation

### Authentication (`api/auth`)

1. POST `/api/auth/login`

- Request Body:

```json
{
  "email": "johndoe123@gmail.com",
  "password": "password123"
}
```

- Response:
  - 200 OK:
  ```json
  {
    "token": "JWT Token here"
  }
  ```
  - 401 Unauthorized:
  ```json
  {
    "name": "UnauthorizedError",
    "statusCode": 401,
    "isOperational": true,
    "message": "Invalid Credentials"
  }
  ```

2. POST `api/auth/signup`

- Request Body:

```json
{
  "username": "johndoe",
  "email": "johndoe123@gmail.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

- Response:
  - 201 Created:
  ```json
  {
    "token": "JWT Token here"
  }
  ```
  - 400 Bad Request:
  ```json
  {
    "errors": [
      {
        "type": "field",
        "value": "janesmsith++",
        "msg": "Username must contain only letters and numbers",
        "path": "username",
        "location": "body"
      },
      {
        "type": "field",
        "value": "janesmith456gmail.com",
        "msg": "Invalid email address",
        "path": "email",
        "location": "body"
      },
      {
        "type": "field",
        "value": "password456",
        "msg": "Passwords do not match",
        "path": "confirmPassword",
        "location": "body"
      }
    ]
  }
  ```
