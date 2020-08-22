<template>
  <el-form ref="form" :model="form" label-width="80px">
    <!-- 导航 -->
    <el-menu
      class="el-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      default-active="1"
      mode="horizontal"
    >
      <el-menu-item class="item-right" @click="drawer = true">
        <i class="el-icon-s-tools"></i>
      </el-menu-item>
      <el-menu-item class="item-right">
        <el-select v-model="repoSel" v-on:change="selectChanged" placeholder="请选择活动仓库">
          <el-option v-for="(v,i) in repoArr" :key="i" :label="v.name" :value="v.id"></el-option>
        </el-select>
      </el-menu-item>
      <el-menu-item class="item-right is-active" index="1">文件列表</el-menu-item>
    </el-menu>
    <!-- Gitee配置 -->
    <el-drawer size="500px" :visible.sync="drawer" :with-header="false">
      <setting @init="init" />
    </el-drawer>
    <!-- 文件面板 -->
    <panel ref="panel"></panel>
  </el-form>
</template>

<script>
import setting from '@/components/setting'
import panel from '@/components/panel'
import dataManager from '@/javascript/common.js'
import api from '@/api'

dataManager.init()

export default {
  components: { setting, panel, api, dataManager },
  data () {
    return {
      form: {
        url: 'www.gitee.com',
        owner: '',
        token: '',
        repo: [],
        repoByAll: []
      },
      repoSel: 0,
      drawer: false
    }
  },
  computed: {
    /**
     * 通过repo，获取详细信息
     */
    repoArr () {
      return this.form.repoByAll.filter(c => this.form.repo.indexOf(c.id) > -1)
    }
  },
  methods: {
    /**
     * 初始化gitee配置
     */
    init () {
      // debugger
      this.drawer = false
      this.form = dataManager.getData('giteeSetting', true) || this.form
      this.repoSel = Number.parseInt(dataManager.getData('repoSel'))
      // 更新api配置
      api.config = {
        owner: this.form.owner,
        token: this.form.token
      }

      this.filterRepo()
      if (isNaN(this.repoSel)) {
        this.drawer = true
      }
    },
    /**
     * 显示筛选出来的仓库
     */
    filterRepo () {
      // 当选择的仓库中，没有上传选中的仓库时，默认使用第一个仓库
      if (
        this.repoArr.length > 0 &&
        this.repoArr.filter(c => c.id === this.repoSel).length !== 1
      ) {
        this.repoSel = this.repoArr[0].id
        api.config.repo = this.repoArr[0].name
        dataManager.setData('repoSel', this.repoSel)
      }

      this.$refs.panel.init(this.repoArr.filter(c => c.id === this.repoSel)[0])
    },
    /**
     * 修改下拉选项时
     */
    selectChanged (item) {
      dataManager.setData('repoSel', this.repoSel)
      let data = this.repoArr.filter(c => c.id === this.repoSel)[0]
      this.$refs.panel.init(data)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.el-menu-demo li.item-right {
  float: right !important;
}
.el-drawer {
  outline-style: none;
}

.divider-container {
  background-color: #fff;
  position: absolute;
  top: 20px;
  left: 19px;
  right: 20px;
  height: 33px;
  padding-top: 26px;
}

.divider-container .el-divider {
  margin: 0;
}
.divider-container .el-divider .el-divider__text {
  font-size: 25px;
}

.divider-container + blockquote {
  margin-top: 59px;
}
</style>
