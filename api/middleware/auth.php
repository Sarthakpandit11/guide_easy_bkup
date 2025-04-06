<?php
require_once __DIR__ . '/../config/database.php';

function verifyToken() {
    global $conn;
    
    try {
        // Get the token from the session
        session_start();
        if (!isset($_SESSION['user_id'])) {
            return null;
        }
        
        // Get user from database
        $stmt = $conn->prepare("SELECT id, full_name, email, role FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return null;
        }
        
        return $user;
    } catch (Exception $e) {
        error_log("Auth error: " . $e->getMessage());
        return null;
    }
}
?> 