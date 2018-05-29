<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="changeQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="special-item" v-show="special">
                <a :href="special.url">
                  {{special.key}}
                </a>
              </li>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
            </h1>
            <search-list :searches="searchHistory" @selectHistory="addQuery" @deleteHistory="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @select="saveSearch" @listScroll="blurInput" ref="suggest"></suggest>
    </div>
    <router-view></router-view>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import {getHotList} from 'api/search'
  import {ERR_OK} from 'api/conf'
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin, searchMixin],
    created () {
      this._getHotList()
    },
    data () {
      return {
        hotKey: [],
        special: {},
        query: '',
        refreshDelay: 120
      }
    },
    computed: {
      shortcut () {
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      _getHotList () {
        getHotList().then((res) => {
          if (res.code === ERR_OK) {
            this._specialKey(res.data)
          }
        })
      },
      _specialKey (data) {
        if (data.special_key) {
          this.special.key = data.special_key
          this.special.url = data.special_url
        }
        this.hotKey = data.hotkey.slice(0, 10)
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin:20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow:hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom:20px
            font-size: $font-size-medium
            color:$color-text-l
          .item
            display:inline-block
            padding:5px 10px
            margin:0 20px 10px 0
            border-radius:6px
            background:$color-highlight-background
            font-size: $font-size-medium
            color:$color-text-d
          .special-item
            display:inline-block
            margin:0 20px 10px 0
            a
              display:block
              padding:5px 10px
              border-radius:6px
              font-size: $font-size-medium
              color:#f00
              background:#fff
      .history
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
    .search-result
     position: fixed
     width: 100%
     top: 178px
     bottom: 0
</style>
