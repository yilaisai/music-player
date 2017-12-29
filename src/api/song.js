import {commonParams} from './conf'
import axios from 'axios'

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    nobase64: 1,
    musicid: mid,
    g_tk: 1703901304,
    loginUin: 2851518680,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
