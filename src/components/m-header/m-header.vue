<template>
  <div class="m-header">
    <img src="../../common/image/header.jpg" alt="">
    <h1 class="text">音乐播放器</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    width: 100%
    height:44px
    text-align center
    color: $color-theme
    font-size: 0
    img
      display:inline-block
      width:40px
      height:40px
    .text
      display :inline-block
      vertical-align: top
      line-height:44px
      font-size:$font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
