/**
 * 数据字典
 * @module api/dict
 */
const { http } = uni.$u

/** 根据字典类型查询字典数据信息 */
export const getDicts = dictType => http.request({
  url: `/basic/system/dict/data/dictType/${dictType}`,
  method: 'GET'
})
