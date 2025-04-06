<?php
// Include the config file for database connection
require_once 'config.php';

// Set headers for JSON response
header("Content-Type: application/json");

// Function to test database connection
function test_database_connection() {
    global $conn;
    
    if ($conn->ping()) {
        return ["status" => "success", "message" => "Database connection successful"];
    } else {
        return ["status" => "error", "message" => "Database connection failed: " . $conn->error];
    }
}

// Function to test users table
function test_users_table() {
    global $conn;
    
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        return [
            "status" => "success", 
            "message" => "Users table exists", 
            "count" => $row['count']
        ];
    } else {
        return ["status" => "error", "message" => "Users table does not exist or query failed: " . $conn->error];
    }
}

// Function to test user roles
function test_user_roles() {
    global $conn;
    
    $result = $conn->query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
    if ($result) {
        $roles = [];
        while ($row = $result->fetch_assoc()) {
            $roles[$row['role']] = $row['count'];
        }
        return [
            "status" => "success", 
            "message" => "User roles retrieved successfully", 
            "roles" => $roles
        ];
    } else {
        return ["status" => "error", "message" => "Failed to retrieve user roles: " . $conn->error];
    }
}

// Function to test sample users
function test_sample_users() {
    global $conn;
    
    $result = $conn->query("SELECT id, email, role FROM users LIMIT 5");
    if ($result) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        return [
            "status" => "success", 
            "message" => "Sample users retrieved successfully", 
            "users" => $users
        ];
    } else {
        return ["status" => "error", "message" => "Failed to retrieve sample users: " . $conn->error];
    }
}

// Run tests
$tests = [
    "database_connection" => test_database_connection(),
    "users_table" => test_users_table(),
    "user_roles" => test_user_roles(),
    "sample_users" => test_sample_users()
];

// Output results
echo json_encode($tests, JSON_PRETTY_PRINT);

// Close connection
$conn->close();
?> 