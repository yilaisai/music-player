import {commonParams, options} from 'api/conf'
import jsonp from 'common/js/jsonp'

export function getHotList () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function serachResult (query, perpage, page) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const data = Object.assign({}, commonParams, {
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    perpage,
    n: perpage,
    p: page,
    zhidaqu: 1,
    catZhida: 1
  })
  return jsonp(url, data, options)
}
