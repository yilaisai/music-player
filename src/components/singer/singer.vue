<template>
  <div class="singger" ref="singger">
    <list-view :data="singer" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/conf'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        singer: []
      }
    },
    created () {
      this._getSinggerList()
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.singger.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSingers(singer)
      },
      _getSinggerList () {
        getSingerList().then((res) => {
          if (ERR_OK === 0) {
            this.singer = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        //  对获得的map对象进行排序
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSingers: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus">
  .singger
    position:fixed
    top:90px
    bottom:0
    width:100%
</style>
