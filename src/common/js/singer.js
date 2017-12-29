export default class Singer {
  constructor ({id, name, key = true}) {
    this.id = id
    this.name = name
    this.key = key
    if (this.key) {
      this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
    } else {
      this.avatar = `https://y.gtimg.cn/music/photo_new/T002R150x150M000${id}.jpg?max_age=2592000`
    }
  }
}
