class GreedySnake {
    constructor(props) {
        this.x = props.x
        this.y = props.y
        this.snake = props.snake
    }

    generateSquare() {
        let x = this.x
        let y = this.y
        let s = []
        for (let i = 0; i < y; i++) {
            let r = []
            for (let j = 0; j < x; j++) {
                r.push(0)
            }
            s.push(r)
        }
        this.square = s
    }

    templateCell(line, y) {
        let template = `<div class="row clearfix">`
        for (let i = 0; i < line.length; i++) {
            let e = line[i]
            let t = `
                <div class="cell" data-number="${e}" data-x="${i + 1}" data-y="${y + 1}">${e}</div>
            `
            template += t
        }
        template += `</div>`
        return template
    }

    templateRow() {
        log(this)
        let s = this.square
        let t = ``
        for (let i = 0; i < s.length; i++) {
            let l = s[i]
            let line = this.templateCell(l, i)
            t += line
        }
        return t
    }

    renderSquare() {
        let html = this.templateRow()
        let container = e('#id-div-mime')
        container.insertAdjacentHTML('beforeend', html)
    }

    renderSnake() {
        let cs = es('.cell')
        for (let i = 0; i < cs.length; i++) {
            let c = cs[i]
            if (getElementData(c, 'number', 0) === '1') {
                setElementData(c, 'number', 0)
            }
        }

        let s = this.snake
        for (let i = 0; i < s.length; i++) {
            let cell = s[i]
            let x = cell[0]
            let y = cell[1]
            let c = e(`[data-x="${x}"][data-y="${y}"]`)
            if (c) {
                setElementData(c, 'number', 1)
            } else {
                this.stop()
            }
        }
    }

    run() {
        let run = setInterval(() => {
            this.changeSnakeArrByDirecation()
            this.renderSnake()
        }, 180)

        let run2 = setInterval(() => {
            let cs = es('.cell')
            for (let i = 0; i < cs.length; i++) {
                let c = cs[i]
                if (getElementData(c, 'number', 0) === '2') {
                    setElementData(c, 'number', 0)
                }
            }
            this.generateLife()
        }, 2500)

        this.running = [run, run2]
    }

    stop() {
        for (let i = 0; i < this.running.length; i++) {
            let r = this.running[i]
            window.clearInterval(r)
        }
        this.running = false
        alert('游戏结束')
        let [x, y] = this.snake[1]
        let c = e(`[data-x="${x}"][data-y="${y}"]`)
        transition(c, [
            {
                name: 'highlight',
                destroy: true,
            },
        ])
    }

    handleRun() {
        if (this.running) {
            log('running')
            for (let i = 0; i < this.running.length; i++) {
                let r = this.running[i]
                window.clearInterval(r)
            }
            this.running = false
        } else {
            this.run()
        }
    }

    bindRunEvent() {
        bindEvent(e('body'), 'keydown', (e) => {
            if (e.key === ' ') {
                this.handleRun()
            }
        })
    }

    action() {
        let actions = {
            w: () => {
                let oldFirst = this.snake[0]
                let newFirst = [oldFirst[0], oldFirst[1] - 1]
                this.snake.unshift(newFirst)
                this.collisionDetection()
                this.snake.pop()
            },
            a: () => {
                let oldFirst = this.snake[0]
                let newFirst = [oldFirst[0] - 1, oldFirst[1]]
                this.snake.unshift(newFirst)
                this.collisionDetection()
                this.snake.pop()
            },
            d: () => {
                let oldFirst = this.snake[0]
                let newFirst = [oldFirst[0] + 1, oldFirst[1]]
                this.snake.unshift(newFirst)
                this.collisionDetection()
                this.snake.pop()
            },
            s: () => {
                let oldFirst = this.snake[0]
                let newFirst = [oldFirst[0], oldFirst[1] + 1]
                this.snake.unshift(newFirst)
                this.collisionDetection()
                this.snake.pop()
            },
        }
        return o[this.direction]
    }

    changeSnakeArrByDirecation() {
        let action = this.action()
        action()
    }

    bindChangeDirecationEvents() {
        bindEvent(e('body'), 'keydown', (e) => {
            if (e.key === 'w' || e.key === 'a' || e.key === 'd' || e.key === 's') {
                this.direction = e.key
            }
        })
    }

    getRandomXy() {
        let x = Math.floor(Math.random() * (2 - this.x + 2)) + this.x
        let y = Math.floor(Math.random() * (2 - this.y + 2)) + this.y
        let ss = this.snake
        let d = equals(ss, [x, y])
        if (!d) {
            let xy = this.getRandomXy()
            return xy
        } else {
            return [x, y]
        }
    }

    generateLife() {
        let xy = this.getRandomXy()
        let c = e(`[data-x="${xy[0]}"][data-y="${xy[1]}"]`)
        this.life = xy
        setElementData(c, 'number', 2)
        setTimeout(() => {
            transition(c, [
                {
                    name: 'highlight',
                    destroy: true,
                },
            ])
        }, 1500)
    }

    collisionDetection() {
        let first = this.snake[0]

        let life = this.life
        if (first[0] === life[0] && first[1] === life[1]) {
            let end = this.snake[this.snake.length - 1]
            let d = this.direction
            if (d === 'w') {
                this.snake.push([end[0], end[1] + 1])
            } else if (d === 's') {
                this.snake.push([end[0], end[1] - 1])
            } else if (d === 'a') {
                this.snake.push([end[0] + 1, end[1]])
            } else if (d === 'd') {
                this.snake.push([end[0] - 1, end[1]])
            }
            let [x, y] = life

            let c = e(`[data-x="${x}"][data-y="${y}"]`)
            c.classList.remove('highlight')
        }
    }

    setup() {
        this.direction = 'w'
        // 根据 props 里的 x y 生成一个 x * y 的二维数组
        this.generateSquare()
        // 将上一步获得的二维数组渲染出来
        this.renderSquare()
        // 渲染蛇
        this.renderSnake()
        // 生成生命值
        this.generateLife()
        // 绑定开始事件
        this.bindRunEvent()
        // 绑定改变方向的事件
        this.bindChangeDirecationEvents()
    }
}

const __main = () => {
    // 画布的 x, 画布的 y, 蛇的初始坐标
    let props = {
        x: 15,
        y: 15,
        snake: [
            [11, 11],
            [11, 12],
            [11, 13],
            [11, 14],
        ],
    }
    let 贪吃蛇 = new GreedySnake(props)
    // 运行程序
    贪吃蛇.setup()
}

__main()
