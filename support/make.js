//--------------------------------------------------------------------------------------------------------//
// Make sphere helper method
//--------------------------------------------------------------------------------------------------------//
function makeSphere(centre, radius, h, v, colour) {
    var vertexList = [], indexList = [];
    for (var i = 0; i <= v + 1; i++) {
        for (var j = 0; j <= h; j++) {
            var theta = 2 * Math.PI * j / h;
            var y = (i / v - 0.5) * 2;
            var r = Math.sqrt(1 - y * y);
            var x = Math.cos(theta) * r;
            var z = Math.sin(theta) * r;
            var point = [x, y, z];

            for (var k = 0; k < 3; k++)
                vertexList[vertexList.length] = point[k] * radius + centre[k];
            for (var k = 0; k < 3; k++)
                vertexList[vertexList.length] = point[k];
            for (var k = 0; k < 3; k++)
                vertexList[vertexList.length] = colour[k];

            vertexList[vertexList.length] = j / h;
            vertexList[vertexList.length] = i / v;
        }
    }

    for (var i = 0; i < v; i++) {
        for (var j = 0; j < h; j++) {
            indexList[indexList.length] = i * h + j;
            indexList[indexList.length] = (i + 1) * h + (j + 1) % h;
            indexList[indexList.length] = i * h + (j + 1) % h;
            indexList[indexList.length] = i * h + j;
            indexList[indexList.length] = (i + 1) * h + j;
            indexList[indexList.length] = (i + 1) * h + (j + 1) % h;
        }
    }

    return { vertex: vertexList, index: indexList };
};

//--------------------------------------------------------------------------------------------------------//
function makeQuad(positions, normals, colours, uvs) {
    var vertexList = [], indexList = [];

    for (var i = 0; i < 4; ++i) {
        for (var k = 0; k < 3; ++k)
            vertexList[vertexList.length] = positions[i][k];
        for (var k = 0; k < 3; ++k)
            vertexList[vertexList.length] = normals[i][k];
        for (var k = 0; k < 3; ++k)
            vertexList[vertexList.length] = colours[i][k];
        for (var k = 0; k < 2; ++k)
            vertexList[vertexList.length] = uvs[i][k];
    }

    indexList[indexList.length] = 0;
    indexList[indexList.length] = 1;
    indexList[indexList.length] = 2;
    indexList[indexList.length] = 0;
    indexList[indexList.length] = 2;
    indexList[indexList.length] = 3;

    return { vertex: vertexList, index: indexList };
};

function makeShipShape_wireframe() {
    var vertexList = [], indexList = [];

    for (var i = 0; i < 3; ++i) {
        for (var k = 0; k < 3; ++k)
            vertexList[vertexList.length] = positions[i][k];
        for (var k = 0; k < 3; ++k)
            vertexList[vertexList.length] = normals[i][k];
        for (var k = 0; k < 3; ++k)
            vertexList[vertexList.length] = colours[i][k];
        for (var k = 0; k < 2; ++k)
            vertexList[vertexList.length] = uvs[i][k];
    }

    indexList[indexList.length] = 0;
    indexList[indexList.length] = 1;
    indexList[indexList.length] = 2;
    indexList[indexList.length] = 3;
    indexList[indexList.length] = 4;
    indexList[indexList.length] = 0;

    return { vertex: vertexList, index: indexList };
}
