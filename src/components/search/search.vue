<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="changeQuery"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="hot-key" v-show="!query">
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
      <div class="search-result" v-show="query">
        <suggest :query="query"></suggest>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import {getHotList} from 'api/search'
  import {ERR_OK} from 'api/conf'

  export default {
    created () {
      this._getHotList()
    },
    data () {
      return {
        hotKey: [],
        special: {},
        query: ''
      }
    },
    methods: {
      addQuery (query) {
        this.$refs.searchBox.setQuery(query)
      },
      changeQuery (query) {
        this.query = query
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
      }
    },
    components: {
      SearchBox,
      Suggest
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

      .search-result
       position: fixed
       width: 100%
       top: 178px
       bottom: 0
</style>
