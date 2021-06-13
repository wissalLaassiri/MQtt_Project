var obj_csv = {
    size: 0,
    dataFile: []
};

function readImage(input) {
    console.log(input)
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
        reader.onload = function (e) {
            console.log(e);
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            console.log(obj_csv.dataFile)
            parseData(obj_csv.dataFile)

        }
    } else {
        console.log("empty");
    }
}

function parseData(data) {
    let csvData = [];
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });
    init(csvData);
    console.table(csvData[0][0]);
}

function init(data) {
    var count;
    var position = [];
    var positionCl = [];
    var marker = [];
    var markerCl = [];
    

    map = new OpenLayers.Map("basicMap", {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution()
        ]
    });
    var mapnik = new OpenLayers.Layer.OSM();
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    map.addLayer(mapnik);
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var size = new OpenLayers.Size(100, 100);
    var size2 = new OpenLayers.Size(30, 80);
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    var icon =[];
    var iconCl =[];
    

    for (count = 0; count < 20; count = count + 1) {
        posCl = count+3;
        position[count] = new OpenLayers.LonLat(data[count][1], data[count][0]).transform(fromProjection, toProjection);
        positionCl[posCl] = new OpenLayers.LonLat(data[posCl][1], data[posCl][0]).transform(fromProjection, toProjection);
        //var position2 = new OpenLayers.LonLat(data[count + 1][1], data[count + 1][0]).transform(fromProjection, toProjection);
        var zoom = 10
        icon[count] = new OpenLayers.Icon('taxis.png', size, offset);
        iconCl[posCl] = new OpenLayers.Icon('client.png', size2, offset);
        
        // map.setCenter(position2, zoom);
        marker[count] = new OpenLayers.Marker(position[count],icon[count]);
        markerCl[posCl] = new OpenLayers.Marker(positionCl[posCl],iconCl[posCl]);
//        var marker2 = new OpenLayers.Marker(position2);

markers.addMarker(marker[count]);
markers.addMarker(markerCl[posCl]);

markerCl[posCl].events.register("click", map, function (e) {

    alert("Closest Taxi : \n Long : "+ data[posCl][1]+ " Lat : "+data[posCl][0]);
});

    }
    map.setCenter(position[0], zoom);

}