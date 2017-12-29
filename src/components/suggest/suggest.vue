<template>
  <scroll ref="suggest"
          class="suggest"
          :pullup="pullup"
          :data="result"
          @scrollToEnd="searchMore"
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

  const perpage = 20
  const TYPE_SINGER = 'singer'

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
        hasMore: true
      }
    },
    methods: {
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
      selectItem (item) {
        let hasSingermid = true
        if (item.singermid) {
          hasSingermid = true
        } else {
          hasSingermid = false
        }
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid || item.albummid,
            name: item.singername,
            key: hasSingermid
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singername) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
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
      Loading
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
</style>
