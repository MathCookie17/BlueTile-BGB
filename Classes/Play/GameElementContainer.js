class GameElementContainer {
    constructor({
        containerWidth,
        containerHeight,
        containerTop,
        containerLeft,
        borderColor,
        borderWidth,
        backgroundColor,
        enableZoom = true,
        enableScrollbars = true
    }) {
        this.enableZoom = enableZoom;
        this.enableScrollbars = enableScrollbars;

        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.width = `${containerWidth}%`;
        this.container.style.height = `${containerHeight}%`;
        this.container.style.top = `${containerTop}%`;
        this.container.style.left = `${containerLeft}%`;
        this.container.style.border = `${borderWidth} solid ${borderColor}`;
        this.container.style.backgroundColor = backgroundColor;
        this.container.style.overflow = 'visible';
        this.container.style.boxSizing = 'border-box';

        this.zoomLevel = 1; // start at min
        this.minZoom = 1;
        this.maxZoom = 10;

        this.zoomWrapper = document.createElement('div');
        this.zoomWrapper.style.width = '100%';
        this.zoomWrapper.style.height = '100%';
        this.zoomWrapper.style.overflow = 'hidden';
        this.zoomWrapper.style.position = 'relative';

        this.inner = document.createElement('div');
        this.inner.style.width = '100%';
        this.inner.style.height = '100%';
        this.inner.style.overflow = 'scroll';
        this.inner.style.position = 'relative';
        this.inner.style.boxSizing = 'border-box';

        this.zoomedContent = document.createElement('div');
        this.zoomedContent.style.width = '100%';
        this.zoomedContent.style.height = '100%';
        this.zoomedContent.style.position = 'relative';
        this.zoomedContent.style.transformOrigin = 'top left';
        this.zoomedContent.style.transform = `scale(${this.zoomLevel})`;

        this.inner.appendChild(this.zoomedContent);
        this.zoomWrapper.appendChild(this.inner);
        this.container.appendChild(this.zoomWrapper);

        this.scrollX = 0;
        this.scrollY = 0;

        if (this.enableZoom) {
            this.zoomWrapper.addEventListener('wheel', (e) => {
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.05 : 0.05;
                    const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
                    this.setZoom(newZoom);
                    this.updateScrollbars();
                }
            }, { passive: false });
        }

        if (this.enableScrollbars) {
            this.buildScrollbars();
        }

        if (containerWidth >= 0 && containerHeight >= 0) document.body.appendChild(this.container);
    }

    buildScrollbars() {
        // Horizontal scrollbar
        this.hScroll = document.createElement('input');
        this.hScroll.type = 'range';
        this.hScroll.min = 0;
        this.hScroll.max = 100;
        this.hScroll.step = 0.1;
        this.hScroll.value = 0;
        this.hScroll.style.position = 'absolute';
        this.hScroll.style.left = '0px';
        this.hScroll.style.bottom = '-25px';
        this.hScroll.style.width = '100%';
        this.hScroll.style.zIndex = 10;
        this.hScroll.style.background = '#ccc';

        this.hScroll.addEventListener('input', () => {
            this.scrollX = parseFloat(this.hScroll.value);
            this.applyScroll();
        });

        // Vertical scrollbar
        this.vScroll = document.createElement('input');
        this.vScroll.type = 'range';
        this.vScroll.min = 0;
        this.vScroll.max = 100;
        this.vScroll.step = 0.1;
        this.vScroll.value = 0;
        this.vScroll.style.writingMode = 'vertical-lr';
        this.vScroll.style.direction = 'ltr';
        this.vScroll.style.appearance = 'slider-vertical';
        this.vScroll.style.verticalAlign = 'bottom';
        this.vScroll.style.orient = 'vertical';
        this.vScroll.style.position = 'absolute';
        this.vScroll.style.right = '-25px';
        this.vScroll.style.top = '0px';
        this.vScroll.style.height = '100%';
        this.vScroll.style.zIndex = 10;
        this.vScroll.style.background = '#ccc';

        this.vScroll.addEventListener('input', () => {
            this.scrollY = parseFloat(this.vScroll.value);
            this.applyScroll();
        });
        const bounds = this.inner.getBoundingClientRect();
        const zoomedWidth = this.zoomedContent.scrollWidth * this.zoomLevel;
        const zoomedHeight = this.zoomedContent.scrollHeight * this.zoomLevel;
        console.log(zoomedWidth, bounds.width + 15)
        this.hScroll.style.display = this.vScroll.style.display =  (zoomedWidth <= bounds.width+15 || zoomedHeight <= bounds.height+15) ?  'none' : 'block';

        this.container.appendChild(this.hScroll);
        this.container.appendChild(this.vScroll);
    }

    applyScroll() {
        const bounds = this.inner.getBoundingClientRect();
        const zoomedWidth = this.zoomedContent.scrollWidth * this.zoomLevel;
        const zoomedHeight = this.zoomedContent.scrollHeight * this.zoomLevel;

        const xMax = Math.max(0, zoomedWidth - bounds.width);
        const yMax = Math.max(0, zoomedHeight - bounds.height);

        const xOffset = -(this.scrollX / 100) * xMax;
        const yOffset = -(this.scrollY / 100) * yMax;

        this.zoomedContent.style.transform = `scale(${this.zoomLevel}) translate(${xOffset / this.zoomLevel}px, ${yOffset / this.zoomLevel}px)`;
    }

    updateScrollbars() {
        if (!this.enableScrollbars) return;

        const bounds = this.inner.getBoundingClientRect();
        const zoomedWidth = this.zoomedContent.scrollWidth * this.zoomLevel;
        const zoomedHeight = this.zoomedContent.scrollHeight * this.zoomLevel;

        // Show scrollbars only if content overflows
        this.hScroll.style.display = this.vScroll.style.display =  (zoomedWidth <= bounds.width+15 || zoomedHeight <= bounds.height+15) ?  'none' : 'block';

        // Reapply scroll transform to ensure accuracy
        this.applyScroll();
    }

    setZoom(value) {
        this.zoomLevel = parseFloat(value);
        this.updateScrollbars();
    }

    addContent(el) {
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';
        el.style.height = '100%';
        this.zoomedContent.appendChild(el);
        this.updateScrollbars();
    }

    getElement() {
        return this.container;
    }
}
