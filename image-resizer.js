function ImageResizer(file, factor) {
    this.resize_save_path = "../image-resizer.php";
    this.save_folder = "result";
    
    var self = this;
    self.file = file;
    var steps = [0.5, 0.25, 0.125];
    resize_factor = 0;
    
    if(factor < 1) {
        resize_factor = factor;
    }
    
    var resize_image = function (loop, count, factor, when_done) {
        var w = self.image.width;
        var h = self.image.height;

        w = w * factor; h = h * factor;

        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);

        var context = canvas.getContext("2d");
        context.drawImage(self.image, 0, 0, w, h);

        var new_image = new Image();
        new_image.onload = function () {
            self.image = new_image;

            if(loop < count) {
                resize_image(loop+1, count, factor, when_done);
            }
            else {
                when_done();
            }
        }
        new_image.src = canvas.toDataURL("image/jpeg", 1.0);
    }

    var start_resizing = function (final_step) {
        var loop_count = 0;
        for(var p in steps) {
            if(steps[p] < resize_factor) break;
            loop_count++;
        }
        
        var remaining = resize_factor / steps[loop_count-1];
        
        resize_image(1, loop_count, 0.5, function () {
            if(remaining < 1) {
                resize_image(1, 1, remaining, function () { final_step(); });
            }
            else { final_step(); }
        });
    }
    
    this.resize = function (resize_done) {
        var fr = new FileReader();
        fr.onload = function (e) {
            self.data_url = e.target.result;
            
            var image = new Image();
            image.onload = function () {
                self.image = this;
                if(factor > 1) {
                    resize_factor = factor / self.image.width;
                }
                
                start_resizing(function () {
                    resize_done(self.image.src);
                });
            }
            image.src = self.data_url;
        }
        fr.readAsDataURL(self.file);
    }
    
    this.resize_post = function (url, resize_done) {
        this.resize(function () {
            $.post(url, {name: self.file.name, data: self.image.src}, function (response) {
                resize_done(response);
            }, 'json');
        });
    }
    
    this.resize_save = function (resize_done) {
        this.resize(function () {
            var data = {ir_name: self.file.name, ir_data: self.image.src, ir_folder: self.save_folder};
            $.post(self.resize_save_path, data, function (response) {
                resize_done(response);
            }, 'json');
        });
    }
}
