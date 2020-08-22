export default {
  /**
   * 拷贝对象，防止初始配置被修改
   * @param {object} obj 对象
   */
  copy: function (obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  /**
   * 替换变量地址,形如{{variable}}
   * @param {string} url api链接地址
   * @param {obj} obj 替换的值
   * @returns {string} api完整链接地址
   */
  replaceVariable (url, obj) {
    url = url.replace(' ', '') // 处理输入变量时，误打空格
    for (let variable in obj) {
      url = url.replace(`{{${variable}}}`, obj[variable])
    }
    return url
  },
  getUsersRepos: {
    explain: '获取某个用户的公开仓库',
    source: 'https://gitee.com/api/v5/swagger#/getV5UsersUsernameRepos',
    url: '/v5/users/{{owner}}/repos',
    modth: 'get',
    params: {
      type: 'personal',
      sort: 'full_name',
      page: 1,
      per_page: 100
    }
  },
  getRepoTrees: {
    explain: '获取目录Tree',
    source: 'https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoGitTreesSha',
    url: '/v5/repos/{{owner}}/{{repo}}/git/trees/{{sha}}',
    modth: 'get',
    params: {
      recursive: 0
    }
  },
  getBlobsSha: {
    explain: '获取文件Blob',
    source: 'https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoGitBlobsSha',
    url: '/v5/repos/{{owner}}/{{repo}}/git/blobs/{{sha}}',
    modth: 'get',
    params: {}
  },
  postContentsPath: {
    explain: '新建文件',
    source: 'https://gitee.com/api/v5/swagger#/postV5ReposOwnerRepoContentsPath',
    url: '/v5/repos/{{owner}}/{{repo}}/contents/{{path}}',
    modth: 'post',
    params: {
      access_token: '',
      content: '',
      message: 'utools-filebed，新建文件',
      committer: {
        name: 'utools-plugin-filebed',
        email: 'z.onlooker@qq.com'
      }
    }
  },
  deleteContentsPath: {
    explain: '删除文件',
    source: 'https://gitee.com/api/v5/swagger#/deleteV5ReposOwnerRepoContentsPath',
    url: '/v5/repos/{{owner}}/{{repo}}/contents/{{path}}',
    modth: 'delete',
    params: {
      access_token: '',
      sha: '',
      message: 'utools-filebed，删除文件',
      committer: {
        name: 'utools-plugin-filebed',
        email: 'z.onlooker@qq.com'
      }
    }
  }
}
