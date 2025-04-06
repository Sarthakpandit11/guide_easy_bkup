<?php
require_once 'config.php';

// Function to check database connection
function check_database_connection() {
    global $conn;
    
    if ($conn->ping()) {
        return true;
    } else {
        return false;
    }
}

// Check database connection
$db_connected = check_database_connection();

// Prepare response
$response = [
    'status' => 'ok',
    'database' => $db_connected ? 'connected' : 'disconnected',
    'timestamp' => date('Y-m-d H:i:s')
];

// Send response
send_json_response($response);

// Close connection
$conn->close();
?> 