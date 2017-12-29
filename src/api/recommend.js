import axios from 'axios'

export const ERR_OK = 0

export function recommendSlider () {
  const url = '/api/slider'
  const data = {
    g_tk: 1703901304,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    rnd: Math.random()
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = '/api/songList'
  const data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    format: 'json',
    g_tk: 1703901304,
    loginUin: 2851518680,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
