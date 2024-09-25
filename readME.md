# Manga Blog API Documentation

### Authentication (`api/auth`)

1. POST `/api/auth/login`

- Request Body:

```json
{
  "email": string,
  "password": string
}
```

- Response:
  - 200 OK:
  ```json
  {
    "token": string
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
  "username": string,
  "email": string,
  "password": string,
  "confirmPassword": string
}
```

- Response:
  - 201 Created:
  ```json
  {
    "token": string
  }
  ```
  - 400 Bad Request:
  ```json
  {
    "errors": [
      {
        "type": string,
        "value": string,
        "msg": string,
        "path": string,
        "location": string
      }
    ]
  }
  ```
