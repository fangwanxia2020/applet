/**
 * 文件服务
 * @module api/file
 */
import { type } from '@/utils/verification'

const { http } = uni.$u

/**
 * 获取单个文件信息
 * @param {string} fileId 文件id
 * @returns {Promise}
 */
export const getFile = fileId => http.request({
  url: `/file/file/get/${fileId}`,
  method: 'GET'
})

/**
 * 获取多个文件信息
 * @param {Object} data 请求体
 * @param {string} data.fileIds 多个文件 id，格式为 '1,2,3'
 * @returns {Promise}
 */
export const getMore = data => http.request({
  url: '/file/file/getMore',
  method: 'GET',
  data
})

/**
 * 使用小程序选择出来的文件路径进行单个文件上传(需要封装成小程序原生)
 * @param {string} filePath 小程序选择文件接口返回的临时路径
 * @returns {Object} 后端返回的文件信息
 */
export const fileUpload = async filePath => {
  uni.showLoading({ title: '上传中' })
  let [err, res] = await uni.uploadFile({
    url: process.env.VUE_APP_BASE_API + '/file/file/upload',
    filePath,
    name: 'file'
  })
  if (err || !res) {
    uni.hideLoading()
    uni.showToast({ icon: 'error', title: '上传失败' })
    throw new Error('上传失败')
  }
  uni.hideLoading()
  uni.showToast({ icon: 'success', title: '上传成功' })
  res = JSON.parse(res.data)
  const file = type.obj(res.data) ? res.data : {}
  return file
}
