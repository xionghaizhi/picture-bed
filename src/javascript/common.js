var dataManager = {
  dirname: null,
  cache: null,
  init () {
    if (window.customCache) {
      this.cache = window.customCache

      this.dirname = this.cache.getDirname()
      if (!this.dirname) return

      let index = this.dirname.lastIndexOf('\\plugins')
      if (index > -1) {
        // 在以插件状态运行
        this.dirname = this.dirname.substr(0, index + 1) + 'Cache\\filebed_cache\\'
      } else if (this.dirname.lastIndexOf('.') > -1) {
        // 在以奇奇怪怪的状态运行
        this.dirname = this.dirname.substr(0, this.dirname.lastIndexOf('\\') + 1) + 'filebed_cache\\'
      } else {
        // 在开发环境运行
        this.dirname += '\\filebed_cache\\'
      }
      // 创建缓存目录
      this.cache.mkdirSync(this.dirname)
    }
  },
  /**
   * 设置缓存数据
   * @param {string} key
   * @param {string} data
   */
  setData (key, data) {
    if (this.dirname) {
      this.cache.writeFileSync(this.dirname + key + '.data', data)
    } else {
      localStorage.setItem(key, data)
    }
  },
  /**
   * 返回缓存数据
   * @param {string} key
   * @param {string} isToJson
   */
  getData (key, isToJson) {
    isToJson = isToJson || false
    var data = ''

    if (this.dirname) {
      data = this.cache.readFileSync(this.dirname + key + '.data')
    } else {
      data = localStorage.getItem(key)
    }

    try {
      if (isToJson) { data = JSON.parse(data) }
    } catch (error) {
      data = null
    }
    return data
  },
  clearData () {
    if (this.dirname) {
      this.cache.clear(this.dirname)
    } else {
      localStorage.clear()
    }
  }
}

export default dataManager
