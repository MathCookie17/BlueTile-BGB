let __windowZIndex = 1000;
class WindowContainer {
    constructor(title = "Window", closeable = true, options = {}) {
        const {
            width,
            height,
            offsetTop,
            offsetLeft
        } = options;
        this.onMouseDown = null;
        this.beforeClose = null;

        this.container = document.createElement('div');
        this.container.classList.add('window-container');
        // Initial z-index
        this.container.style.zIndex = __windowZIndex++;

        // Bring to front when clicked
        this.container.addEventListener('mousedown', () => {
            if (typeof this.onMouseDown === 'function') {
                this.onMouseDown();
            }
            this.container.style.zIndex = ++__windowZIndex;
        });


        // Optional size
        if (width) this.container.style.width = typeof width === 'number' ? `${width}px` : width;
        if (height) this.container.style.height = typeof height === 'number' ? `${height}px` : height;

        // Optional position
        if (offsetTop !== undefined) this.container.style.top = typeof offsetTop === 'number' ? `${offsetTop}px` : offsetTop;
        if (offsetLeft !== undefined) this.container.style.left = typeof offsetLeft === 'number' ? `${offsetLeft}px` : offsetLeft;

        this.header = document.createElement('div');
        this.header.classList.add('window-header');
        this.header.innerHTML = `<span>${title}</span>`;

        if (closeable) {
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('window-close');
            closeBtn.innerHTML = '✕';
            closeBtn.onclick = () => this.close();
            this.header.appendChild(closeBtn);
        }

        this.content = document.createElement('div');
        this.content.classList.add('window-content');

        this.container.appendChild(this.header);
        this.container.appendChild(this.content);

        // Required positioning
        this.container.style.position = 'absolute';
        document.body.appendChild(this.container);

        this.makeDraggable();
    }

    makeDraggable() {
        let isDragging = false;
        let offsetX, offsetY;

        this.header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - this.container.offsetLeft;
            offsetY = e.clientY - this.container.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            
            const containerWidth = this.container.offsetWidth;
            const containerHeight = this.container.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // Prevent dragging too far up
            if (newTop < 0) newTop = 0;
            
            // Prevent dragging too far down
            if (newTop + 30 > screenHeight) newTop = screenHeight - 30; // still show header
            
            // Prevent dragging more than halfway off left/right
            const maxLeft = screenWidth - containerWidth * 0.5;
            const minLeft = -containerWidth * 0.5;
            if (newLeft < minLeft) newLeft = minLeft;
            if (newLeft > maxLeft) newLeft = maxLeft;
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    setContent(html) {
        this.content.innerHTML = html;
    }

    appendContent(el) {
        this.content.appendChild(el);
    }

    close(){
        if (typeof this.beforeClose === 'function') {
            this.beforeClose();
        }
        this.container.remove()
    }
}
