var Path   = Isomer.Path,
    Point  = Isomer.Point,
    Color  = Isomer.Color,
    Shape  = Isomer.Shape,
    Canvas = Isomer.Canvas;

var editor   = document.getElementById("editor"),
    iso      = new Isomer(editor),
    canvas   = new Canvas(editor);

var ROWS   = 10,
    COLS   = 10,
    LEVELS = 10;

var Model = [], Controls = [], CurrentLayer = 0;
var link = document.getElementById("link");

function initModel(rows, cols, levels) {
    for(var lvl=0; lvl < levels; lvl++) {
        var level = [];
        for(var r=0; r < rows; r++) {
            var row = [];
            for(var c=0; c < cols; c++) {
                row.push(false);
            }
            level.push(row);
        }
        Model.push(level);
    }
    return Model;
}

function drawGrid(tilesPerRow, tilesPerCol) {
    for(var y=0; y < tilesPerRow; y++) {
        for(var x=0; x < tilesPerCol; x++) {
            var point = new Point (x, y, CurrentLayer);
            iso.add(Shape.Prism(point, 1, 1, 0.1), new Color(200, 200, 200, 0.5));
        }
    }
}

function setupControl(tilesPerRow, tilesPerCol) {
    var controlContainer = document.getElementById("control");
    for(var y=0; y < tilesPerRow; y++) {
        var rowControl = document.createElement("div");
        var controlsInRow = [];
        for(var x=0; x < tilesPerCol; x++) {
            (function(tx, ty, row) {
                var controlTile = document.createElement("div");
                controlsInRow.push(controlTile);
                controlTile.className = "controlTile";
                controlTile.addEventListener("click", function() {
                    Model[CurrentLayer][tx][ty] = !Model[CurrentLayer][tx][ty];
                    if(Model[CurrentLayer][tx][ty]) {
                        this.classList.add("set"); 
                    } else {
                        this.classList.remove("set");
                    }
                    
                    window.location.hash = saveModel2String();
                    link.href            = window.location.href;
                }, false);
                row.appendChild(controlTile);
            })(x, y, rowControl);
        }
        Controls.push(controlsInRow);
        controlContainer.appendChild(rowControl);
    }
}

function render() {
    canvas.clear();
    iso.add(Shape.Prism(Point.ORIGIN, COLS, ROWS, LEVELS), new Color(200, 200, 200, 0.1))
    for(var z=0; z < LEVELS; z++) {
        if(z == CurrentLayer) {
            drawGrid(COLS, ROWS);
        }

        for(var y=ROWS-1;y >= 0; y--) {
            for(var x=COLS-1; x >= 0; x--) {
                if(Model[z][x][COLS-1-y]) {
                    var point = new Point(x, y, z);
                    iso.add(Shape.Prism(point, 1, 1, 1), new Color(0, 180, 0));
                }
            }
        }
    }

    requestAnimationFrame(render);
}

function updateControls(level) {
    for(var y=0;y < ROWS; y++) {
        for(var x=0; x < COLS; x++) {
            if(Model[level][y][x] && !Controls[x][y].classList.contains("set")) {
                Controls[x][y].classList.add("set");
            } else if(!Model[level][y][x] && Controls[x][y].classList.contains("set")) {
                Controls[x][y].classList.remove("set");
            }
        }
    }
}

function saveModel2String() {
    var result = "";
    for(var lvl=0; lvl < LEVELS; lvl++) {
        for(var y=0;y < COLS; y++) {
            for(var x=0; x < ROWS; x++) {
                result += (Model[lvl][x][y] ? "1" : "0");
            }
        }
    }
    
    return result;
}

function loadString2Model(serializedModel) {
    for(var lvl=0; lvl < LEVELS; lvl++) {
        for(var y=0;y < COLS; y++) {
            for(var x=0; x < ROWS; x++) {
                Model[lvl][x][y] = serializedModel[lvl *(COLS * ROWS) + y * COLS + x] === "1";
            }
        }
    }
}

function clear() {
    window.location.hash = "";
    for(var lvl=0; lvl < LEVELS; lvl++) {
        for(var y=0;y < COLS; y++) {
            for(var x=0; x < ROWS; x++) {
                Model[lvl][x][y] = false;
            }
        }
    }
}

setupControl(ROWS, COLS);
initModel(ROWS, COLS, LEVELS);
if(window.location.hash) {
    loadString2Model(window.location.hash.substr(1));
    updateControls(CurrentLayer);
}
render();

function getLayerChangeHandler(moveBy) {
    return function(e) {
        CurrentLayer += moveBy;

        if(CurrentLayer < 0) CurrentLayer = 0;
        else if(CurrentLayer >= LEVELS) CurrentLayer = LEVELS-1;

        updateControls(CurrentLayer);

        e.stopPropagation();
        return false;
    }
}

document.getElementById("layerUp"  ).addEventListener("click", getLayerChangeHandler( 1), false);
document.getElementById("layerDown").addEventListener("click", getLayerChangeHandler(-1), false);

document.getElementById("clear").addEventListener("click", function() {
    if(window.confirm("Really clear the workspace?")) {
        clear();
        updateControls(CurrentLayer);
    }
});