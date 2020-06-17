class Signature {

  /**
   * 
   * @param { String } id          容器ID
   * @param { Number } height      画布高度
   * @param { String } background  画布背景
   * @param { Boolean } resetBtn   重签按钮
   * @param { Number } lineWidth   线条粗细
   * @param { String } lineColor   线条颜色
   */
  constructor ({ 
    id, 
    height = 200,
    background = 'rgba(248, 248, 248, 1)',
    resetBtn = true,
    lineWidth = 1,
    lineColor = '#000000'
  }) {

    // options
    this.background = background;
    this.height = height;
    this.container = document.getElementById(id);
    this.container.style = 'position: relative';
    this.mouseDown = false;

    this.strokeRecord = [];
    this.onceRecord = [];

    // 创建/设置 画布
    this.canvas = document.createElement('canvas');
    this.adapt();

    if (resetBtn) this.addResetBtn();

    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.setLineStyle(lineWidth, lineColor);
    this.initBg();

    this.mobileTouchEvent();
    this.pcMouseEvent();

    window.addEventListener('resize', e => {
      let pastImg = this.getImage();
      this.adapt();
      this.canvasChange(pastImg);
    });
  }

  setLineStyle (width, color) {
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = 'round';
  }

  initBg () {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // 自适应宽度
  adapt () {
    this.width = this.container.clientWidth;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  mobileTouchEvent () {

    this.canvas.addEventListener('touchstart', e => {

      this.ctx.beginPath();
      let { x, y } = this.getCoordinate(e);
      this.ctx.moveTo(x, y);
      this.recordOnce({x, y});
    });

    this.canvas.addEventListener('touchmove', e => {
      
      e.preventDefault();
      let { x, y } = this.getCoordinate(e);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.recordOnce({x, y});
    });

    this.canvas.addEventListener('touchend', e => {
      this.ctx.closePath();
      this.recordStroke();
    });
  }

  pcMouseEvent () {
    this.canvas.addEventListener('mousedown', e => {
      this.mouseDown = true;

      this.ctx.beginPath();
      let { x, y } = this.getCoordinate(e);
      this.ctx.moveTo(x, y);
      this.recordOnce({x, y});
    });

    this.canvas.addEventListener('mousemove', e => {
      if (!this.mouseDown) return;
      let { x, y } = this.getCoordinate(e);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.recordOnce({x, y});
    });

    this.canvas.addEventListener('mouseup', e => {
      this.mouseDown = false;
      this.ctx.closePath();
      this.recordStroke();
    });

    this.canvas.addEventListener('mouseover', e => {
      this.mouseDown = false;
      this.ctx.closePath();
      this.recordStroke();
    })
  }

  // 记录笔画
  recordOnce (point) {
    this.onceRecord.push(point);
  };

  // 记录总笔画
  recordStroke () {
    this.strokeRecord.push(this.onceRecord);
    this.onceRecord = [];
  }

  // 还原笔画
  reductionStroke () {
    this.strokeRecord.forEach(item => {
      if (item.length > 0) {
        this.ctx.beginPath();
        item.forEach(point => this.ctx.lineTo(point.x, point.y));
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  // 获取坐标
  getCoordinate (e) {
    let touch = e.targetTouches ? e.targetTouches[0] : e;
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    let x = touch.pageX - this.container.offsetLeft;
    let y = touch.pageY - this.container.offsetTop + scrollTop;
    return { x, y };
  }

  addResetBtn () {
    let span = document.createElement('span');
    span.innerHTML = '重签';
    span.style = 'position: absolute; color: #0071CE; right: 15px; bottom: 15px; font-size: 14px; cursor: pointer;'
    this.container.appendChild(span);
    span.addEventListener('click', e => this.cleanStroke());
  }

  canvasChange (pastImg) {
    let _img = new Image();
    _img.src = pastImg;
    _img.width = this.width;
    _img.height = this.height;
    _img.onload = () => this.ctx.drawImage(_img, 0, 0, this.width, this.height);
  }

  cleanStroke () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.initBg();
    this.strokeRecord = [];
  }

  // 画布截屏图片
  getImage () {
    var MIME_TYPE = "image/png";
    var imgURL = this.canvas.toDataURL(MIME_TYPE);
    return imgURL;
  }
}

export default Signature;