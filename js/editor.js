var Path   = Isomer.Path,
    Point  = Isomer.Point,
    Color  = Isomer.Color,
    Shape  = Isomer.Shape,
    Canvas = Isomer.Canvas;

var editor   = document.getElementById("editor"),
    iso      = new Isomer(editor),
    canvas   = new Canvas(editor);

var model = [];

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
        model.push(level);
    }
    return model;
}

function drawGrid(tilesPerRow, tilesPerCol) {
    for(var y=0; y < tilesPerRow; y++) {
        for(var x=0; x < tilesPerCol; x++) {
            var point = new Point (x, y, 0);
            iso.add(Shape.Prism(point, 1, 1, 0.1), new Color(200, 200, 200, 0.5));
        }
    }
}

function setupControl(tilesPerRow, tilesPerCol) {
    var controlContainer = document.getElementById("control");
    for(var y=0; y < tilesPerRow; y++) {
        var rowControl = document.createElement("div");
        for(var x=0; x < tilesPerCol; x++) {
            (function(tx, ty, row) {
                var controlTile = document.createElement("div");
                controlTile.className = "controlTile";
                controlTile.addEventListener("click", function() {
                    console.log("Tile " + tx + ", " + ty);
                    model[0][tx][ty] = !model[0][tx][ty];
                    if(model[0][tx][ty]) {
                        this.classList.add("set"); 
                    } else {
                        this.classList.remove("set");
                    }
                }, false);
                row.appendChild(controlTile);
            })(x, y, rowControl);
        }
        controlContainer.appendChild(rowControl);
    }
}

function render() {
    canvas.clear();
    drawGrid(10, 10);
    for(var y=9;y >= 0; y--) {
        for(var x=9; x >= 0; x--) {
            if(model[0][x][9-y]) {
                var point = new Point(x, y, 0);
                iso.add(Shape.Prism(point, 1, 1, 1), new Color(200, 200, 200));
            }
        }
    }
    
    requestAnimationFrame(render);
}

setupControl(10, 10);
initModel(10,10,10);
render();