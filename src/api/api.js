import resquest from '@/api/request'
import path from '@/api/path'

export default {
  config: {
    owner: '',
    repo: '',
    sha: '',
    token: ''
  },
  /**
   * 返回域名
   */
  getBaseUrl () {
    return resquest.defaults.baseURL
  },
  /**
   * 获取某个用户的公开仓库
   */
  getV5UsersUsernameRepos () {
    let pathObj = path.copy(path.getUsersRepos)
    // url拼接
    pathObj.url = path.replaceVariable(pathObj.url, this.config)
    return resquest.ajax(pathObj)
  },
  /**
   * 获取目录Tree
   * @param {string} sha 目录Tree的SHA值
   * @param {number} recursive 赋值为1递归获取目录
   */
  getV5ReposOwnerRepoGitTreesSha (sha, recursive) {
    let pathObj = path.copy(path.getRepoTrees)
    // url拼接
    pathObj.url = path.replaceVariable(pathObj.url, this.config)
    pathObj.url = pathObj.url.replace(`{{sha}}`, sha)
    // 参数修改
    pathObj.params.recursive = recursive || 0
    return resquest.ajax(pathObj)
  },
  /**
   * 获取文件Blob
   * @param {string} sha 目录Tree的SHA值
   */
  getV5ReposOwnerRepoGitBlobsSha (sha) {
    let pathObj = path.copy(path.getBlobsSha)
    // url拼接
    pathObj.url = path.replaceVariable(pathObj.url, this.config)
    pathObj.url = pathObj.url.replace(`{{sha}}`, sha)

    return resquest.ajax(pathObj)
  },
  /**
   * 新建文件
   * @param {string} filePath 文件路径，包含文件名称
   * @param {string} base64 文件的base64编码
   */
  postV5ReposOwnerRepoContentsPath (filePath, base64) {
    let pathObj = path.copy(path.postContentsPath)
    // url拼接
    pathObj.url = path.replaceVariable(pathObj.url, this.config)
    pathObj.url = pathObj.url.replace(`{{path}}`, filePath)
    pathObj.params.message += ':' + filePath
    pathObj.params.content = base64
    pathObj.params.access_token = this.config.token

    return resquest.ajax(pathObj)
  },
  /**
   * 删除文件
   * @param {string} filePath 文件路径，包含文件名称
   * @param {string} sha 目录Tree的SHA值
   */
  deleteV5ReposOwnerRepoContentsPath (filePath, sha) {
    let pathObj = path.copy(path.deleteContentsPath)
    // url拼接
    pathObj.url = path.replaceVariable(pathObj.url, this.config)
    pathObj.url = pathObj.url.replace(`{{path}}`, filePath)
    pathObj.params.sha = sha
    pathObj.params.message += ':' + filePath
    pathObj.params.access_token = this.config.token

    return resquest.ajax(pathObj)
  }

}
