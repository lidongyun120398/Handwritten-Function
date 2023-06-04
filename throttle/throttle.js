function dythrottle(fn, interval, {
    leading = true,
    trailing = true
} = {}) {
    let startTime = 0
    let timer = null

    const _throttle = function(...args) {
        return new Promise((resolve, reject) => {
            try {
                const nowTime = new Date().getTime()
                let res = undefined

                //对立即执行进行控制
                if (!leading && startTime === 0) {
                    startTime = nowTime
                }

                const waitTime = interval - (nowTime - startTime)
                if (waitTime <= 0) {
                    if (timer) clearTimeout(timer)
                    res = fn.apply(this, args)
                    resolve(res)
                    startTime = nowTime
                    timer = null
                    return
                }

                //尾部执行
                if (trailing && !timer) {
                    timer = setTimeout(() => {
                        res = fn.apply(this, args)
                        resolve(res)
                        startTime = new Date().getTime()
                        timer = null
                    }, waitTime)
                }
            } catch (error) {
                reject(error)
            }
        })

    }

    _throttle.cancel = function() {
        if (timer) clearTimeout(timer)
        startTime = 0
        timer = null
    }

    return _throttle
}