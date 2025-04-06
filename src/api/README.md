# Tourist Management API

This directory contains the backend API for the Tourist Management application.

## Database Setup

1. Import the `database.sql` file to create the `mydatabase` database and the users table.
2. The database should have the following structure:
   - Database name: `mydatabase`
   - Table: `users`
     - Columns: `id`, `full_name`, `email`, `password`, `phone_number`, `role`

## Testing the Database Connection

You can test the database connection by accessing:
```
http://localhost/tourist/project/src/api/test_auth.php
```

This will return a JSON response with information about the database connection, users table, and user roles.

## Migrating from Old Database

If you need to migrate data from an old database, use the `migrate_data.sql` file.

## Password Generation

To generate a password hash for a user, use the `generate_password.php` script:
```
http://localhost/tourist/project/src/api/generate_password.php?password=your_password
```

## Authentication Endpoint

The `auth.php` file handles user login and returns user data, including the role.

### Request Format

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Format

```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "role": "Admin",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "1234567890"
  }
}
```

## Testing the Authentication

1. Use the test script to verify the authentication system:
   ```
   http://localhost/tourist/project/src/api/test_login.php
   ```

2. Check the browser console for debug logs to see what's happening during the authentication process.

3. If you're having issues with role-based redirection, check the following:
   - The user's role is correctly returned from the backend
   - The role is correctly stored in localStorage
   - The `getDashboardPath` function is correctly handling the role
   - The route protection is correctly implemented

## Troubleshooting

If you're having issues with the authentication system, check the following:

1. Database Connection:
   - Make sure the database credentials in `config.php` are correct
   - Make sure the database and tables exist

2. User Authentication:
   - Make sure the user exists in the database
   - Make sure the password is correct
   - Make sure the user has a role assigned

3. Role-Based Redirection:
   - Make sure the role is correctly returned from the backend
   - Make sure the role is correctly stored in localStorage
   - Make sure the `getDashboardPath` function is correctly handling the role
   - Make sure the route protection is correctly implemented

4. CORS Issues:
   - Make sure the CORS headers are correctly set in `config.php`
   - Make sure the frontend is making requests to the correct URL

## Security Notes

- Passwords are hashed using bcrypt
- CORS is configured to allow requests from the React frontend
- Input is sanitized to prevent SQL injection 