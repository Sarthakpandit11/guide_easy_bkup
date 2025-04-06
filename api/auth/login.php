<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../middleware/auth.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$email = $input['email'];
$password = $input['password'];

try {
    // Find user by email
    $stmt = $conn->prepare("SELECT id, full_name, email, password, phone_number, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
    
    // Start session and store user ID
    session_start();
    $_SESSION['user_id'] = $user['id'];
    
    // Format user data for response
    $nameParts = explode(' ', $user['full_name'], 2);
    $firstName = $nameParts[0];
    $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
    
    $formattedUser = [
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => strtolower($user['role']),
        'first_name' => $firstName,
        'last_name' => $lastName,
        'phone_number' => $user['phone_number'],
        'created_at' => date('c'),
        'updated_at' => date('c')
    ];
    
    // Return user data
    echo json_encode(['user' => $formattedUser]);
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?> 