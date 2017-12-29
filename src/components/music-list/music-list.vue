<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title" v-html="title" ref="minHeight"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="playRandom">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" class="list" ref="list" @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div class="loading-content" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform')

  export default {
    mixins: [playlistMixin],
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        scrollY: 0
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minHeight = this.$refs.minHeight.clientHeight
      this.minTransalteY = -this.imageHeight + this.minHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      playRandom () {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    components: {
      Scroll,
      SongList,
      Loading
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minTransalteY, newY)
        let zIndex = 0
        let scale = 1
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        }
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
        if (newY < this.minTransalteY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${this.minHeight}px`
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position:fixed
    top:0
    left:0
    bottom:0
    right:0
    width:100%
    background-color:$color-background
    z-index:99
    .back
      position:absolute
      top:0
      left:6px
      z-index:50
      .icon-back
        display:block
        padding:10px
        font-size:$font-size-large-x
        color:$color-theme
    .title
      position:absolute
      top:0
      left: 10%
      z-index:40
      width: 80%
      no-wrap()
      text-align :center
      line-height:40px
      font-size:$font-size-large
      color: $color-text
    .bg-image
      position:relative
      top:0
      left:0
      width: 100%
      height:0
      padding-top:70%
      transform-origin :top
      background-size :cover
      .play-wrapper
        position:absolute
        bottom:40px
        width:100%
        z-index:50
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          border: 1px solid $color-theme
          color: $color-theme
          text-align center
          border-radius: 100px
          font-size:0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .bg-layer
      position:relative
      height: 100%
      background-color :$color-background
    .list
      position:fixed
      top:0
      bottom:0
      width: 100%
      background :$color-background
      .song-list-wrapper
        padding:20px 30px
      .loading-content
        position:absolute
        top: 50%
        transform : translate3d(0, -50%, 0)
        width:100%
</style>
