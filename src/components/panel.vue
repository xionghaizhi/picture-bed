<template>
  <el-container class="panel">
    <el-header height="auto">
      <quote :explain="repo===undefined?'暂无数据': repo.description||repo.name"></quote>
    </el-header>
    <el-header height="auto" style="margin:16px 0">
      <el-row>
        <el-col :span="18">
          <el-button size="medium" icon="el-icon-upload2" type="primary" @click="drawer = true">上传</el-button>
          <el-button size="medium" icon="el-icon-download" type="info" v-show="false">下载</el-button>
          <el-button size="medium" icon="el-icon-folder-add" @click="createFolder">新建文件夹</el-button>
          <el-button size="medium" icon="el-icon-delete" type="danger" v-show="false">删除</el-button>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="end">
            <el-radio-group size="medium" v-model="panelConfig.viewType">
              <el-radio-button label="0">列表</el-radio-button>
              <el-tooltip placement="bottom" trigger="hover" content="鸽着，暂时还不想写">
                <el-radio-button label="1" disabled>图标</el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </el-row>
        </el-col>
      </el-row>
    </el-header>

    <el-header height="auto">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:16px">
        <el-breadcrumb-item v-for="(v,i) in nav" :key="i">
          <span v-on:click="v.sha==='/'?null:redirectTree(v.sha)">
            <el-link href="javascript:;" :underline="false" type="primary">{{v.name}}</el-link>
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main>
      <el-table
        v-loading="isRefresh"
        height="380"
        highlight-current-row
        stripe
        :data="tableData"
        style="width: 100%;"
      >
        <el-table-column type="index" width="50" align="right"></el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link v-bind:type="scope.row.media==='folder'?'primary':''">
              <i
                v-bind:class="scope.row|iconFilter"
                v-on:click.stop="getRowClick(scope.row)"
                v-if="scope.row.media!=='image'"
                style="font-size:20px"
              ></i>

              <el-image
                lazy
                scroll-container=".el-table__body-wrapper"
                fit="fill"
                :id="scope.row.sha"
                v-if="scope.row.media==='image'"
                :src="getFileUrl(scope.row)"
                :preview-src-list="srcList"
              >
                <div slot="placeholder">
                  <i
                    class="el-icon-refresh"
                    style="font-size:20px;animation: turn 1s linear infinite;"
                  ></i>
                </div>
                <div slot="error">
                  <i
                    class="el-icon-picture-outline"
                    :id="`err_`+scope.row.sha"
                    style="font-size:20px"
                  ></i>
                </div>
              </el-image>

              <span
                v-on:click.stop="getRowClick(scope.row,true)"
                style="margin-left: 5px"
              >{{ scope.row.name }}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row|sizeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="链接地址" width="275" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.media==='folder'">-</div>
            <div v-show="scope.row.media!=='folder'">
              <el-button
                type="default"
                icon="el-icon-link"
                :data-clipboard-text="scope.row|linkFilter('url',getFileUrl)"
                @click="copyLink(scope.row,'url')"
                size="mini"
                plain
              >URL</el-button>
              <el-button
                type="info"
                icon="el-icon-paperclip"
                :data-clipboard-text="scope.row|linkFilter('html',getFileUrl)"
                @click="copyLink(scope.row,'html')"
                size="mini"
                plain
              >HTML</el-button>
              <el-button
                type="primary"
                icon="el-icon-connection"
                :data-clipboard-text="scope.row|linkFilter('md',getFileUrl)"
                @click="copyLink(scope.row,'md')"
                size="mini"
                plain
              >MD</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" fixed="right" width="100" label="操作" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.media==='folder'">-</div>
            <div v-show="scope.row.media!=='folder'">
              <el-tooltip placement="top" trigger="hover" content="删除">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  @click="deleteSingleFile(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip placement="top" trigger="hover" content="下载">
                <el-button
                  icon="el-icon-download"
                  type="info"
                  circle
                  size="mini"
                  @click="downloadSingleFile(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 刷新 -->
    <el-tooltip placement="left" trigger="hover" content="点击刷新列表">
      <span
        class="el-button el-button--primary el-button--medium is-circle float-ball"
        :class="isRefresh?'':'stop'"
        @mouseup="refresh"
      >
        <i class="el-icon-refresh"></i>
      </span>
    </el-tooltip>
    <!-- 上传文件 -->
    <el-drawer
      title="我是标题"
      size="500px"
      @close="init(repo)"
      :visible.sync="drawer"
      :with-header="false"
    >
      <uploade
        :repo="repo"
        :folder="fileTree.filter(
        c => c.sha === panelConfig.folderSha
      )[0]"
      />
    </el-drawer>
  </el-container>
