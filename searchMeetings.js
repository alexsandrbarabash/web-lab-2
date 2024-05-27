const fs = require('fs');
const { DOMParser } = require('xmldom');
const prompt = require('prompt-sync')();

const xml = fs.readFileSync('meetings.xml', 'utf8');
const doc = new DOMParser().parseFromString(xml, 'application/xml');

// Отримуємо дату від користувача
const searchDate = prompt('Enter the date (YYYY-MM-DD) to search for meetings: ');

let results = [];
const meetings = doc.getElementsByTagName('Meeting');

for (let i = 0; i < meetings.length; i++) {
    const meeting = meetings[i];
    const date = meeting.getElementsByTagName('Date')[0].textContent;
    if (date === searchDate) {
        const time = meeting.getElementsByTagName('Time')[0].textContent;
        const person = meeting.getElementsByTagName('Person')[0].textContent;
        const place = meeting.getElementsByTagName('Place')[0].textContent;
        results.push({ date, time, person, place });
    }
}

// Створення HTML-файлу з результатами пошуку
let htmlContent = `
<html>
<head>
    <title>Meetings on ${searchDate}</title>
</head>
<body>
    <h1>Meetings on ${searchDate}</h1>
    <table border="1">
        <tr>
            <th>Time</th>
            <th>Person</th>
            <th>Place</th>
        </tr>
`;

results.forEach(meeting => {
    htmlContent += `
        <tr>
            <td>${meeting.time}</td>
            <td>${meeting.person}</td>
            <td>${meeting.place}</td>
        </tr>
    `;
});

htmlContent += `
    </table>
</body>
</html>
`;

fs.writeFileSync('meetings.html', htmlContent);
console.log('HTML file generated: meetings.html');
