function ShineImg(img) {
    if (!img.complete) {
        img.onload = function () {
            new ShineImg(img);
        };
        return;
    }

    var imgWidth = img.naturalWidth;
    var imgHeight = img.naturalHeight;
    var displayHeight = 150;
    var displayWidth = (imgWidth / imgHeight) * displayHeight - 2;
    
    this.imgToCanvas = function (img) {
        this.canvas = document.createElement('canvas');

        this.canvas.height = displayHeight;
        this.canvas.width = displayWidth;

        if (img.className != '') {
            this.canvas.className = img.className;
        }

        this.context = this.canvas.getContext('2d');
        this.image = img;

        this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translateX(-50%)';
        
        img.parentNode.replaceChild(this.canvas, img);
    }

    this.imgToCanvas(img);

    this.placeGradient = function (x) {
        this.context.save();
        
        var gradient = this.context.createLinearGradient(x, 0, x + 60, 0);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        this.context.fillStyle = gradient;
        this.context.globalCompositeOperation = 'source-atop';
        this.context.fillRect(x, 0, 60, this.canvas.height);
        
        this.context.restore();
    }

    var x = this.canvas.width + 60;
    var self = this;
    var animationSpeed = 2;
    var frameInterval = 10;
    var pauseBetweenAnimations = 2000;

    this.animateGradient = function () {
        if (self.animation) {
            clearInterval(self.animation);
        }
        
        x = self.canvas.width + 60;
        
        self.animation = setInterval(function () {
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.context.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
            
            self.placeGradient(x);
            
            x -= animationSpeed;
            
            if (x < -60) {
                clearInterval(self.animation);
                self.animation = null;
                
                setTimeout(function () {
                    self.animateGradient();
                }, pauseBetweenAnimations);
            }
        }, frameInterval);
    }

    setTimeout(function () {
        self.animateGradient();
    }, 1000);

    window.addEventListener('blur', function () {
        if (self.animation) {
            clearInterval(self.animation);
            self.animation = null;
        }
    }, false);

    window.addEventListener('focus', function () {
        if (!self.animation) {
            self.animateGradient();
        }
    }, false);

    return this;
}

window.onload = function() {
    ShineImg(document.getElementById('shine'));
};