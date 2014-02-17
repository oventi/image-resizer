<?php

/*
This file is part of image-resizer.

image-resizer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

image-resizer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with image-resizer.  If not, see <http://www.gnu.org/licenses/>.
*/

error_reporting(0);

$file_name = $_POST['file_name'];
$save_path = $_POST['save_path'];
$parts = explode(';base64,', $_POST['data']);
$image_data = $parts[1];
$response = array();

if(file_put_contents($save_path . '/' . $file_name, base64_decode($image_data))) {
    $response['ok'] = true;
    $response['file_name'] = $file_name;
}
else {
    $response['ok'] = false;
}

echo json_encode($response);
exit;
