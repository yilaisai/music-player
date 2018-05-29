<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScorll from 'better-scroll'

  export default {
    props: {
      probeType: {   // 滚动的类型，1表示会派发事件，会截流
        type: Number,
        default: 1
      },
      click: {  // 是否允许在滚动上点击，可能和fastclick有冲突，可以用class="needsclick"解决
        type: Boolean,
        default: true
      },
      listenScroll: {  // 是否派发滚动事件
        type: Boolean,
        default: false
      },
      data: {
        default: null
      },
      pullup: { // 是否派发滚动到底部的事件，用于上拉加载
        type: Boolean,
        default: false
      },
      beforeScroll: { // 是否派发列表滚动开始的事件
        type: Boolean,
        default: false
      },
      refreshDelay: { // 当数据更新后，刷新scroll的延时
        type: Number,
        defalut: 20
      }
    },
    mounted () {
      setTimeout(() => {     // 20是保证dom已经ready
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScorll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {      // 如果有监听就触发一个事件并把相关参数传出去
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {  // 适应底部
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
