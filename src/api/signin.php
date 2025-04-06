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
if (!isset($data['email']) || !isset($data['password'])) {
    send_json_response(['error' => 'Email and password are required'], 400);
}

// Sanitize input
$email = sanitize_input($data['email']);
$password = $data['password']; // Don't sanitize password as it will be verified

try {
    // Find user by email
    $stmt = $conn->prepare("SELECT id, full_name, email, password, phone_number, role FROM users WHERE email = ?");
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        send_json_response(['error' => 'Database error'], 500);
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        send_json_response(['error' => 'Invalid credentials'], 401);
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (!password_verify($password, $user['password'])) {
        send_json_response(['error' => 'Invalid credentials'], 401);
    }

    // Remove password from user object
    unset($user['password']);

    // Send user data
    send_json_response(['user' => $user]);
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    send_json_response(['error' => 'An error occurred during login'], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?> 