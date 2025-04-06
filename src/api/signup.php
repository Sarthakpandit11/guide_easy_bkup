<?php
require_once 'config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['error' => 'Method not allowed'], 405);
}

// Get JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate required fields
if (!isset($data['fullName']) || !isset($data['email']) || !isset($data['password']) || 
    !isset($data['phoneNumber']) || !isset($data['role'])) {
    send_json_response(['error' => 'All fields are required'], 400);
}

// Sanitize input
$full_name = sanitize_input($data['fullName']);
$email = sanitize_input($data['email']);
$password = $data['password']; // Don't sanitize password as it will be hashed
$phone_number = sanitize_input($data['phoneNumber']);
$role = sanitize_input($data['role']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json_response(['error' => 'Invalid email format'], 400);
}

// Validate password strength
if (strlen($password) < 8) {
    send_json_response(['error' => 'Password must be at least 8 characters long'], 400);
}

// Validate phone number
if (!preg_match('/^\+?[\d\s-]{10,}$/', $phone_number)) {
    send_json_response(['error' => 'Invalid phone number format'], 400);
}

try {
    // Check if user already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        send_json_response(['error' => 'Database error'], 500);
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        send_json_response(['error' => 'Email already registered'], 400);
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        send_json_response(['error' => 'Database error'], 500);
    }
    
    $stmt->bind_param("sssss", $full_name, $email, $hashed_password, $phone_number, $role);

    if ($stmt->execute()) {
        // Get the user data without password
        $user_id = $stmt->insert_id;
        
        // Create user object without password
        $user = [
            'id' => $user_id,
            'full_name' => $full_name,
            'email' => $email,
            'phone_number' => $phone_number,
            'role' => $role
        ];
        
        send_json_response([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    } else {
        error_log("Execute failed: " . $stmt->error);
        send_json_response(['error' => 'Failed to register user'], 500);
    }
} catch (Exception $e) {
    error_log("Signup error: " . $e->getMessage());
    send_json_response(['error' => 'An error occurred during signup'], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?> 