const _config = {
  width: 800,
  height: 200,
  gap: 2,
  sliceCount: 100,
  heightScale: 0.4,
  color: '#555',
}

class LinearWave {
  constructor(options) {
    // handle options
    this.analyser = options.analyser
    this.data = options.data
    this.canvas = options.canvas
    this.gap = options.gap || _config.gap
    this.sliceCount = options.sliceCount || _config.sliceCount
    this.heightScale = options.heightScale || _config.heightScale
    this.color = options.color || _config.color

    this.canvas.width = options.width || _config.width
    this.canvas.height = options.height || _config.height
    this.ctx = this.canvas.getContext('2d')
    // fill as much bars as canvas width
    this.widthPerSlice = this.canvas.width / this.sliceCount
  }

  draw() {
    // auto repaint canvas on change
    requestAnimationFrame(() => this.draw())
    // populate the data array with the frequency data
    this.analyser.getByteFrequencyData(this.data)
    this.ctx.fillStyle = 'rgb(255,255,255)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.beginPath()
    for (var i = 0; i < this.sliceCount; i++) {
      const barHeight = this.data[i] * this.heightScale
      this.ctx.fillStyle = this.color
      this.ctx.fillRect(this.widthPerSlice * i, this.canvas.height - barHeight, this.widthPerSlice - this.gap, barHeight)
    }
  }
}

export default LinearWave
