document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/flags')
        .then(response => response.json())
        .then(data => createTable(data.data))
        .catch(error => console.error('Error fetching data:', error));
});

function createTable(data) {
    const tbody = document.querySelector('#dashboard tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        const code = document.createElement("code")
        const flagCell = document.createElement('td');
        flagCell.innerHTML = `<code>${item.flag}</code>`;
        row.appendChild(flagCell);

        const valueCell = document.createElement('td');
        valueCell.innerHTML = (typeof item.value == "boolean") ? (item.value == true ? "✅" : "❌") : item.value
        row.appendChild(valueCell);

        tbody.appendChild(row);
    });
}
