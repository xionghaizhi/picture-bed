<template>
  <div class="markdown">
    <Markdown
      @on-upload-image="uploadImg"
      @on-paste-image="pasteImg"
      @on-save="save"
      @on-ready="ready"/>
  </div>
</template>

<script>
import Markdown from 'vue-meditor'

export default {
  name: 'markdown',
  components: {
    Markdown
  },
  methods: {
    ready (param) {
      console.log(':ready')
      console.log(param)
    },

    save (param) {
      console.log(':save')
      console.log(param)
    },

    pasteImg (param) {
      console.log(':pasteImg')
      console.log(param)

      // 在这里可以监听到剪切板粘贴图片的事件 在这里调用后台接口即可

      // let fileName = param.fileName

      let reqParam = new FormData() // 创建form对象
      reqParam.append('imgFile', param)// 通过append向form对象添加数据

      let config = {

      }

      this.axios.post('', reqParam, config).then(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    }
  }
}
</script>
