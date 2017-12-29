<template>
  <scroll class="rank" ref="rank">
    <div class="wrap">
      <div class="rank-item" v-for="item in topList" @click="select(item)">
        <div class="item-content">
          <div class="item-img">
            <img v-lazy="item.picUrl"  width="100" height="100">
          </div>
          <div class="item-text">
            <h5 class="title">{{item.topTitle}}</h5>
            <p v-for="(song,index) in item.songList">
              {{index+1}}　{{song.songname}} - <span>{{song.singername}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="loading-content" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script>
  import {rank} from 'api/rank'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/conf'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [
      playlistMixin
    ],
    data () {
      return {
        topList: []
      }
    },
    created () {
      this._rankList()
    },
    methods: {
      select (item) {
        this.setTopList(item)
        this.$router.push({
          path: `/rank/${item.id}`
        })
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.rank.$el.style.bottom = bottom
        this.$refs.rank.refresh()
      },
      _rankList () {
        rank().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .rank
    position:fixed
    top:90px
    bottom:0
    left:0
    width:100%
    overflow:hidden
    .wrap
      .rank-item
        width:100%
        margin-bottom:10px
        .item-content
          display:flex
          width: 100%
          box-sizing:border-box
          overflow:hidden
          .item-img
            display:block
            font-size:0
          .item-text
            display:flex
            overflow:hidden
            flex:1
            flex-direction:column
            background-color:$color-highlight-background
            text-indent:20px
            .title
              height:35px
              line-height:35px
              font-size:$font-size-medium-x
              color:$color-text-ll
            p
              flex:1
              font-size:$font-size-medium
              color:$color-text-l
              overflow:hidden
              white-space:nowrap
              text-overflow:ellipsis
              span
                color:$color-text-d
  &.loading-content
    position:absolute
    width: 100%
    top: 50%
    transform : translateY(-50%)
</style>
