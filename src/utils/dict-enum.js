/**
 * 字典枚举模块
 * @module dict-enum
 */

/**
 * 用户类型
 * @readonly
 * @enum {number}
 */
export const USER_TYPE = {
  /** PC 用户 */
  PC: 1,
  /** 家长端小程序用户 */
  PARENTS: 2,
  /** 教师端小程序用户 */
  TEACHER: 3,
  /** 导师端小程序用户 */
  TUTOR: 4,
  /** 开发者 */
  DEVELOPER: 5
}

/**
 * 性别
 * @readonly
 * @enum {number}
 */
export const GENDER = {
  /** 男 */
  MALE: 0,
  /** 女 */
  FEMALE: 1,
  /** 未知 */
  UNKNOWN: 2,
  get options() {
    return [
      {
        label: '男',
        value: this.MALE
      },
      {
        label: '女',
        value: this.FEMALE
      },
      {
        label: '未知',
        value: this.UNKNOWN
      }
    ]
  }
}

/**
 * 任务状态
 * @readonly
 * @enum {number}
 */
export const TASK_STATUS = {
  /** 待办 */
  TODO: 0,
  /** 进行中 */
  PROCESSING: 1,
  /** 已办 */
  DONE: 2
}

/**
 * 巡检项状态
 * @readonly
 * @enum {number}
 */
export const CHECK_STATUS = {
  /** 正常 */
  NORMAL: 0,
  /** 检修 */
  SERVICE: 1,
  /** 备用 */
  RESERVE: 2,
  /** 跳过 */
  SKIP: 3,
  /** 停车 */
  PARK: 4
}
