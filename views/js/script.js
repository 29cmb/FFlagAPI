document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/flags')
        .then(response => response.json())
        .then(data => createTable(data.data))
        .catch(error => console.error('Error fetching data:', error));
        
    document.getElementById('editButton').addEventListener('click', () => {
        toggleEditMode();
    });
});

var originalData = []

function createTable(data) {
    originalData = data.map(flag => ({ ...flag }))
    const tbody = document.querySelector('#dashboard tbody')
    
    data.forEach(item => {
        const row = document.createElement('tr')
        const flagCell = document.createElement('td')
        flagCell.innerHTML = `<code>${item.flag}</code>`
        row.appendChild(flagCell)

        const valueCell = document.createElement('td')
        valueCell.innerHTML = (typeof item.value == "boolean") ? (item.value == true ? "✅" : "❌") : item.value
        row.appendChild(valueCell)

        tbody.appendChild(row)
    });
}

function toggleEditMode() {
    const editButton = document.getElementById('editButton')
    const isEditing = editButton.classList.toggle('editing')
    const cells = document.querySelectorAll('#dashboard tbody td')

    cells.forEach(cell => {
        if(isEditing){
            if(cell.textContent.trim() == "✅") cell.innerHTML = "true"
            if(cell.textContent.trim() == "❌") cell.innerHTML = "false"
        } else {
            if(cell.textContent.trim() == "true") cell.innerHTML = "✅"
            if(cell.textContent.trim() == "false") cell.innerHTML = "❌"
        }
        
        cell.setAttribute('contenteditable', isEditing)
    });

    if (isEditing) {
        editButton.innerHTML = '<i class="fas fa-save"></i>'
    } else {
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        saveChanges();
    }
}

function saveChanges() {
    const rows = document.querySelectorAll('#dashboard tbody tr')
    const changed = []

    rows.forEach((row, index) => {
        const flag = row.cells[0].textContent.trim();
        var value = row.cells[1].textContent.trim();

        if (value === "✅") value = true;
        if (value === "❌") value = false;

        if (value !== originalData[index].value) {
            changed.push({ flag, value });
        }
    });

    // handle the saving
}