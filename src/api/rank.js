import axios from 'axios'
import {commonParams, options} from 'api/conf'
import jsonp from 'common/js/jsonp'

export function rank () {
  const url = '/api/rank'
  const data = {
    g_tk: 953100493,
    uin: 2851518680,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    tpl: 3,
    page: 'detail',
    topid,
    type: 'top',
    song_begin: 0,
    song_num: 30,
    g_tk: 1703901304,
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
