function dydebounce(fn, delay, immediate = false) {
    let timer = null
    let isInvoke = false

    const _debounce = function(...args) {
        return new Promise((resolve, reject) => {
            try {
                if (timer) clearTimeout(timer)

                let res = undefined
                if (immediate && !isInvoke) {
                    res = fn.apply(this, args)
                    resolve(res)
                    isInvoke = true
                    return
                }

                timer = setTimeout(() => {
                    res = fn.apply(this, args)
                    resolve(res)
                    timer = null
                    isInvoke = false
                }, delay)
            } catch (error) {
                reject(error)
            }
        })
    }

    _debounce.cancel = function() {
        if (timer) clearTimeout(timer)
        timer = null
        isInvoke = false
    }

    return _debounce
}