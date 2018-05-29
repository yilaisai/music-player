<template>
  <scroll ref="suggest"
          class="suggest"
          :pullup="pullup"
          :data="result"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
  >
    <div>
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
      </ul>
    </div>
    <div class="no-result-container" v-show="!hasMore && result.length <= 0">
      <no-result title="抱歉，找不到您搜索的内容！"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {serachResult} from 'api/search'
  import {ERR_OK} from 'api/conf'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapActions, mapMutations} from 'vuex'
  import Singer from 'common/js/singer'
  import Album from 'common/js/album'
  import NoResult from 'base/no-result/no-result'

  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
      refresh () {
        this.$refs.suggest.refresh()
      },
      search () {
        this.page = 1
        this.hasMore = true
        if (this.query) {
          serachResult(this.query, perpage, this.page).then((res) => {
            if (res.code === ERR_OK) {
              this.result = this._genResult(res.data)
              this._checkMore(res.data)
            }
          })
        }
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        serachResult(this.query, perpage, this.page).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      listScroll () {
        this.$emit('listScroll')
      },
      selectItem (item) {
        if (!item.type) {
          this.insertSong(item)
        } else if (item.type === 2) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else if (item.type === 3) {
          const album = new Album({
            id: item.albummid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${album.id}`
          })
          this.setSinger(album)
        }
        this.$emit('select', item)
      },
      getIconCls (item) {
        if (item.type > 0) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type > 0) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singername) {
          ret.push(data.zhida)
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapActions([
        'insertSong'
      ]),
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      })
    },
    watch: {
      query (newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow:hidden
    .suggest-list
      padding:0 30px
      .suggest-item
        display:flex
        align-items:center
        padding-bottom:20px
        .icon
          flex:0 0 35px
          width:35px
          text-align:center
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result-container
      position:absolute
      top:50%
      width:100%
      transform:translateY(-50%)
</style>
