<?php
// This script generates bcrypt hashed passwords for users
// You can use this to create properly hashed passwords for your database

// Function to generate a hashed password
function generateHashedPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Sample passwords
$passwords = [
    'admin123',
    'guide123',
    'tourist123'
];

// Generate hashed passwords
echo "<h1>Hashed Passwords</h1>";
echo "<p>Use these hashed passwords in your database:</p>";
echo "<ul>";

foreach ($passwords as $password) {
    $hashedPassword = generateHashedPassword($password);
    echo "<li><strong>$password</strong>: $hashedPassword</li>";
}

echo "</ul>";
echo "<p>Note: Each time you run this script, it will generate different hashes for the same password. This is normal and secure.</p>";
echo "<p>You can use these hashes in your SQL script or directly in your database.</p>";
?> 