</template>
<script>
import quote from '@/components/quote'
import api from '@/api'
import dataManager from '@/javascript/common.js'
import uploade from '@/components/uploade'
import Clipboard from 'clipboard'

dataManager.init()

export default {
  components: { quote, api, uploade, Clipboard, dataManager },
  data () {
    return {
      tableData: [],
      panelConfig: {
        folderSha: 'master', // 当前仓库路径sha值
        viewType: 0 // 当前视图类型，0：列表，1：图标
      },
      drawer: false,
      fileTree: [], // 整个仓库的文件列表
      repo: {},
      isRefresh: false,
      srcList: []
    }
  },
  computed: {
    /**
     * 导航数据
     */
    nav () {
      let nav = []
      let fileTree = JSON.parse(JSON.stringify(this.fileTree)) // 在while中，this关键字失效
      let max = 3 // 防止路径太长，只保留向上两个文件夹

      // 获取当前目录数据
      let folder = fileTree.filter(
        c => c.sha === this.panelConfig.folderSha
      )[0]

      // 递归向上寻找
      while (true) {
        if (folder === undefined) break
        if (max === 0) {
          nav.splice(0, 0, {
            sha: '/',
            name: '...'
          })
          break
        }
        let obj = {
          sha: folder.sha
        }
        let index = folder.path.lastIndexOf('/')

        // 当没有上级目录时，退出递归
        if (index === -1) {
          obj.name = folder.path
          index = 0 // 防止在substr中报错
        } else {
          obj.name = folder.path.substr(index + 1)
        }

        // 获取上级目录的对象
        folder = fileTree.filter(
          c => c.path === folder.path.substr(0, index) && c.sha !== obj.sha
        )[0]
        max--
        nav.splice(0, 0, obj)
      }

      nav.splice(0, 0, {
        sha: 'master',
        name: '全部文件'
      })
      return nav
    }
  },
  methods: {
    /**
     * 强制刷新
     */
    refresh (e) {
      // let e = null
      if (e.button === 2) {
        // 右键刷新路由
        // this.$router.go(0)
        this.init(this.repo)
      } else if (e.button === 0) {
        // 左键重新初始化组件
        this.init(this.repo)
      }
    },
    /**
     * 初始化
     */
    init (item) {
      this.isRefresh = true
      this.repo = item
      this.tableData = []
      this.drawer = false
      if (this.repo === undefined) return
      try {
        // 读取缓存配置
        this.panelConfig =
          dataManager.getData(this.repo.id + '_panelConfig', true) ||
          this.panelConfig
        api.config.repo = this.repo.name
      } catch (error) {
        alert(error)
      }
      this.getNewFolderSha(true)
    },
    /**
     * 跳转目录
     * @param {string} sha 目录Tree的SHA值
     * @param {number} recursive 赋值为1递归获取目录
     */
    redirectTree (sha) {
      this.isRefresh = true

      // 获取目录下文件
      api.getV5ReposOwnerRepoGitTreesSha(sha, 0).then(res => {
        if (res === undefined) return
        // 将当前目录缓存下来，下次默认打开
        // 在此保存，是为了刷新sha为默认的'master'的问题
        this.panelConfig.folderSha = res.data.sha
        dataManager.setData(
          this.repo.id + '_panelConfig',
          JSON.stringify(this.panelConfig)
        )
        this.tableData = res.data.tree
        this.srcList = []
        // 依次更新文件信息
        this.tableData.forEach(item => {
          let index = -1

          // 获取文件名称
          index = item.path.indexOf('/')
          if (index === -1) item.name = item.path
          else item.name = item.path.substr(index + 1)

          // 获取文件后缀
          index = item.name.lastIndexOf('.')
          if (item.type === 'tree' || index === -1) item.suffix = 'folder'
          else item.suffix = item.name.substr(index + 1).toLowerCase()

          // 获取图片文件
          let arr = ['jpg', 'jpge', 'gif', 'jfif', 'bmp', 'png', 'ico', 'icon']
          item.media = 'file'
          if (arr.indexOf(item.suffix) > -1) {
            item.media = 'image'

            this.srcList.push(this.getFileUrl(item))
          } else if (item.suffix === 'folder') item.media = 'folder'
          this.isRefresh = false
        })

        // 默认排序，文件夹在前，文件在后，同类型按文件首字母
        this.tableData = this.tableData.sort(function (a, b) {
          if (a.type === b.type) return a.name > b.name
          if (a.type === 'tree' && b.type === 'blob') return -1
          if (a.type === 'blob' && b.type === 'tree') return 1
        })
      })
    },
    /**
     * 更新文件夹内容后，文件夹sha值会改变，应重新获取
     * @param {boolean} isRedirect 是否进行文件夹跳转
     */
    getNewFolderSha (isRedirect) {
      let panel = this
      // 获取仓库所有文件路径
      api
        .getV5ReposOwnerRepoGitTreesSha('master', 1)
        .then(res => {
          // 防止联动修改
          let fileArr = JSON.parse(JSON.stringify(panel.fileTree))

          // 获取当前文件夹的原始信息
          let folder = fileArr.filter(
            c => c.sha === panel.panelConfig.folderSha
          )[0]

          // 更新文件列表
          panel.fileTree = res.data.tree
          let sha = panel.panelConfig.folderSha

          // 当新的文件列表中，没有当前缓存的文件夹sha时，更新
          if (panel.fileTree.filter(c => c.sha === sha).length === 0) {
            // 第一次进入
            if (folder === undefined) sha = res.data.sha
            // 更新文件夹内容
            else if ('path' in folder) {
              // 通过path值，更新sha值
              folder = panel.fileTree.filter(c => c.path === folder.path)[0]
              if (folder === undefined) sha = res.data.sha
              // 仍然无法找到path值时，返回目录顶层
              else sha = folder.sha // 更新sha值
            }
          }

          if (isRedirect) panel.redirectTree(sha)
          //
        })
        .catch(() => {
          panel.$message({
            message: "网络请求错误，请检查仓库是否有'master'分支",
            type: 'error'
          })
          panel.isRefresh = false
        })
    },
    /**
     * 删除文件
     */
    deleteFile (row) {
      let file = this.fileTree.filter(c => c.sha === row.sha)[0]
      if (file === undefined || file === null) {
        this.$message({
          message: `不存在文件:${file.path}，请刷新后重试`,
          type: 'error'
        })
        return null
      }
      return api.deleteV5ReposOwnerRepoContentsPath(file.path, file.sha)
    },
    /**
     * 返回文件链接
     */
    getFileUrl (row) {
      let file = this.fileTree.filter(
        c => c.sha === row.sha && c.path.indexOf(row.name) > -1
      )[0]
      if (file === undefined || file === null) {
        this.$message({
          message: `不存在文件:${file.path}，请刷新后重试`,
          type: 'error'
        })
        return null
      }
      let url = `https://gitee.com/${api.config.owner}/${this.repo.name}/raw/master/${file.path}`
      return url
    },
    /**
     *下载文件
     */
    download (row, fileName) {
      let url = this.getFileUrl(row)

      let link = document.createElement('a')
      link.style.display = 'none'
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    /**
     * 创建文件夹
     */
    createFolder () {
      let panel = this
      let _api = api
      let file = this.fileTree.filter(
        c => c.sha === this.panelConfig.folderSha
      )[0]

      let path = file ? ('path' in file ? file.path : '') : ''

      this.$prompt(
        `请输入文件夹地址,支持多层级，用'/'区分<br/>由于Gitee不支持空文件夾，会自动生成.keep文件`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          inputValue: path + '/'
        }
      ).then(({ value }) => {
        _api
          .postV5ReposOwnerRepoContentsPath(
            `${value}/.keep`,
            '6aG555uu5ZCN56ew77yadXRvb2xzLWZpbGViZWQK5LuT5bqT5Zyw5Z2A77yaaHR0cHM6Ly9naXRlZS5jb20vU3RlcER1c3QvdXRvb2xzLWZpbGViZWQ='
          )
          .then(res => {
            if (res.isAxiosError) {
              panel.$message({
                type: 'error',
                message: '文件夹创建失败'
              })
            } else {
              panel.$message({
                type: 'success',
                message: '文件夹创建成功 '
              })
            }
            panel.init(panel.repo)
          })
      })
    },
    /**
     * 单击文件夹&文件
     */
    getRowClick (row, isView) {
      isView = isView || false
      if (row.media === 'folder') {
        // 文件夹，跳转目录
        this.redirectTree(row.sha)
        return
      }
      if (row.media === 'image' && isView) {
        var icon = document.getElementById('err_' + row.sha)

        if (icon) {
          // 预览失败
          this.$message({
            type: 'warning',
            message: '文件太大，预览失败，请复制链接至浏览器打开'
          })
        } else {
          document.getElementById(row.sha).click()
        }
      } else {
        // 拒绝预览
        this.$message({
          type: 'warning',
          message: window.location.host + ',不是图片文件，无法打开预览'
        })
      }

      return false
    },
    /**
     * 删除单个文件
     */
    deleteSingleFile (row) {
      let panel = this
      // 询问是否删除
      this.$confirm('此操作将永久删除该文件, 找回请自行去Gitee操作', '提示', {
        lockScroll: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 执行删除
          panel.deleteFile(row).then(res => {
            if (res.isAxiosError) {
              // 删除失败
              panel.$message({
                type: 'error',
                message: '删除失败：' + res.response.data.message
              })
            } else {
              // 删除成功
              panel.$message({
                type: 'success',
                message: '删除成功!'
              })
              panel.init(panel.repo)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 下载单个文件
     */
    downloadSingleFile (row) {
      this.download(row, row.name)
    },
    /**
     * 按格式复制链接
     */
    copyLink (row, type) {
      let cli = new Clipboard('.el-button')
      cli.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'succes'
        })
        // 释放内存
        cli.destroy()
      })
      cli.on('error', e => {
        this.$message({
          message: '复制失败',
          type: 'error'
        })
        // 释放内存
        cli.destroy()
      })
    }
  },
  filters: {
    /**
     * 图标选择
     */
    iconFilter (data) {
      // 当数据为文件夹类型时
      if (data.media === 'folder') return 'el-icon-folder'
      if (data.media === 'image') return 'el-icon-picture-outline'
      return 'el-icon-document'
    },
    /**
     * 文件大小显示
     */
    sizeFilter (data) {
      if (data.media === 'folder') return '-'
      let size = data.size / 1024
      let unit = 'KB'

      // mb
      if (size > 100) {
        size = size / 1024
        unit = 'MB'
      }
      // gb
      if (size > 100) {
        size = size / 1024
        unit = 'GB'
      }
      return `${Math.round(size * 100) / 100}  ${unit}`
    },
    /**
     * 复制的链接格式
     */
    linkFilter (row, type, getFileUrl) {
      let url = getFileUrl(row)
      type = ('' + type).toLowerCase()
      let link = url
      if (type === 'html') {
        link = `<img src="${url}" alt="${row.name}" width="100%" />`
      } else if (type === 'md') link = `![${row.name}](${url})`
      return link
    }
  }
}
</script>
<style >
/* 预览图片加载失败 */
.panel .image-slot {
  display: flex;
  font-size: 40px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes shine {
  0% {
    opacity: 0.5;
    width: 100%;
    height: 100%;
    top: 0%;
    left: 0%;
  }
  100% {
    opacity: 0;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
  }
}

.stop {
  animation-play-state: paused !important;
}
.stop.float-ball::before {
  animation-iteration-count: 3;
  animation: shine 1s !important;
}

.float-ball {
  font-size: 20px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  animation: turn 1s linear infinite;
}

.float-ball::before {
  content: "";
  position: absolute;
  background-color: #87b2fe;
  border-radius: 100%;
  z-index: 0;
  animation: shine 1s infinite;
}

.el-drawer {
  padding: 20px;
}
.el-drawer__body {
  overflow: auto;
}

.el-table__row .el-image{
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
}
</style>
