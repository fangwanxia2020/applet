import { getDicts } from '@/api/dict'
import { type } from './verification'

/**
 * 将传入的列表格式化成一个 { [key: string]: *; [value: string]: *; } 形式的对象
 * @param {Object[]} data 传入的列表
 * @param {string} label 源列表项标签属性名
 * @param {string} value 源列表项值属性名
 * @param {string} [labelName] 返回的列表项标签属性名
 * @param {string} [valueName] 返回的列表项值属性名
 * @returns {Object[]} 格式化后的列表项
 */
export function getOptions(
  data,
  label,
  value,
  labelName = 'label',
  valueName = 'value'
) {
  return data.map((option) => ({
    ...option,
    [labelName]: option[label],
    [valueName]: option[value],
  }))
}

/**
 * 根据传入选项值翻译选项标签
 * @param {Object[]} options 选项
 * @param {number|string} value 传入值
 * @return {string} 选项对应的标签名
 */
export function getOptionLabel(options, value) {
  const option = options.find((option) => option.value == value);
  const { label } = type.obj(option) ? option : {}
  return label ? label : ''
}

/**
 * 翻译数据字典
 * @param {Object[]} dicts 字典
 * @param {string|number} dictValue 传入的字典值
 * @returns {string} 字典名
 */
export function selectDictLabel(dicts, dictValue) {
  const dict = dicts.find(dict => dict.dictValue == dictValue)
  return dict ? dict.dictLabel : ''
}

/**
 * 批量获取字典
 * @param {string[]} dictTypes 多个字典数据
 * @returns {Object[]} 按传入字典数据顺序返回的字典数组
 */
export async function getDictMultiple(dictTypes) {
  const dictTypesList = dictTypes.map((dictType) => getDicts(dictType))
  const resList = await Promise.all(dictTypesList)
  const dict = {}
  dictTypes.forEach(
    (dictType, index) => (dict[dictType] = resList[index].data)
  )
  return dict
}

/**
 * 组装扁平化树形数据
 * @param {Object[]} data 数据源
 * @param {string} [id='id'] id 字段名
 * @param {string} [parentId='parentId'] 父节点字段名
 * @param {string} [children='children'] 子节点字段名
 * @param {number} [rootId=0] 根 id
 * @returns {Object[]} 组装后的树形数据
 */
export function handleTree(
  data,
  id = 'id',
  parentId = 'parentId',
  children = 'children',
  rootId = 0
) {
  data = type.arr(data) ? data : []
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })

    if (branchArr.length) {
      father[children] = branchArr
    }

    // 返回第一层
    return father[parentId] === rootId
  })

  return treeData && treeData.length ? treeData : data
}

/**
 * 格式化树形数据
 * @param {Object[]} treeData 传入的树形数据
 * @param {Object} option 配置项
 * @param {number} [option.level] 限制树形返回多少层子级
 * @param {string} [option.levelName] 原始树形节点的层级标识
 * @param {string} [option.idName] 原始树形节点唯一标识属性名
 * @param {string} [option.oLabel] 原始树形节点的标签属性名
 * @param {string} [option.oValue] 原始树形节点的值属性名
 * @param {string} [option.label] 定义返回树形节点的标签属性名
 * @param {string} [option.value] 定义返回树形节点的值属性名
 * @param {string} [option.childrenName] 定义返回树形节点的子节点属性名
 * @returns {Object[]} 格式化后的树形数据
 */
export function getTreeOptions(treeData, {
  level = null,
  levelName = 'type',
  idName = 'originalId',
  oLabel = 'data',
  oValue = 'id',
  label = 'label',
  value = 'value',
  childrenName = 'children'
} = {}) {
  /**
   * 递归函数
   * @param {Object[]} treeData 传入的树形数据
   * @param {number} recursiveLevel 递归层级
   * @returns {Object[]} 格式化后的树形数据
   */
  const fn = (treeData, recursiveLevel = 1) => {
    const treeOptions = treeData.map((treeOption, index) => {
      const children = treeOption[childrenName]
      const isEmptyChildrenOrEndLevel = (
        level &&
        recursiveLevel < level &&
        (!children || !children.length)
      )
      const isEmptyChildrenOrEnd = (
        level === recursiveLevel ||
        level === children[levelName] ||
        !children ||
        !children.length
      )
      const hasChildren = type.arr(children) && children.length

      if (isEmptyChildrenOrEndLevel) {
        // 传入了层级限制之后如果在最终层级之前就没有子元素了则给个空数组，使树形选择组件不能选择这项
        treeOption[childrenName] = []
      } else if (isEmptyChildrenOrEnd) {
        delete treeOption[childrenName]
      } else if (hasChildren) {
        treeOption[childrenName] = fn(children, recursiveLevel + 1)
      }

      if (!treeOption[idName]) {
        // 如果没有唯一标识则定义一个唯一标识
        treeOption[idName] = 'id_' + Date.now() + index
      } else {
        treeOption[idName] = treeOption[idName].toString()
      }

      // 修改输出的数据标签与值的属性名
      treeOption[label] = treeOption[oLabel]
      treeOption[value] = treeOption[oValue]

      return treeOption
    })

    return treeOptions
  }

  return fn(treeData, 1)
}

/**
 * 返回树形选项的第一个遍历到底的节点值
 * @param {Object[]} treeData 传入的树形数据
 * @param {Object} [option] 配置项
 * @param {string} [option.value] 树形节点的值属性名
 * @param {string} [option.children] 树形节点的子节点属性名
 * @returns {*} 节点值
 */
export function getTreeOptionsDefaultValue(treeData, option) {
  const { value, children } = {
    value: 'value',
    children: 'children',
    ...option,
  }
  for (const node of treeData) {
    const nodeChildren = node[children]
    if (!type.arr(nodeChildren)) {
      return node[value]
    } else {
      return getTreeOptionsDefaultValue(nodeChildren, option)
    }
  }
}

/**
 * 判断是否为空值
 * @param {*} value 传入值
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (['', undefined, null].includes(value)) {
    return true
  }

  if (type.str(value)) {
    return value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0
  }

  if (type.num(value)) {
    return isNaN(value)
  }

  if (type.obj(value) || type.arr(value)) {
    return ['[]', '{}'].includes(JSON.stringify(value))
  }

  return false
}

/**
 * 获取导航路径，主要用于 navigator 标签
 * @param {string} path 导航基路径
 * @param {Object} params 路径参数
 * @returns {string} 格式化后的全路径
 * @example <caption>用法</caption>
 * const navUrl = getNavUrl('/pages/index/index', { a: 12, b: 'dsadas' })
 */
export function getNavUrl(path, params) {
  const pairs = []
  Object.entries(params).forEach(([key, value], index) => {
    const pair = `${index === 0 ? '?' : ''}${key}=${value}`
    pairs.push(pair)
  })
  return path + pairs.join('&')
}

export function getTime(){
	let date = new Date();
	let year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
	let month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
	let day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
	let hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
	let minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
	// let seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)   
	//获取当前系统时间  
	let currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes
	// alert(currentDate);
	//修改月份格式
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	//修改日期格式
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	//修改小时格式
	if (hours >= 0 && hours <= 9) {
		hours = "0" + hours;
	}
	//修改分钟格式
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	//获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
	var currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes
	return currentFormatDate;
}