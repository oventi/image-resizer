<?php

class ImageResizer {
    public function save($folder) {
        $file_name = $_POST['ir_name'];
        $parts = explode(';base64,', $_POST['ir_data']);
        $image_data = $parts[1];
        
        file_put_contents($folder . '/' . $file_name, base64_decode($image_data));
        
        echo json_encode(true);
        exit;
    }
}

if(isset($_POST['ir_name']) && isset($_POST['ir_data']) && isset($_POST['ir_folder'])) {
    $ir = new ImageResizer();
    $ir->save($_POST['ir_folder']);
}
