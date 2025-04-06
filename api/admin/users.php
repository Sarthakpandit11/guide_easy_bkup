<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../middleware/auth.php';

// Verify admin authentication
$user = verifyToken();

if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

try {
    // Get query parameters
    $role = isset($_GET['role']) ? $_GET['role'] : 'all';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'full_name';
    $order = isset($_GET['order']) ? strtoupper($_GET['order']) : 'ASC';
    $search = isset($_GET['search']) ? $_GET['search'] : '';

    // Validate sort field
    $allowedSortFields = ['full_name', 'role', 'phone_number', 'email', 'created_at'];
    if (!in_array($sort, $allowedSortFields)) {
        $sort = 'full_name';
    }

    // Validate order
    if (!in_array($order, ['ASC', 'DESC'])) {
        $order = 'ASC';
    }

    // Calculate offset
    $offset = ($page - 1) * $limit;

    // Build the base query
    $query = "SELECT id, full_name, email, role, phone_number, created_at FROM users WHERE 1=1";
    $countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    $params = [];

    // Add role filter
    if ($role !== 'all') {
        $query .= " AND role = ?";
        $countQuery .= " AND role = ?";
        $params[] = $role;
    }

    // Add search filter
    if (!empty($search)) {
        $query .= " AND (full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)";
        $countQuery .= " AND (full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)";
        $searchParam = "%$search%";
        $params = array_merge($params, [$searchParam, $searchParam, $searchParam]);
    }

    // Add sorting
    $query .= " ORDER BY $sort $order";

    // Add pagination
    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    // Get total count
    $stmt = $conn->prepare($countQuery);
    $stmt->execute(array_slice($params, 0, -2)); // Remove LIMIT and OFFSET params
    $totalResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $total = $totalResult['total'];

    // Get paginated results
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return response
    echo json_encode([
        'users' => $users,
        'total' => $total,
        'page' => $page,
        'limit' => $limit,
        'totalPages' => ceil($total / $limit)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?> 