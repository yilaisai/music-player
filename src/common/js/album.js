export default class Album {
  constructor ({id, name, album = true}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T002R150x150M000${id}.jpg?max_age=2592000`
    this.album = album
  }
}
