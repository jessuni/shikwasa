const _config = {
  width: 200,
  height: 200,
  gap: 1,
  sliceCount: 50,
  heightScale: 0.4,
  centerRadius: 32,
  color: 'rainbow',
}

class CircleWave {
  constructor(options) {
    // handle options
    this.analyser = options.analyser
    this.data = options.data
    this.canvas = options.canvas
    this.gap = options.gap || _config.gap
    this.sliceCount = options.sliceCount || _config.sliceCount
    this.heightScale = options.heightScale || _config.heightScale
    this.color = options.color || _config.color
    this.centerRadius = options.centerRadius || _config.centerRadius

    this.canvas.width = options.width || _config.width
    this.canvas.height = options.height || _config.height
    this.ctx = this.canvas.getContext('2d')
    // fill as much bars as canvas width
    this.widthPerSlice = this.canvas.width / this.sliceCount
  }

  draw() {
    requestAnimationFrame(() => this.draw())
    this.analyser.getByteFrequencyData(this.data)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.beginPath()

    let startAngle = 0
    const sectionAngle = 2 * Math.PI / this.sliceCount
    const gap = 2 * Math.PI / 360 * this.gap
    const colorProportion = Math.floor(360 / this.sliceCount)
    for (var i = 0; i < this.sliceCount; i++) {
      const radius = this.data[i] * this.heightScale
      const color = this.color === 'rainbow' ? 'hsl(' + i * colorProportion + ',80%,60%)' : this.color
      this.drawPieSlice(this.ctx, this.canvas.width / 2, this.canvas.height / 2, radius, startAngle, startAngle + sectionAngle - gap, color)
      startAngle += sectionAngle
    }

    // using composite to subtract a circle from center
    // note that this is not adding a white circle to center
    if (this.centerRadius) {
      this.ctx.globalCompositeOperation = 'destination-out'
      this.ctx.beginPath()
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.centerRadius, 0, 2 * Math.PI, '#fff')
      this.ctx.fill()

      // reset composite
      this.ctx.globalCompositeOperation = 'source-over'
    }
  }

  drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fill()
  }
}

export default CircleWave
