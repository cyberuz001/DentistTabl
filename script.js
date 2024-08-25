const incompleteTasksTable = document.getElementById('incomplete-tasks').querySelector('tbody');
const completeTasksTable = document.getElementById('complete-tasks').querySelector('tbody');
const searchInput = document.getElementById('search-input');

// Preloaderni 8 soniya ko'rsatish va keyin yashirish
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
    }, 5000); // 5 soniya
});

function fetchTasks(status) {
    fetch(`http://127.0.0.1:8000/tasks/${status}`)
        .then(response => response.json())
        .then(tasks => {
            const table = status === 'incomplete' ? incompleteTasksTable : completeTasksTable;
            table.innerHTML = '';

            tasks.forEach(task => {
                const row = createTaskRow(task, status);
                table.appendChild(row);
            });
        })
        .catch(error => console.error('Xatolik:', error));
}

function addTask(task) {
    fetch('http://127.0.0.1:8000/tasks/incomplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => {
        if (response.ok) {
            fetchTasks('incomplete');
        } else {
            return response.json().then(error => console.error('Xatolik:', error));
        }
    })
    .catch(error => console.error('Xatolik:', error));
}

function completeTask(id) {
    fetch('http://127.0.0.1:8000/tasks/complete', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => {
        if (response.ok) {
            fetchTasks('incomplete');
            fetchTasks('complete');
        }
    })
    .catch(error => console.error('Xatolik:', error));
}

function deleteTask(id, status) {
    fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            fetchTasks(status);
        }
    })
    .catch(error => console.error('Xatolik:', error));
}

document.getElementById('task-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const task = {
        name: formData.get('name'),
        family: formData.get('family'),
        formula: formData.get('formula'),
        type: formData.get('type'),
        color: formData.get('color')
    };

    addTask(task);
    event.target.reset();
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#incomplete-tasks tbody tr, #complete-tasks tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const matches = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(searchTerm));

        row.style.display = matches ? '' : 'none';
    });
});

function createTaskRow(task, status) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td class="py-2 px-4 border-b">${task.name}</td>
        <td class="py-2 px-4 border-b">${task.family}</td>
        <td class="py-2 px-4 border-b">${task.formula}</td>
        <td class="py-2 px-4 border-b">${task.type}</td>
        <td class="py-2 px-4 border-b">${task.color}</td>
        <td class="py-2 px-4 border-b">
            ${status === 'incomplete' ? `<button onclick="completeTask(${task.id})" class="bg-green-500 text-white px-2 py-1 rounded">Bajarildi</button>` : ''}
            <button onclick="deleteTask(${task.id}, '${status}')" class="bg-red-500 text-white px-2 py-1 rounded">O'chirish</button>
        </td>
    `;

    return row;
}

// Ishlarni dastlab yuklash
fetchTasks('incomplete');
fetchTasks('complete');
