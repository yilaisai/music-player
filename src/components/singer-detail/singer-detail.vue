<template>
  <transition name="music">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {getAlbumDetail} from 'api/album'
  import {ERR_OK} from 'api/conf'
  import {createSong} from 'common/js/song'

  export default {
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getDetail()
    },
    methods: {
      _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        if (this.singer.album) {
          getAlbumDetail(this.singer.id).then((res) => {
            // 专辑
            if (res.code === ERR_OK) {
              this.songs = this._normalizeAlbum(res.data.list)
            }
          })
        } else {
          getSingerDetail(this.singer.id).then((res) => {
            // 歌手
            if (res.code === ERR_OK) {
              this.songs = this._normalizeSongs(res.data.list)
            }
          })
        }
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.albummid && musicData.songid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _normalizeAlbum (list) {
        let ret = []
        list.forEach((item) => {
          if (item.albummid && item.songid) {
            ret.push(createSong(item))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
  .music-enter-active, .music-leave-active
    transition : all 1s
  .music-enter, .music-leave-to
    transform : translate3d(100%, 0, 0)
</style>
