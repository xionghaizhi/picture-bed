<template>
  <el-form ref="form" :model="form" label-width="80px">
    <div class="divider-container">
      <el-divider content-position="left">Gitee配置</el-divider>
    </div>
    <quote>
      <ul>
        <li class="el-form-item__label">
          本插件是文件床，基于
          <b>Gitee</b>，请自行注册和配置Gitee
        </li>
        <li class="el-form-item__label">
          不推荐上传
          <b>大文件(10M+)和隐私文件</b>
        </li>
        <li class="el-form-item__label">
          【
          <a href="javascript:;" class="xd" @click="xxdd = true">絮絮叨叨</a>】 ，
          【
          <a href="javascript:;" class="xd" @click="pzwd = true">配置文档</a>】
        </li>
        <li class="el-form-item__label" v-show="dirname">
          缓存地址：<br/>
          <b>{{dirname}}</b>
        </li>
      </ul>
    </quote>

    <el-form-item label="url" style="margin-top:16px">
      <el-input v-model="form.url" readonly placeholder="Gitee主页"></el-input>
    </el-form-item>
    <el-form-item v-model="form.url" label="owner" :gutter="20">
      <el-col :span="19">
        <el-input v-model="form.owner" value="stepdust" placeholder="个人空间地址，例：Dust"></el-input>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button icon="el-icon-s-promotion" @click="getUsersRepos" circle></el-button>
      </el-col>
    </el-form-item>
    <el-form-item label="repo" v-show="form.repoByAll&&form.repoByAll.length!=0">
      <el-select v-model="form.repo" multiple placeholder="仓库路径">
        <el-option v-for="(v,i) in form.repoByAll" :key="i" :label="v.name" :value="v.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="token">
      <el-input v-model="form.token" placeholder="用户授权码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">更新配置</el-button>
      <el-button @click="onClear">清除</el-button>
    </el-form-item>

    <!-- 絮絮叨叨 -->
    <el-drawer size="500px" :append-to-body="true" :visible.sync="xxdd" :with-header="false">
      <xxdd></xxdd>
    </el-drawer>
    <!-- 配置文档 -->
    <el-drawer size="500px" :append-to-body="true" :visible.sync="pzwd" :with-header="false">
      <pzwd></pzwd>
    </el-drawer>
  </el-form>
</template>

<script>
import quote from '@/components/quote'
import xxdd from '@/components/xxdd'
import pzwd from '@/components/pzwd'
import api from '@/api'
import dataManager from '@/javascript/common.js'

dataManager.init()

export default {
  components: { quote, xxdd, pzwd },
  data () {
    return {
      form: {
        url: 'www.gitee.com',
        owner: '',
        token: '',
        repo: [],
        repoByAll: []
      },
      xxdd: false,
      pzwd: false,
      dirname: dataManager.dirname
    }
  },
  methods: {
    /**
     * 获取用户所有公开库
     */
    getUsersRepos () {
      api.config.owner = this.form.owner
      // 清空旧数据
      this.form.repoByAll = []
      this.form.repo = []
      api.getV5UsersUsernameRepos().then(res => {
        res.data.forEach(element => {
          this.form.repoByAll.push(
            {
              id: element.id,
              full_name: element.full_name,
              path: element.path,
              name: element.name,
              description: element.description
            }
          )
        })
      })
    },
    onSubmit () {
      // 存储配置信息
      dataManager.setData('giteeSetting', JSON.stringify(this.form))
      // 触发父组件初始化
      this.$emit('init')
    },
    onClear () {
      dataManager.clearData()
      this.form = {
        url: 'www.gitee.com',
        owner: '',
        token: '',
        repo: [],
        repoByAll: []
      }
    }
  },
  created () {
    this.form = dataManager.getData('giteeSetting', true) || this.form
  }
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
</style>
