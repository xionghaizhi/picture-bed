<template>
  <div>
    <div class="divider-container">
      <el-divider content-position="left">上传文件</el-divider>
    </div>
    <quote>
      <ul>
        <li class="el-form-item__label">
          单仓库上限为
          <b>500M</b>，单文件最大
          <b>100M</b>，总仓库容量为
          <b>5G</b>
        </li>
        <li class="el-form-item__label">以上是Gitee官方说明，以下是个人建议</li>
        <li class="el-form-item__label">
          不推荐上传
          <b>大文件(10M+)和隐私文件</b>
        </li>
        <li class="el-form-item__label">
          在MD中使用的
          <b>单张图片，不宜超过1M</b>，大部分网站无法显示
        </li>
        <li class="el-form-item__label">
          超过
          <b>1M</b>的图片，本插件无法预览，但链接有效
        </li>
      </ul>
    </quote>
    <el-col :span="12">
      <span class="el-form-item__label">
        时间戳重命名：
        <el-switch v-model="timestamp" @change="changeTimestamp"></el-switch>
        <input v-show="false" disabled :value="fileUrl" id="copy" />
      </span>
    </el-col>
    <el-col :span="12">
      <el-row type="flex" justify="end">
        <el-tooltip placement="top" trigger="hover" content="鸽着，等我API看明白了再加上">
          <span class="el-form-item__label" style="padding:0">
            <el-button
              size="mini"
              disabled
              icon="el-icon-delete"
              type="danger"
              @click="removeFile"
            >清空列表</el-button>
          </span>
        </el-tooltip>
      </el-row>
    </el-col>
    <el-col :span="24">
      <file-pond
        name="sdsdsd"
        ref="pond"
        class-name="my-pond"
        label-idle="选择文件 or 粘贴截图"
        labelFileProcessingComplete="上传成功"
        labelFileProcessing="上传中"
        labelFileProcessingError="上传失败"
        labelTapToRetry="点击重新上传"
        labelTapToCancel="点击取消上传"
        labelTapToUndo="点击关闭"
        allow-multiple="true"
        styleButtonProcessItemPosition="right"
        styleProgressIndicatorPosition="center"
      />
    </el-col>
  </div>
</template>

<script>
import quote from '@/components/quote'
import dataManager from '@/javascript/common.js'
import api from '@/api'
import Clipboard from 'clipboard'

// Import FilePond
import vueFilePond, { setOptions } from 'vue-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// 创建 FilePond 对象
let filePond = vueFilePond(FilePondPluginImagePreview)

dataManager.init()

export default {
  components: { quote, api, filePond, Clipboard, dataManager },
  data () {
    return {
      timestamp: false, // 上传文件时，是否使用时间戳重命名，截图全部使用时间戳重命名
      fileUrl: ''
    }
  },
  props: ['repo', 'folder'],
  methods: {
    /**
     * 修改是否通过时间戳保存
     */
    changeTimestamp (e) {
      this.timestamp = e
      dataManager.setData(this.repo.id + '_timestamp', this.timestamp)
    },
    /**
     * 清空列表文件
     */
    removeFile () {
      // pond.removeFiles(true)
    },

    /**
     * 按格式复制链接
     */
    copyLink () {
      let res = false
      const input = document.createElement('input')
      input.setAttribute('value', this.fileUrl)
      input.setAttribute('readonly', 'readonly')
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        res = true
      }
      document.body.removeChild(input)
      if (res) this.sendMsg('链接复制成功')
      else this.sendMsg('链接复制失败，请于主页面中复制')
    },
    /**
     * 向桌面发送消息
     */
    sendMsg (msg, fun) {
      setTimeout(function () {
        console.log('1：' + Notification.permission)
        // 如果支持window.Notification 并且 许可不是拒绝状态
        if (window.Notification && Notification.permission !== 'denied') {
          // Notification.requestPermission这是一个静态方法，作用就是让浏览器出现是否允许通知的提示
          Notification.requestPermission(function (status) {
            console.log('2: ' + status)
            // 如果状态是同意
            if (status === 'granted') {
              var m = new Notification('utools-filebed消息', {
                body: msg, // 消息体内容
                icon: './src/assets/logo.png' // 消息图片
              })
              m.onclick = fun
            } else {
              alert('当前浏览器不支持弹出消息')
            }
          })
        }
      }, 1000)
    },
    /**
     * 返回当前时间的文本
     */
    getDate () {
      let getLength = (str, len) => {
        str += ''
        while (str.length < len) str = '0' + str
        return str
      }

      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      let millisecond = date.getMilliseconds()

      return (
        `${getLength(year, 4)}${getLength(month, 2)}${getLength(day, 2)}` +
        '-' +
        `${getLength(hour, 2)}${getLength(second, 2)}${getLength(minute, 2)}` +
        '-' +
        `${getLength(millisecond, 4)}`
      )
    }
  },
  mounted () {
    this.timestamp =
      dataManager.getData(this.repo.id + '_timestamp') === 'true'

    // 上传文件的配置
    setOptions({
      server: {
        process: (
          fieldName,
          file,
          metadata,
          load,
          error,
          progress,
          abort,
          transfer,
          options
        ) => {
          // 文件重命名
          let fileName = file.name
          if (this.timestamp === true || fileName === 'image.png') {
            // 获取文件后缀
            let suffix = ''
            let index = fileName.lastIndexOf('.')
            if (index > -1) suffix = fileName.substr(index + 1).toLowerCase()
            fileName = this.getDate() + '.' + suffix
          }

          // 文件base64编码
          let reader = new FileReader()
          let request = new XMLHttpRequest()
          let copyLink = this.copyLink // 复制链接
          let sendMsg = this.sendMsg // 发送消息

          reader.readAsDataURL(file)
          reader.onload = () => {
            let formData = {
              access_token: api.config.token,
              content: reader.result,
              message: 'utools-filebed，新建文件:' + fileName
            }
            // 若没有文件，则返回
            if (reader.result.length === 0) return
            formData.content = formData.content.split(',')[1]
            let filePath = `${this.folder ? this.folder.path : ''}/${fileName}`
            this.fileUrl = `https://gitee.com/${api.config.owner}/${api.config.repo}/raw/master/${filePath}`

            request.open(
              'POST',
              api.getBaseUrl() +
                `/v5/repos/${api.config.owner}/${api.config.repo}/contents/${filePath}`
            )
            request.setRequestHeader('content-type', 'application/json')
            request.upload.onprogress = e => {
              progress(e.lengthComputable, e.loaded, e.total)
            }

            request.onload = function () {
              if (request.status >= 200 && request.status < 300) {
                load(request.responseText)
                // 向系统发送消息
                sendMsg('上传成功，点击复制链接', copyLink)
              } else {
                sendMsg('上传失败')
              }
            }

            request.send(JSON.stringify(formData))
          }
          // Should expose an abort method so the request can be cancelled
          return {
            abort: () => {
              // This function is entered if the user has tapped the cancel button
              request.abort()

              // Let FilePond know the request has been cancelled
              abort()
            }
          }
        }
      }
    })
  }
}
</script>
<style>
@import "filepond/dist/filepond.min.css";
@import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
</style>
