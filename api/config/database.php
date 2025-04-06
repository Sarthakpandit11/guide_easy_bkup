<?php
// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'mydatabase';

// Error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Create database connection
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Log the error but don't expose it to the client
    error_log("Connection failed: " . $e->getMessage());
    // Return a generic error response
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
?> 