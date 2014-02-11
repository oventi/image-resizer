<?php

$file_name = $_POST['name'];
$parts = explode(';base64,', $_POST['data']);
$image_data = $parts[1];

file_put_contents('result/' . $file_name, base64_decode($image_data));

echo json_encode(true);
exit;
