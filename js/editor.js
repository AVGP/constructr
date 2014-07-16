var Path   = Isomer.Path,
    Point  = Isomer.Point,
    Color  = Isomer.Color,
    Shape  = Isomer.Shape,
    Canvas = Isomer.Canvas;

var editor   = document.getElementById("editor"),
    iso      = new Isomer(editor),
    renderer = { isomer: iso, path: Path, color: Color, shape: Shape, canvas: Canvas, point: Point };
    canvas   = new Canvas(editor);

function drawGrid(render, tilesPerRow, tilesPerCol) {
    for(var y=0; y < tilesPerRow; y++) {
        for(var x=0; x < tilesPerCol; x++) {
            var point = new render.point (x, y, 0);
            render.isomer.add(render.shape.Prism(point, 1, 1, 0.1), new render.color(200, 200, 200, 0.5));
        }
    }
}

function setupControl(render, tilesPerRow, tilesPerCol) {
    var controlContainer = document.getElementById("control");
    for(var y=0; y < tilesPerRow; y++) {
        var rowControl = document.createElement("div");
        for(var x=0; x < tilesPerCol; x++) {
            (function(tx, ty, row) {
                var controlTile = document.createElement("div");
                controlTile.className = "controlTile";
                controlTile.onclick = function() {
                    console.log("Tile " + tx + ", " + ty);
                    var point = new render.point(tx, ty, 0);
                    render.isomer.add(render.shape.Prism(point, 1, 1, 1), new render.color(200, 200, 200));
                }
                row.appendChild(controlTile);
            })(x, y, rowControl);
        }
        controlContainer.appendChild(rowControl);
    }
}

drawGrid(renderer, 10, 10);
setupControl(renderer, 10, 10);