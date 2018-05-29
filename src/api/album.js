import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/conf'

export function getAlbumDetail (albummid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'
  const data = Object.assign({}, commonParams, {
    albummid,
    uin: 2851518680,
    notice: 0,
    platform: 'h5',
    needNewCode: '1'
  })
  return jsonp(url, data, options)
}
