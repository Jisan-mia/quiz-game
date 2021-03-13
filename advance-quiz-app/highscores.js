const tBody = document.getElementById("tBody");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScores.forEach((score, index) => {
	tBody.innerHTML += `
    <tr>
        <td>${index + 1}</td>
        <td>${score.name}</td>
        <td>${score.score}</td>
    </tr>
`;
});
