document.getElementById('start-button').addEventListener('click', function () {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('map').style.display = 'block';
    document.getElementById('info').style.display = 'flex';
    initializeGame();
});

document.getElementById('restart-button').addEventListener('click', function () {
    document.getElementById('final-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    totalScore = 0;
    currentLandmarkIndex = 0;
});

var landmarks = [
    { name: "Elliott Tower", coords: [42.673611, -83.215833] },
    { name: "Kresge Library", coords: [42.6727, -83.2158] },
    { name: "O'Rena (Athletic Center)", coords: [42.6740, -83.2132] },
    { name: "Meadow Brook Hall", coords: [42.6722, -83.2015] },
    { name: "Engineering Center", coords: [42.6719, -83.2149] }
];
var currentLandmarkIndex = 0;
var totalScore = 0;
var map, hintCircle, marker;

function initializeGame() {
    map = L.map('map').setView([42.6740, -83.2162], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    loadLandmark();

    map.on('click', function (event) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(event.latlng).addTo(map);

        var distance = map.distance(event.latlng, L.latLng(landmarks[currentLandmarkIndex].coords));
        var score = distance <= 50 ? 100 : Math.max(0, 100 - (distance / 500) * 100);
        document.getElementById('score').innerText = score.toFixed(2);

        totalScore += score;

        setTimeout(() => {
            currentLandmarkIndex++;
            if (currentLandmarkIndex >= landmarks.length) {
                document.getElementById('map').style.display = 'none';
                document.getElementById('info').style.display = 'none';
                document.getElementById('final-page').style.display = 'flex';
                document.getElementById('total-score').innerText = totalScore.toFixed(2);
            } else {
                loadLandmark();
            }
        }, 3000);
    });
}

function loadLandmark() {
    document.getElementById('landmark').innerText = landmarks[currentLandmarkIndex].name;
    if (hintCircle) {
        map.removeLayer(hintCircle);
    }
    hintCircle = L.circle(landmarks[currentLandmarkIndex].coords, {
        color: 'blue',
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        radius: 100
    }).addTo(map);
    map.setView(landmarks[currentLandmarkIndex].coords, 16);
}
