<template>
  <div class="search-list">
    <transition-group tag="ul" name="slider">
      <li :key="item" v-for="item in searches" class="search-item">
        <span class="text" @click="select(item)">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      select (item) {
        console.log(item)
        this.$emit('selectHistory', item)
      },
      deleteOne (item) {
        this.$emit('deleteHistory', item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-list
    .search-item
      display :flex
      align-items :center
      height:40px
      overflow:hidden
      &.slider-enter-active, &.slider-leave-active
        transition: all 0.1s
      &.slider-enter, &.slider-leave-to
        height:0
      .text
        flex:1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
