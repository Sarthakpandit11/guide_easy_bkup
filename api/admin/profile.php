<?php
header('Content-Type: application/json');
require_once '../config/database.php';

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Get user ID from query parameter
$user_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($method === 'GET') {
        // Fetch user profile
        $stmt = $db->prepare("SELECT id, full_name, email, phone_number, role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }

        echo json_encode(['user' => $user]);
    } 
    elseif ($method === 'PUT') {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request data']);
            exit;
        }

        // Validate required fields
        $required_fields = ['full_name', 'email', 'phone_number'];
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }

        // Update user profile
        $stmt = $db->prepare("
            UPDATE users 
            SET full_name = ?, email = ?, phone_number = ?
            WHERE id = ?
        ");
        
        $stmt->execute([
            $data['full_name'],
            $data['email'],
            $data['phone_number'],
            $user_id
        ]);

        // Fetch updated user data
        $stmt = $db->prepare("SELECT id, full_name, email, phone_number, role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?> 