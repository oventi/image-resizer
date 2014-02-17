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

var oventi = oventi || {};

oventi.ImageResizer = {
    Resized: function(data) {
        this.save_path = ".";
        this.post_url = "./image-resizer.php";
        
        this.get_url = function () {
            return data.canvas.toDataURL(data.file.type, 1.0);
        }
        
        this.save = function (save_done) {
            var post_data = {
                file_name: data.file.name,
                data: this.get_url(),
                save_path: this.save_path
            };
            
            $.post(this.post_url, post_data, function (response) {
                save_done(response);
            }, 'json');
        }
    },
    
    Resizer: function () {
        this.resize_save_path = "../image-resizer.php";
        this.save_folder = "result";
        this.resize_factor = 0;
        this.canvas = null;

        var self = this;
        var steps = [0.5, 0.25, 0.125];
        
        var resize_image = function (loop, count, factor, when_done) {
            var w = self.image.width;
            var h = self.image.height;

            w = w * factor; h = h * factor;

            var canvas = document.createElement("canvas");
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            self.canvas = canvas;
            
            var context = canvas.getContext("2d");
            context.drawImage(self.image, 0, 0, w, h);
            
            if(count == 1) {
                return null;
            }
            
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
                if(steps[p] < self.resize_factor) break;
                loop_count++;
            }

            var remaining = self.resize_factor / steps[loop_count-1];
            
            if(loop_count > 1) {
                resize_image(1, loop_count, 0.5, function () {
                    if(remaining < 1) {
                        resize_image(1, 1, remaining, null);
                        final_step();
                    }
                    else { final_step(); }
                });
            }
            else {
                resize_image(1, 1, 0.5, null);
                final_step();
            }            
        }
        
        this.resize = function (file, resize_factor, resize_done) {
            self.resize_factor = resize_factor;
            
            var fr = new FileReader();
            fr.onload = function (e) {
                self.data_url = e.target.result;

                var image = new Image();
                image.onload = function () {
                    self.image = this;
                    if(self.resize_factor > 1) {
                        self.resize_factor = self.resize_factor / self.image.width;
                    }
                    
                    start_resizing(function (canvas) {
                        var data = { file: file, canvas: self.canvas };
                        var resized = new oventi.ImageResizer.Resized(data);
                        resize_done(resized);
                    });
                }
                image.src = self.data_url;
            }
            fr.readAsDataURL(file);
        }
    }
};
