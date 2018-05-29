import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.random ? 'icon-random' : this.mode === playMode.loop ? 'icon-loop' : 'icon-sequence'
    },
    ...mapGetters([
      'playlist',
      'sequenceList',
      'currentSong',
      'mode',
      'favorite'
    ])
  },
  methods: {
    changeMode () {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetPlayList(list)
      this.setPlayList(list)
    },
    resetPlayList (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteHistory(song)
      } else {
        this.saveFavoriteHistory(song)
      }
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    isFavorite (song) {
      const index = this.favorite.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlaying: 'SET_PLAYING'
    }),
    ...mapActions([
      'saveFavoriteHistory',
      'deleteFavoriteHistory'
    ])
  }
}

export const searchMixin = {
  methods: {
    changeQuery (query) {
      this.query = query
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
