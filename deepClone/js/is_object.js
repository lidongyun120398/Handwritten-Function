// 判断一个标识符是否是对象类型
function isObject(value) {
    const valueType = typeof value
    return (value !== null) && (valueType === 'object' || valueType === 'function')
}