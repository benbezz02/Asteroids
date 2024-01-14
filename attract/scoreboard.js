var scoreboard = new Array()

document.addEventListener('DOMContentLoaded', function () {
    var scoretable = document.getElementById('scoreboard');

    scoreboard.sort(function (a, b) {
        return b.points - a.points;
    });

    // Create table body
    for (var i = 1; i < scoreboard.length; i++) {
        var player = scoreboard[i];
        var dataRow = document.createElement('tr');

        var ranktd = document.createElement('td');
        ranktd.textContent = i + ".";
        dataRow.appendChild(ranktd);

        var nametd = document.createElement('td');
        nametd.textContent = player.name;
        dataRow.appendChild(nametd);

        var scoretd = document.createElement('td');
        scoretd.textContent = player.points;
        dataRow.appendChild(scoretd);

        scoretable.querySelector('tbody').appendChild(dataRow);
    }
});