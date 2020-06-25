let field;
let size;
let run;
let showNeighbours;
let fieldSize;
let fr;
let iter;
let fRate;
let scoreLog;
let score;
let runBest;

let bestField;

/*
1. Cells with less then 2 neighbours die
2. Dead cell with 3 live neighbours become alive
3. Cells with more then 3 neighbours die
*/

setup = () => {
    size = 75;
    field = initField()
    initCanvas()
    fRate = 120;
    runBest = false;
    run = true;
    iter = 0;
    showNeighbours = 0;
    score = 0;

    frameRate(fRate)
    initButtons()
    initRound()
    background(255);
    scoreLog = []

    bestField = { score: 0, field: null }
}

draw = () => {


    if (run) {
        const updates = calcUpdate(field)
        updates.map(c => {
            field[c.y][c.x] = c.state
        })
        iter += 1
        analytics(iter)
        drawField(field)
        drawMenu()
    }
}



analytics = (iter) => {

    const roundLength = 250

    if (iter % roundLength === 0) { // new round
        if (iter > 0) {
            if (score > bestField.score) {
                bestField.score = score
                // add deep copy for initial field
                bestField.field = field
            }

            if (scoreLog[scoreLog.length - 1]) {
                scoreLog[scoreLog.length - 1].score = score
            }
        }
        score = 0

        field = resetField()
        if (runBest) {
            field = bestField.field
        } else {

            const cPos = []
            cPos.push(center())

            // add new entry
            scoreLog.push({ pos: cPos, score: 0 })
            cPos.map(position => {
                addCluster(random(["red", "blue"]), position, 15)
            })
        }

    }

    iter = iter % 1000 === 0 ? 0 : iter + 1;
    //field = rip()? initField() :field
}

addCluster = (color, position, n) => {
    for (let i = -n; i < n; i++) {
        for (let j = -n; j < n; j++) {
            if (field[position.y + i] && field[position.y + i][position.x + j] !== null) {
                if (random() > 0.8) {
                    field[position.y + i][position.x + j] = color
                }
            }
        }
    }
}

rip = () => {
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field.length; y++) {
            if (field[x][y]) {
                return false
            }
        }
    }
    return true
}

anyX = (el) => {
    el.some()
}

initField = () => {
    const tmp = [];
    for (let x = 0; x < size; x++) {
        tmp.push([])
        for (let y = 0; y < size; y++) {
            tmp[x].push(random(["blue", false, "red"]))
        }
    }
    return tmp
}

resetField = () => {
    const tmp = [];
    for (let x = 0; x < size; x++) {
        tmp.push([])
        for (let y = 0; y < size; y++) {
            tmp[x].push(false)
        }
    }
    return tmp
}

randCenter = () => {
    const x = rRange(0, field.length)
    const y = rRange(0, field[0].length)
    return { x: x, y: y }
}

center = () => {
    return { x: Math.floor(field.length / 2), y: Math.floor(field[0].length / 2) }
}

changeFrameRate = (v) => {
    fRate = fRate + v >= 5 ? fRate + v : fRate
    frameRate(fRate)
}

initRound = () => {

    const w = field.length - 1
    const h = field[0].length - 1

    const randX = int(random(w))
    const randY = int(random(h))

    let n = 50;
    let i = 0
    while (i < n) {
        try {
            field[randY][randX] = 1
        }
        catch (e) {
            //console.log(field[randY])
            console.log(e)
        }
        i += 1;
    }

}

initCanvas = () => {
    //    let canvas = createCanvas(window.innerWidth-100,window.innerHeight-100);
    let canvas = createCanvas(700, 700);
    canvas.parent('sketch-holder');
}

numNeighbours = (f, x, y) => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            } else {
                if (f[y + i] && f[y + i][x + j]) {
                    count += 1;
                }
            }
        }
    }
    return count
}



calcUpdate = (f) => {
    let updates = []
    for (let y = 0; y < f.length; y++) {
        for (let x = 0; x < f[y].length; x++) {
            let nn = numNeighbours(f, x, y)
            let state = f[y][x];
            if (f[y][x]) { // alive
                if (nn < 2) { // not enough neighbours
                    state = 0
                }
                if (nn > 3) { // too many neighbours
                    state = 0
                }
            } else { // dead 
                if (nn === 3) {
                    score += 1
                    state = getTypeFromNeighbours(f, x, y)
                }
            }
            updates.push({ x: x, y: y, state: state })
        }
    }
    return updates
}

getTypeFromNeighbours = (f, x, y) => {
    let c = new Map()
    c.set("blue", 0)
    c.set("red", 0)

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            } else {
                if (f[y + i] && f[y + i][x + j]) {
                    let s = f[y + i][x + j]
                    c.set(f[y + i][x + j], c.get(f[y + i][x + j]) + 1)
                }
            }
        }
    }
    return c.get("blue") >= c.get("red") ? "blue" : "red"
}

drawField = (f) => {
    for (let y = 0; y < f.length; y++) {
        for (let x = 0; x < f[y].length; x++) {
            noStroke()
            if (field[y][x] === "red") {
                fill(0, 255, 0)
            } else if (field[y][x] === "blue") {
                fill(255, 0, 0)
            } else {

                fill(255, 255, 255)
            }


            const w = Math.floor(height / size)
            const h = Math.floor(height / size)
            rect(x * w, y * h, w, h)
        }
    }
}

getFieldFromMouse = () => {
    const x = Math.floor(mouseX / (width / size))
    const y = Math.floor(mouseY / (height / size))
    return { x: x, y: y }
}

mouseClicked = () => {
    if (mouseX < width && mouseY < height) {
        const pos = getFieldFromMouse()
        addCluster(random(["red", "blue"]), pos, 10)
    }
}

initButtons = () => {


    posRunBtn = { x: width + 20, y: 100 }
    frameRatePlus = { x: width + 20, y: 160 }
    frameRateMinus = { x: width + 20, y: 190 }
    runBestBtn = { x: width + 20, y: 220 }

    button = createButton('Run');
    button.position(posRunBtn.x, posRunBtn.y);
    button.mousePressed(() => {
        run = !run
    });

    button = createButton('+');
    button.position(frameRatePlus.x, frameRatePlus.y);
    button.mousePressed(() => {
        // background(255)
        changeFrameRate(1)
    });

    button = createButton('-');
    button.position(frameRateMinus.x, frameRateMinus.y);
    button.mousePressed(() => {
        // background(255)
        changeFrameRate(-1)
    });

    button = createButton('R');
    button.position(runBestBtn.x, runBestBtn.y);
    button.mousePressed(() => {
        runBest = !runBest
    });
}

rRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

test1 = () => {
    field[1][3] = 1
    field[1][4] = 1
    field[1][5] = 1
    let x = numNeighbours(field, 4, 1)
}

drawMenu = () => {
    push()
    translate(width - 220, 0)

    stroke(255)
    fill(0)
    rect(90, 0, 250, 110)
    stroke(0)
    fill(0)
    
    
    rect(100, 0, 250, 30)
    const progress = Math.floor((iter % 250) / 2.5)
    rect(100, 33, 250, 30)
    fill(0, 255, 0)
    rect(100, 35, progress, 15)
    fill(255)
    text(`Iteration: ${progress}`, 100, 60)
    text(`Score:    ${score}`, 100, 10)
    text(`BestScore:    ${bestField.score}`, 100, 25)
    
    
    text(`Run ${run}`, 100, 80)
    text(`Run Best ${runBest}`, 100, 100)
    text(`Framerate: ${fRate}`, frameRatePlus.x + 30, frameRatePlus.y + 15)
    pop()

}