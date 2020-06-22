let field;
let size;
let run;
let showNeighbours;
let fieldSize;
let fr;

/*
1. Cells with less then 2 neighbours die
2. Dead cell with 3 live neighbours become alive
3. Cells with more then 3 neighbours die
*/

setup = () => {
    initCanvas()
    fRate = 15;
    field = [];
    run = false;
    showNeighbours = false;
    posRunBtn = { x: fieldWidth + 50, y: 100 }
    posNeighboursBtn = { x: fieldWidth + 50, y: 130 }

    posIncFrmRtBtn = { x: fieldWidth + 50, y: 160 }
    posDecFrmRtBtn = { x: fieldWidth + 50, y: 190 }

    for (let y = 0; y < size; y++) {
        field.push([])
        for (let x = 0; x < size; x++) {
            //            field[y].push(random([true, false]))
            field[y].push(false)
        }
    }
    frameRate(fRate)

    button = createButton('Run');
    button.position(posRunBtn.x, posRunBtn.y);
    button.mousePressed(() => {
        run = !run
    });

    button = createButton('Show');
    button.position(posNeighboursBtn.x, posNeighboursBtn.y);
    button.mousePressed(() => {
        showNeighbours = !showNeighbours
    });

    button = createButton('+');
    button.position(posIncFrmRtBtn.x, posIncFrmRtBtn.y);
    button.mousePressed(() => {
        changeFrameRate(1)
    });

    button = createButton('-');
    button.position(posDecFrmRtBtn.x, posDecFrmRtBtn.y);
    button.mousePressed(() => {
        changeFrameRate(-1)
    });
}

changeFrameRate = (v) => {
    fRate = fRate + v >= 5 ? fRate + v : fRrate
    frameRate(fRate)
}

draw = () => {
    background(220);
    drawField(field)
    const updates = calcUpdate(field)
    if (run) {
        updates.map(c => {
            field[c.y][c.x] = c.state
        })
    }

    stroke(255)
    fill(0)
    text(run, posRunBtn.x + 50, posRunBtn.y + 5)
    text(showNeighbours, posNeighboursBtn.x + 50, posNeighboursBtn.y + 5)
    text(`Framerate: ${fRate}`, posIncFrmRtBtn.x + 30, posIncFrmRtBtn.y + 15)
}

initCanvas = () => {
    fieldSize = 15
    fieldWidth = window.innerWidth * 0.4
    fieldHeight = fieldWidth
    size = fieldWidth / fieldSize
    let canvas = createCanvas(size * 20, size * fieldSize);
    canvas.parent('sketch-holder');
}

test1 = () => {
    field[1][3] = true
    field[1][4] = true
    field[1][5] = true

    let x = numNeighbours(field, 4, 1)
    console.log(x)
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
    const fW = fieldWidth / size
    const fH = fieldHeight / size

    let updates = []

    for (let y = 0; y < f.length; y++) {
        for (let x = 0; x < f[y].length; x++) {
            let nn = numNeighbours(f, x, y)
            stroke(255, 0, 0)
            if (showNeighbours && nn !== 0) {
                fill(255)
                stroke(0)
                text(nn, (x * fW) + 2, (y * fH) + fieldSize - 2)
            }

            let state = f[y][x];
            if (f[y][x]) { // alive
                if (nn < 2) {
                    state = false
                }
                if (nn > 3) {
                    state = false
                }
            } else { // dead 
                if (nn === 3) {
                    state = true
                }
            }

            updates.push({ x: x, y: y, state: state })
        }
    }
    return updates
}

drawField = (f) => {
    let w = fieldWidth / size
    let h = fieldHeight / size
    for (let y = 0; y < f.length; y++) {
        for (let x = 0; x < f[y].length; x++) {
            noStroke()
            if (field[y][x]) {
                fill(0)
            } else {
                fill(255)
            }

            rect(x * w, y * h, w, h)
        }
    }
}

getFieldFromMouse = () => {
    const x = Math.floor(mouseX / (fieldWidth / size))
    const y = Math.floor(mouseY / (fieldHeight / size))
    return { x: x, y: y }
}

mouseClicked = () => {
    if (mouseX < fieldWidth && mouseY < fieldHeight) {
        const pos = getFieldFromMouse()
        field[pos.y][pos.x] = true
    }
}