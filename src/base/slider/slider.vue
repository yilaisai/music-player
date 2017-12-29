<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted () {
      setTimeout(() => {
        this._setWidth()
        this._intDots()
        this._intScroll()
        if (this.autoPlay) {
          this._autoPlay()
        }
      }, 20)
      window.addEventListener('resize', () => {
        console.log(1)
        if (!this.scroll) {
          return
        }
        this._setWidth(true)
        this.scroll.refresh()
      })
    },
    activated () {
      if (this.autoPlay) {
        this._autoPlay()
      }
    },
    deactivated () {
      clearTimeout(this.timer)
    },
    methods: {
      _setWidth (resized) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].style.width = sliderWidth + 'px'
          addClass(this.children[i], 'slider-item')
          width += sliderWidth
        }
        if (this.loop && !resized) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _intScroll () {
        this.scroll = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            snapSpeed: 400
          },
          click: true
        })
        this.scroll.on('scrollEnd', () => {
          let pageIndex = this.scroll.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          clearTimeout(this.timer)
          if (this.autoPlay) {
            this._autoPlay()
          }
        })
        this.scroll.on('beforeScrollStart', () => {   // 解决自动播放与手动滑动的冲突
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _intDots () {
        this.dots = new Array(this.children.length)
      },
      _autoPlay () {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.scroll.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
      beforeDestroy () { // 在销毁之前清除计时器
        clearTimeout(this.timer)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slider
    overflow: hidden
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float:left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display:block
          width: 100%
          overflow:hidden
          text-decoration:none
          img
            display:block
            width:100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width:16px
</style>
