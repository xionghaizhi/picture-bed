<template>
  <blockquote class="elem-quote" :class="type">
    <slot>
      <div v-html="explain"></div>
    </slot>
  </blockquote>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: ['explain', 'type']
}
</script>

<style>
.elem-quote {
  background-color: #f2f2f2;
  margin: 0;
  margin-top: 16px;
  padding: 15px;
  border-left: 5px solid #409eff;
  color: #909399;
}

.elem-quote.info{
  border-left: 5px solid #909399;
}
.elem-quote.danger{
  border-left: 5px solid #F56C6C;
}
.elem-quote.warning{
  border-left: 5px solid #E6A23C;
}
.elem-quote.success{
  border-left: 5px solid #67C23A;
}

.elem-quote .el-form-item__label {
  float: none;
  line-height: 30px;
  text-align: left;
}

.elem-quote a {
  color: #409eff;
}

.elem-quote ul{
  margin:0;padding:0 0 0 15px;
}

</style>
