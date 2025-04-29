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

function createBubbleEffect(container) {
    const numBubbles = 30;
    
    for (let i = 0; i < numBubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = 2 + Math.random() * 4;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `${10 + Math.random() * 30}%`;
        const duration = 2 + Math.random() * 4;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(bubble);
    }
}

function continuousBubbles(container) {
    if (container.bubbleTimer) {
        clearInterval(container.bubbleTimer);
    }
    
    createBubbleEffect(container);
    
    container.bubbleTimer = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = 2 + Math.random() * 4;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.bottom = `${10 + Math.random() * 30}%`;
            const duration = 2 + Math.random() * 4;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `0s`;
            
            container.appendChild(bubble);
        }
        
        const allBubbles = container.querySelectorAll('.bubble');
        if (allBubbles.length > 100) {
            for (let i = 0; i < allBubbles.length - 100; i++) {
                if (allBubbles[i]) {
                    allBubbles[i].remove();
                }
            }
        }
    }, 500);
}

window.onload = function() {
    ShineImg(document.getElementById('shine'));
    
    const bottleContainer = document.querySelector('.bottle-container');
    
    bottleContainer.addEventListener('mouseenter', function() {
        continuousBubbles(this);
    });
    
    bottleContainer.addEventListener('mouseleave', function() {
        if (this.bubbleTimer) {
            clearInterval(this.bubbleTimer);
            this.bubbleTimer = null;
        }
    });
};