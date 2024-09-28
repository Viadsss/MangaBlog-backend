# Manga Blog API Documentation

## 1. Authentication

### POST `/api/auth/login`

**Purpose:** Log in a user by validating their credentials.

**Request Body:**

- **email** (String): User's email address
- **password** (String): User's password

**Responses:**

- **200 OK:** Successful login

  ```json
  {
    "token": "JWT Token here"
  }
  ```

- **401 Unauthorized:** Invalid Credentials
  ```json
  {
    "name": "UnauthorizedError",
    "statusCode": 401,
    "isOperational": true,
    "message": "Invalid Credentials"
  }
  ```

### POST `/api/auth/signup`

**Purpose:** Register a new user with an optional profile image upload.

> **Note:** This endpoint uses `multipart/formdata` to handle profile image uploads.

**Request Body:**

- **username** (String): Desired username
- **email** (String): User's email address
- **password** (String): Password
- **confirmPassword** (String): Must match the password
- **profileImage** (File, optional): Profile image (file upload)

**Responses:**

- **201 Created:** Successful signup
  ```json
  {
    "token": "JWT Token here"
  }
  ```
- **400 Bad Request:** Validation errors. The response contains an `errors` array where each error object includes:

  - **type**: Error type
  - **value**: Input value causing the error
  - **msg**: Error message
  - **path**: The field that caused the error
  - **location**: Where the error occurred

  ```json
  {
    "errors": [
      {
        "type": "field",
        "value": "janesmith++",
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

- **409 Conflict:** Username already exists
  ```json
  {
    "name": "ConflictError",
    "statusCode": 409,
    "isOperational": true,
    "message": "Username already exists"
  }
  ```
- **409 Conflict:** Email already exists
  ```json
  {
    "name": "ConflictError",
    "statusCode": 409,
    "isOperational": true,
    "message": "Email already exists"
  }
  ```

## 2. Users

### GET `/api/users` (Protected - Owner Only)

**Purpose:** Retrieve a list of all users.

**Responses:**

- **200 OK:** Successful retrieval of the user list

  ```json
  [
    {
      "id": 1,
      "username": "username1",
      "email": "email1@example.com",
      "role": "USER",
      "createdAt": "2024-09-23T16:46:12.245Z"
    },
    {
      "id": 2,
      "username": "username2",
      "email": "email2@example.com",
      "role": "ADMIN",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
  ```

- **401 Unauthorized:** User not authenticated

  ```text
  Unauthorized
  ```

- **403 Forbidden:** Access denied for non-owner users
  ```json
  {
    "name": "ForbiddenError",
    "statusCode": 403,
    "isOperational": true,
    "message": "You do not have access to this resource (Owner Only)"
  }
  ```

### PUT `/api/users/:id` (Protected)

**Purpose:** Update a user's profile, including optional username and profile image.

**Request Body:**

- **username** (String, optional): New desired username
- **profileImage** (File, optional): Profile image (file upload)

> **Note:** This endpoint uses `multipart/formdata` to handle profile image uploads.

**Responses:**

- **200 OK:** User profile updated successfully

  ```json
  {
    "message": "User profile updated successfully",
    "updated": true
  }
  ```

- **200 OK:** No changes were made to the profile

  ```json
  {
    "message": "No changes made",
    "updated": false
  }
  ```

- **400 Bad Request:** Validation errors. The response contains an `errors` array with error details.

  ```json
  {
    "errors": [
      {
        "type": "field",
        "value": "janesmith++",
        "msg": "Username must contain only letters and numbers",
        "path": "username",
        "location": "body"
      }
    ]
  }
  ```

- **404 Not Found:** User not found

  ```json
  {
    "name": "NotFoundError",
    "statusCode": 404,
    "isOperational": true,
    "message": "User not found"
  }
  ```

- **409 Conflict:** Username already exists
  ```json
  {
    "name": "ConflictError",
    "statusCode": 409,
    "isOperational": true,
    "message": "Username already exists"
  }
  ```

### PUT `/api/users/:id/password` (Protected)

**Purpose:** Update a user's password.

**Request Body:**

- **oldPassword** (String): User's current password
- **newPassword** (String): New password (must be at least 8 characters long)
- **confirmPassword** (String): Must match the new password

**Responses:**

- **200 OK:** Password updated successfully

  ```json
  {
    "message": "Password updated successfully"
  }
  ```

- **400 Bad Request:** Validation errors. The response contains an `errors` array with error details.

  ```json
  {
    "errors": [
      {
        "type": "field",
        "value": "short",
        "msg": "New password must be at least 8 characters long",
        "path": "newPassword",
        "location": "body"
      }
    ]
  }
  ```

- **404 Not Found:** User not found

  ```json
  {
    "name": "NotFoundError",
    "statusCode": 404,
    "isOperational": true,
    "message": "User not found"
  }
  ```

- **401 Unauthorized:** Old password is incorrect
  ```json
  {
    "name": "UnauthorizedError",
    "statusCode": 401,
    "isOperational": true,
    "message": "Old password is incorrect"
  }
  ```

### PUT `/api/users/:id/role/admin` (Protected - Owner Only)

**Purpose:** Update a user's role to ADMIN.

**Responses:**

- **200 OK:** User role updated successfully
  ```json
  {
    "message": "User role updated successfully"
  }
  ```
- **200 OK:** User is already an admin
  ```json
  {
    "message": "User is already an admin"
  }
  ```
- **404 Not Found:** User not found
  ```json
  {
    "name": "NotFoundError",
    "statusCode": 404,
    "isOperational": true,
    "message": "User not found"
  }
  ```
