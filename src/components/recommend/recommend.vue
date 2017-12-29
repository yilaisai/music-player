<template>
  <scroll class="recommend" :data="allData" ref="scroll">
    <div>
      <div class="sliderWrap" v-if="recommend.length">
        <slider>
          <div class="slider-item" v-for="item in recommend">
            <a :href="item.linkUrl" class="">
              <img :src="item.picUrl" alt="" @load="loadImg">
            </a>
          </div>
        </slider>
      </div>
      <div v-if="hot.length" class="content">
        <p class="title">热门歌单</p>
        <div class="item" v-for="item in hot" @click="selectItem(item)">
          <div class="link">
            <img v-lazy="item.picUrl" alt="">
          </div>
          <p class="text">{{item.songListDesc}}</p>
          <p class="text" v-if="item.songListAuthor">{{item.songListAuthor}}</p>
        </div>
      </div>
    </div>
    <div class="loading-content" v-show="!hot.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script>
  import {recommendSlider} from 'api/recommend'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        allData: {},
        recommend: [],
        hot: []
      }
    },
    mounted () {
      this._slider()
    },
    methods: {
      _slider () {
        recommendSlider().then((res) => {
          this.allData = res.data
          this.recommend = res.data.slider
          this.hot = res.data.songList
        })
      },
      loadImg () {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem (item) {
        this.setDisc(item)
        this.$router.push({
          path: `/recommend/${item.id}`
        })
      },
      ...mapMutations({
        'setDisc': 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .recommend
    position:fixed
    top:90px
    left:0
    bottom:0
    width: 100%
    overflow hidden
    .sliderWrap
      position:relative
      width: 100%
      overflow: hidden
    .content
      width: 100%
      overflow :hidden
      box-sizing:border-box
      margin:10px 0
      .title
        height:30px
        line-height 30px
        margin-bottom:10px
        font-size:$font-size-large
      .item
        float: left
        width: 50%
        padding:5px
        box-sizing:border-box
        overflow:hidden
        .link
          width:100%
          font-size:0
          img
            width:100%
        .text
          height:30px
          line-height:30px
          text-indent:10px
          font-size:$font-size-small
          white-space:nowrap
          text-overflow:ellipsis
          overflow:hidden
          background-color :$color-highlight-background
    .loading-content
      position:absolute
      width: 100%
      top: 50%
      transform : translateY(-50%)
</style>
