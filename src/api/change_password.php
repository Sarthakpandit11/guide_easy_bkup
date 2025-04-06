<?php
require_once 'config.php';

// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    send_json_response(['error' => 'Method not allowed'], 405);
}

// Get JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate required fields
if (!isset($data['email']) || !isset($data['currentPassword']) || !isset($data['newPassword'])) {
    send_json_response(['error' => 'All fields are required'], 400);
}

// Sanitize input
$email = sanitize_input($data['email']);
$current_password = $data['currentPassword']; // Don't sanitize passwords
$new_password = $data['newPassword'];

// Validate password strength
if (strlen($new_password) < 8) {
    send_json_response(['error' => 'New password must be at least 8 characters long'], 400);
}

// Get user by email
$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    send_json_response(['error' => 'User not found'], 404);
}

$user = $result->fetch_assoc();

// Verify current password
if (!password_verify($current_password, $user['password'])) {
    send_json_response(['error' => 'Current password is incorrect'], 401);
}

// Hash new password
$hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

// Update password
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $hashed_password, $user['id']);

if ($stmt->execute()) {
    send_json_response(['message' => 'Password updated successfully']);
} else {
    send_json_response(['error' => 'Failed to update password'], 500);
}

$stmt->close();
$conn->close();
?> 