const _config = {
  width: 300,
  height: 300,
  gap: 1,
  sliceCount: 50,
  radiusScale: 0.005,
  centerRadius: 32,
  radius: 1,
  distance: 3,
  rows: 8,
  color: 'rainbow',
}

class DotWave {
  constructor(options) {
    this.analyser = options.analyser
    this.data = options.data
    this.canvas = options.canvas
    this.gap = options.gap || _config.gap
    this.sliceCount = options.sliceCount || _config.sliceCount
    this.radiusScale = options.radiusScale || _config.radiusScale
    this.color = options.color || _config.color
    this.centerRadius = options.centerRadius || _config.centerRadius
    this.radius = options.radius || _config.radius
    this.distance = options.distance || _config.distance
    this.rows = options.rows || _config.rows

    this.canvas.width = options.width || _config.width
    this.canvas.height = options.height || _config.height
    this.ctx = this.canvas.getContext('2d')
    // evenly distribute dots to each slice
    this.proportion = 360 / this.sliceCount

    this.circles = []
    for (let slice = 0; slice < this.sliceCount; slice++) {
      const sectionAngle = 2 * Math.PI / this.sliceCount
      const radians = sectionAngle * (slice + 1)
      this.circles[slice] = []
      let distance = 0
      for (let row = 0; row < this.rows; row++) {
        let radius
        if (row === 0) {
          radius = this.centerRadius
        } else {
          // increase radius as row increases
          radius = distance + this.distance*(0.8+ 0.8 * row)
        }
        const offsetX = this.canvas.width / 2
        const offsetY = this.canvas.height / 2
        const x = offsetX + radius * Math.cos(radians)
        const y = offsetY + radius * Math.sin(radians)
        this.circles[slice].push({ x, y })
        distance = radius
      }
    }
  }

  draw() {
    setTimeout(() => {
      requestAnimationFrame(() => this.draw())
    }, 30)
    this.analyser.getByteFrequencyData(this.data)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.beginPath()
    for (let i = 0; i < this.sliceCount; i++) {
      const dotRaidus = this.data[i] * this.radiusScale
      for (let j = 0; j < this.rows; j++) {
        const hue = i * this.proportion
        const color = this.color === 'rainbow' ? 'hsl(' + hue + ',80%,60%)' : this.color
        // increase radius as row increases
        this.drawPieSlice(this.ctx, this.circles[i][j].x, this.circles[i][j].y, dotRaidus * (1.2 + 120 * this.radiusScale * j), 0, 2 * Math.PI, color)
      }
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

export default DotWave
