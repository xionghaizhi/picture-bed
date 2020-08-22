import axios from 'axios'

// 创建axios实例
var service = axios.create({
  baseURL: 'https://gitee.com/api',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * 全局请求拦截
*/
service.interceptors.request.use(
  function (config) {
    // console.group('全局请求拦截')
    // console.info(config)
    // console.groupEnd()
    return config
  },
  function (err) {
    // console.group('全局请求拦截')
    // console.error(err)
    // console.groupEnd()
    return err
  }
)

/**
 * 全局响应拦截
*/
service.interceptors.response.use(
  function (response) {
    // console.group('全局响应拦截')
    // console.info(response)
    // console.groupEnd()
    return response
  },
  function (err) {
    // console.group('全局响应拦截')
    // console.error(err)
    // console.groupEnd()
    return err
  }
)

service.ajax = function (pathObj) {
  if (pathObj.modth === 'get') {
    pathObj.url += '?'
    for (let p in pathObj.params) {
      pathObj.url += `${p}=${pathObj.params[p]}&`
    }
    pathObj.url = pathObj.url.substr(0, pathObj.url.length - 1)
  }

  return service({
    method: pathObj.modth,
    url: pathObj.url,
    data: pathObj.params
  })
}

export default service
