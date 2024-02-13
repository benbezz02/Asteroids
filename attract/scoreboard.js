var scoreboard = new Array()

updateScoreboard = function () {
    var scoretable = document.getElementById('scoreboard');

    // Sort the scoreboard
    scoreboard.sort(function (a, b) {
        return b.score - a.score;
    });

    // Clear existing table body
    var tbody = scoretable.querySelector('tbody');
    tbody.innerHTML = '';

    // Create table body
    for (var i = 0; i < scoreboard.length; i++) {
        var player = scoreboard[i];
        var dataRow = document.createElement('tr');

        var ranktd = document.createElement('td');
        ranktd.textContent = i + 1 + ".";
        dataRow.appendChild(ranktd);

        var nametd = document.createElement('td');
        nametd.textContent = player.name;
        dataRow.appendChild(nametd);

        var scoretd = document.createElement('td');
        scoretd.textContent = player.score;
        dataRow.appendChild(scoretd);

        tbody.appendChild(dataRow);
    }
};