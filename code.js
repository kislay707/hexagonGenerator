// main function to return all the vertices of hexagons
function hex(centre1, side, level) {
    if (level <= 0) {
        return;
    }

    var centrePoints = [centre1], verticesPoints = [], centre, curIndex = 0;
    for(let i = 0; i < level - 1; i++) { // calcuating all the centre coordinates of all the hexagons
        for (let j = curIndex, k = centrePoints.length; j < k; j++) {
            centre = centrePoints[curIndex];
            centrePoints = pushCentre(centrePoints, findPoints(centre, "infinite", Math.sqrt(3) * side));
            centrePoints = pushCentre(centrePoints, findPoints(centre, 1 / Math.sqrt(3), Math.sqrt(3) * side));
            centrePoints = pushCentre(centrePoints, findPoints(centre, -1 / Math.sqrt(3), Math.sqrt(3) * side));
            curIndex++;
        }
    }
    for (let i = 0; i< centrePoints.length; i++) {
        centre = centrePoints[i];
        verticesPoints = pushVertices(verticesPoints, findPoints(centre, 0, side), i);
        verticesPoints = pushVertices(verticesPoints, findPoints(centre, Math.sqrt(3), side), i);
        verticesPoints = pushVertices(verticesPoints, findPoints(centre, -Math.sqrt(3), side), i);
    }
    return verticesPoints;
}

// push vertices coordinates and mark them as existing if already pushed
function pushVertices(centrePoints, {p1, p2}, i) {
    var index = centrePoints.findIndex(p => p.x === p1.x && p.y === p1.y);
    if (index != -1) {
        p1.existed = true;
    }
    p1.id = i;
    centrePoints.push(p1);

    index = centrePoints.findIndex(p => p.x === p2.x && p.y === p2.y);
    if (index != -1) {
        p2.existed = true;
    }
    p2.id = i;
    centrePoints.push(p2);

    return centrePoints;
}

// push Centre coordinates if already not pushed
function pushCentre(centrePoints, {p1, p2}) {
    var index = centrePoints.findIndex(p => p.x === p1.x && p.y === p1.y);
    if (index === -1) {
        centrePoints.push(p1);
    }
    index = centrePoints.findIndex(p => p.x === p2.x && p.y === p2.y);
    if (index === -1) {
        centrePoints.push(p2);
    }
    return centrePoints;
}

/**
 * Find Points from a starting point at a given distance and a fixed slope
 * @param  p inital point on line
 * @param  m slope of line
 * @param  side distance from start point
 * @returns returns object of two points found on line
 */
function findPoints(p, m, side) {
    let p1, p2;
    if (m === "infinite") {
        p1 = {x: Math.round(p.x * 100) / 100, y: Math.round((p.y + side) * 100) / 100}, p2 = {x: Math.round(p.x * 100) / 100, y: Math.round((p.y - side) * 100) / 100};
    }  else {
        let dx = (side / Math.sqrt(1 + (m * m))); 
        let dy = m * dx;

        let a = p.x + dx;
        let b = p.y + dy;
        let c = p.x - dx;
        let d = p.y - dy;
        p1 = {x:  Math.round(a * 100) / 100, y: Math.round(b * 100) / 100 }, p2 = {x:  Math.round(c * 100) / 100, y:  Math.round(d * 100) / 100};
    }
    return {p1, p2};
}

/**
 * return disance between 2 points
 * @param  p1 first point
 * @param  p2 second point
 */
function distance(p1, p2) {
    let dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    return dist;
}

/**
 * checks if an edge is already drawn and adds it to list if not drawn
 * @param  p1 first point
 * @param  p2 second point
 * @param  alreadyDrawnEdge array containing list of all drawn edges
 */
function checkNotExisting(p1, p2, alreadyDrawnEdge) {
    var index = alreadyDrawnEdge.findIndex(edge => edge.x1 === p1.x && edge.x2 === p2.x && edge.y1 === p1.y && edge.y2 === p2.y);
    if (index === -1) {
        alreadyDrawnEdge.push({
            x1 : p1.x,
            x2 : p2.x,
            y1 : p1.y,
            y2 : p2.y
        })
        return true;
    }
    return false;
}

function drawEdges(points, side, ctx) {
    let alreadyDrawnEdge = [];
    for (var i = 0; i < points.length; i++) {
        for (var j = 1; j < 6, i+j < points.length; j++) {
            if (points[i].id !== points[i+j].id) {
                break;
            } else {
                if ((distance(points[i], points[i+j]) <= (side + 0.1) && distance(points[i], points[i+j]) >= side - 0.1)) {
                    let notExisting = checkNotExisting(points[i], points[i+j], alreadyDrawnEdge) && checkNotExisting(points[i + j], points[i], alreadyDrawnEdge);
                    if (!notExisting) {
                        break;
                    }
                    ctx.beginPath();
                    ctx.moveTo(points[i].x + 400, points[i].y + 400); // shifting canvas drawing by 400, 400
                    ctx.lineTo(points[i+j].x + 400, points[i+j].y + 400);
                    ctx.stroke();
                }
            }
        }
    }
}

// the vertices returned by hex function also have duplicate vertices in them
// the duplicate ones are marked with key 'existed' as 'true'
// this function can be called to get the actual vertices
var removeDupicatesVertices = (vertices) => {
    return vertices.filter(points => !points.existed );
}

var canvas,ctx;
var side = 50;
var level = 3;

function drawImage(centre, side, level){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var vertices= hex(centre, side, level) ;
    if (vertices) {
        drawEdges(vertices, side, ctx);
    }
}
drawImage({x: 5, y: 5}, side, level);