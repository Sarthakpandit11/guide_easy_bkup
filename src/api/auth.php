<?php
// Include the config file for database connection
require_once 'config.php';

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: http://localhost:*");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Debug log
error_log("Auth request received: " . json_encode($data));

// Validate required fields
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit();
}

$email = sanitize_input($data['email']);
$password = $data['password']; // Don't sanitize password as it will be verified

try {
    // Find user by email
    $stmt = $conn->prepare("SELECT id, full_name, email, password, phone_number, role FROM users WHERE email = ?");
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
        exit();
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        error_log("No user found with email: " . $email);
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit();
    }

    $user = $result->fetch_assoc();
    error_log("User found: " . json_encode($user));

    // Verify password
    if (!password_verify($password, $user['password'])) {
        error_log("Password verification failed for user: " . $email);
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit();
    }

    // Ensure role is properly set
    if (empty($user['role'])) {
        error_log("User role is empty for user: " . $email);
        http_response_code(500);
        echo json_encode(['error' => 'User role not found']);
        exit();
    }

    // Format user data
    $formattedUser = [
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => ucfirst(strtolower($user['role'])),
        'first_name' => explode(' ', $user['full_name'])[0],
        'last_name' => implode(' ', array_slice(explode(' ', $user['full_name']), 1)),
        'phone_number' => $user['phone_number']
    ];
    
    error_log("Formatted user data: " . json_encode($formattedUser));
    error_log("User role: " . $formattedUser['role']);
    
    // Return user data
    echo json_encode(['user' => $formattedUser]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred during login']);
}

// Helper function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Close the database connection
$conn->close();
?> 