<template>
  <div>
    <div class="divider-container">
      <el-divider content-position="left">絮絮叨叨</el-divider>
    </div>
    <quote type="info">
      <ul>
        <li class="el-form-item__label">【序言】</li>
        <li
          class="el-form-item__label"
        >本来吧，我是想弄图床的，后来想想，啊，都用Gitee了，反正啥文件都能存了，干嘛不整一个文件床啊，免得以后要存一些小东小西还要到处丢，一步到位它不香么
          <a href="javascript:;"></a></li>
      </ul>
    </quote>
    <quote>
      <ul>
        <li class="el-form-item__label">【关于Gitee】</li>
        <li class="el-form-item__label">单仓库大小上限为500M，单文件最大100M，用户总仓库容量为5G，虽然我没有做任何上传限制，但是也不要瞎搞</li>
        <li class="el-form-item__label">单仓库容量不够的问题，我已经通过切换仓库的方法，来获得总共5G的容量，大概率是够了</li>
        <li class="el-form-item__label">万一真有文件按G算的重度使用者，请出门右拐，腾讯，阿里，七牛欢迎您</li>
      </ul>
    </quote>
    <quote type="danger">
      <ul>
        <li class="el-form-item__label">【关于Github】</li>
        <li class="el-form-item__label">这个倒是不限制大小，好像能有100G？不过架不住人家慢啊，而且我上传上去的图片，不知道咋的，外链拿到打不开</li>
        <li class="el-form-item__label">
          好像说是域名
          <span class="badge">raw.githubusercontent.com</span>被DNS污染了
        </li>
        <li class="el-form-item__label">这样的话，造成了我同一个图片链接，在同一个WIFI下，PC打不开，手机QQ打得开，手机微信又打不开的奇怪事件</li>
        <li class="el-form-item__label">不能指望每个看文件的人都会消除污染，太不现实了，所以果断抛弃这个选项</li>
      </ul>
    </quote>
    <quote>
      <ul>
        <li class="el-form-item__label">【关于文件床】</li>
        <li
          class="el-form-item__label"
        >我记得博客园自定义主页，有时候是需要外链JS和CSS文件的，有时候还需要外链一些鼠标的样式文件，音乐文件，所以有类似需求的人可用，用不上这些的话，当图床用也是很不错的</li>
      </ul>
    </quote>
    <quote type="danger">
      <ul>
        <li class="el-form-item__label">【关于图床】</li>
        <li class="el-form-item__label">
          目前我用过，做的比较好的，大概是
          <b>PicGo</b> ，不习惯我这个可以考虑用它，但其实和utools提供的图床功能差不多
        </li>
        <li class="el-form-item__label">因为考虑到以后啊，大概会有很多地方都用上，扔其他地方，哪天要换图片，就见鬼了</li>

        <li class="el-form-item__label">我把写日记的图片，写博客的图片，写文档的图片，都丢在一个地方，几百张里面找一张，啧，异常酸爽</li>
        <li class="el-form-item__label">
          我这个插件，更主要的功能就是
          <b>区分文件夹</b>，适合有整理强迫症的同好们
        </li>
      </ul>
    </quote>
    <quote>
      <ul>
        <li class="el-form-item__label">【关于utools-filebed】</li>
        <li class="el-form-item__label">起源于，emmm，好吧，就是闲的蛋疼，其他图床我用着不爽，就酱</li>
        <li class="el-form-item__label">我没有写批量删除的功能，主要是想让你们上传文件的时候更克制一些，当然，还有一部分原因是因为我懒</li>

        <li class="el-form-item__label">用着有问题或者有想加的功能，就去Gitee上提，或者去utools的社区里面提，我反正是肯定不会改的，hhh</li>
        <li class="el-form-item__label">更新嘛，大概还是会更新的，不过估计更新一次得等上个把月，大家可以考虑先将就用着</li>
      </ul>
    </quote>
    <quote type="danger">
      <ul>
        <li class="el-form-item__label">【更新方向】</li>
        <li class="el-form-item__label">首先就是上传文件那一块，可能会提出来，放在主板上，上传文件就不用再点一下按钮了，现在我自己都略微有一点点嫌弃</li>
        <li
          class="el-form-item__label"
        >然后就是短链接了，现在复制出来的链接太长了，想复制出来短一点，可能就需要第三方的服务，第三方如果炸了，那就呵呵了，所以还在考虑，慎重考虑</li>

        <li class="el-form-item__label">还有那个图标视图，虽然加起来好像挺快，毕竟功能都写好了，but，我懒啊，先鸽着</li>
        <li
          class="el-form-item__label"
        >还有一个是左侧边栏，在有三四层文件夹的情况下，我最初的设想是可以通过左侧边栏，一步抵达，就不用在面板上一层一层点下去了，挺麻烦的，说实话。也先鸽着吧，反正现在能用，这些都不急</li>
        <li
          class="el-form-item__label"
        >还有一个，就是代码实在太丑了，第一次用vue，什么组件啊，生命周期啊，命令啊，天知道我是怎么写下来的，我连npm和webpack都是第一次用，得抽空重构代码，那大概就是2.0版本了吧，任重而道远</li>
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
<style>
.badge {
  font-size: 0.9em;
  color: #fff;
  background-color: #f56c6c;
  padding: 5px;
  border-radius: 2px;
}
</style>
