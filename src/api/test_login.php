<?php
// Include the config file for database connection
require_once 'config.php';

// Set headers for JSON response
header("Content-Type: application/json");

// Function to test login with a specific user
function test_login($email, $password) {
    global $conn;
    
    // Find user by email
    $stmt = $conn->prepare("SELECT id, full_name, email, password, phone_number, role FROM users WHERE email = ?");
    if (!$stmt) {
        return [
            'success' => false,
            'message' => "Prepare failed: " . $conn->error
        ];
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return [
            'success' => false,
            'message' => "No user found with email: " . $email
        ];
    }

    $user = $result->fetch_assoc();
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        return [
            'success' => false,
            'message' => "Password verification failed for user: " . $email
        ];
    }

    // Format user data
    $formattedUser = [
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'first_name' => explode(' ', $user['full_name'])[0],
        'last_name' => implode('', array_slice(explode(' ', $user['full_name']), 1)),
        'phone_number' => $user['phone_number']
    ];
    
    return [
        'success' => true,
        'message' => "Login successful for user: " . $email,
        'user' => $formattedUser
    ];
}

// Test login with admin user
$adminEmail = "sarthakpunit@gmail.com";
$adminPassword = "password123"; // Replace with the actual password

$adminResult = test_login($adminEmail, $adminPassword);

// Test login with guide user
$guideEmail = "tejaswijunwar@gmail.com";
$guidePassword = "password123"; // Replace with the actual password

$guideResult = test_login($guideEmail, $guidePassword);

// Test login with tourist user
$touristEmail = "sarthakpandit@gmail.com";
$touristPassword = "password123"; // Replace with the actual password

$touristResult = test_login($touristEmail, $touristPassword);

// Output the results
$results = [
    'admin_login' => $adminResult,
    'guide_login' => $guideResult,
    'tourist_login' => $touristResult
];

echo json_encode($results, JSON_PRETTY_PRINT);

// Close the database connection
$conn->close();
?> 