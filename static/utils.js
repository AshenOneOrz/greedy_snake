const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)
const es = (selector) => document.querySelectorAll(selector)

const bindEvent = (element, eventName, callBack) => {
    element.addEventListener(eventName, callBack)
}

const handleClass = (element, className) => {
    const l = element.classList
    if (l.value.includes(className)) {
        // 删除
        l.remove(className)
    } else {
        l.add(className)
    }
}

const setElementData = (element, key, value) => {
    element.dataset[key] = value
}

const getElementData = (element, key) => {
    return element.dataset[key]
}

const equals = (a1, a2) => {
    for (let i = 0; i < a1.length; i++) {
        const a = a1[i]
        if (a[0] === a2[0] && a[1] === a2[1]) {
            return false
        }
    }
    return true
}

const transition = (element, classList, duration = 1000) => {
    const cl = classList
    const e = element
    for (let i = 0; i < cl.length; i++) {
        const c = cl[i]
        if (e.classList) {
            e.classList.add(c.name)

            if (c.destroy) {
                setTimeout(() => {
                    e.classList.remove(c.name)
                }, duration)
            }
        }
    }
}
