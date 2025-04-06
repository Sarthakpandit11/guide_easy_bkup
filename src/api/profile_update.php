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
if (!isset($data['full_name']) || !isset($data['email']) || !isset($data['phone_number'])) {
    send_json_response(['error' => 'All fields are required'], 400);
}

// Sanitize input
$full_name = sanitize_input($data['full_name']);
$email = sanitize_input($data['email']);
$phone_number = sanitize_input($data['phone_number']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json_response(['error' => 'Invalid email format'], 400);
}

// Validate phone number
if (!preg_match('/^\+?[\d\s-]{10,}$/', $phone_number)) {
    send_json_response(['error' => 'Invalid phone number format'], 400);
}

// Check if email is already taken by another user
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND email != ?");
$stmt->bind_param("ss", $email, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    send_json_response(['error' => 'Email already taken by another user'], 400);
}

// Update user profile
$stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE email = ?");
$stmt->bind_param("ssss", $full_name, $email, $phone_number, $email);

if ($stmt->execute()) {
    send_json_response([
        'message' => 'Profile updated successfully',
        'user' => [
            'full_name' => $full_name,
            'email' => $email,
            'phone_number' => $phone_number
        ]
    ]);
} else {
    send_json_response(['error' => 'Failed to update profile'], 500);
}

$stmt->close();
$conn->close();
?> 