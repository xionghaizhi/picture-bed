<template>
  <div>
    <div class="divider-container">
      <el-divider content-position="left">配置文档</el-divider>
    </div>
    <quote>
      <ul>
        <li class="el-form-item__label">【注册Gitee】</li>
        <li class="el-form-item__label">
          地址：
          <a href="https://gitee.com/login" target="_blank">https://gitee.com/login</a>
        </li>
      </ul>
    </quote>
    <quote>
      <ul>
        <li class="el-form-item__label">【创建仓库】</li>
        <li class="el-form-item__label">
          地址：
          <a href="https://gitee.com/projects/new" target="_blank">https://gitee.com/projects/new</a>
        </li>
        <li class="el-form-item__label">
          在创建仓库时，
          <b>仓库名称和路径请保持一致，需要选择"是否开源"，请选择"公开"</b>，其他配置不需要改动
        </li>
        <li class="el-form-item__label">而一旦选择公开后，所有人都能看到你的仓库里面的东西，所以不要往仓库里面上传乱七八糟的文件</li>
      </ul>
    </quote>
    <quote>
      <ul>
        <li class="el-form-item__label">【私人令牌】</li>
        <li class="el-form-item__label">
          地址：
          <a
            href="https://gitee.com/profile/personal_access_tokens"
            target="_blank"
          >https://gitee.com/profile/personal_access_tokens</a>
        </li>
        <li class="el-form-item__label">点击"生成新令牌"，令牌描述推荐"utools-filebed"，权限请勾选"projects"</li>
        <li class="el-form-item__label">
          <b>务必保管好生成的令牌，也就是我们俗称的token</b>
        </li>
        <li class="el-form-item__label">至此，Gitee网站上的配置就结束了</li>
        <li class="el-form-item__label">
          <img
            src="https://gitee.com/stepdust/FileBed/raw/master/MarkDown/utools-filebed/create_token.png"
            alt="create_token.png"
            width="100%"
          />
        </li>
        <li class="el-form-item__label">
          <img
            src="https://gitee.com/stepdust/FileBed/raw/master/MarkDown/utools-filebed/create_token_str.png"
            alt="create_token_str.png"
            width="100%"
          />
        </li>
      </ul>
    </quote>
    <quote type="danger">
      <ul>
        <li class="el-form-item__label">【owner】</li>
        <li class="el-form-item__label">这是你在注册Gitee账号时填写的"个人空间地址"，比如说我的就是"StepDust"，不区分大小写</li>
        <li class="el-form-item__label">填好后，需要点击后面的"纸飞机"图标，会根据owner自动获取所有的公开仓库</li>
        <li>
          <img
            src="https://gitee.com/stepdust/FileBed/raw/master/MarkDown/utools-filebed/owner.png"
            alt="owner.png"
            width="100%"
          />
        </li>
      </ul>
    </quote>
    <quote type="danger">
      <ul>
        <li class="el-form-item__label">【repo】</li>
        <li class="el-form-item__label">如果你创建了公开仓库，在点击owner后的小飞机后，会出现这个选项</li>
        <li class="el-form-item__label">请选择你用于存储文件的仓库，可以多选，毕竟一个仓库的容量只有500M，略小</li>
        <li class="el-form-item__label">
          <img
            src="https://gitee.com/stepdust/FileBed/raw/master/MarkDown/utools-filebed/repo.png"
            alt="repo.png"
            width="100%"
          />
        </li>
      </ul>
    </quote>
    <quote type="danger">
      <ul>
        <li class="el-form-item__label">【token】</li>
        <li class="el-form-item__label">请填写你在Gitee网站中获取到的私人令牌(token)</li>
        <li class="el-form-item__label">utools-filebed不会收集token，也没有使用utools提供的数据库接口，token只保存于本地</li>
        <li class="el-form-item__label">更换电脑后，utools-filebed缓存的所有数据和配置都会丢失</li>
      </ul>
    </quote>
  </div>
</template>
<script>
import quote from '@/components/quote'

export default {
  components: { quote }
}
</script>
