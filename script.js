const incompleteTasksTable = document.getElementById('incomplete-tasks').querySelector('tbody');
const completeTasksTable = document.getElementById('complete-tasks').querySelector('tbody');
const searchInput = document.getElementById('search-input');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const content = document.getElementById('content');

const baseURL = 'http://83.69.139.168:8000/tasks';

// Preloaderni 3 soniya ko'rsatish va keyin yashirish
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        loginModal.style.display = 'flex'; // Modalni ko'rsatish
    }, 3000); // 3 soniya
});

// Login va parollarni tekshirish uchun ro'yxat
const validCredentials = [
    { username: 'axmadjon9612', password: '01234' },
    { username: 'user', password: '01234' },
    { username: 'user1', password: '01234' }
];

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const isValid = validCredentials.some(cred => cred.username === username && cred.password === password);

    if (isValid) {
        loginModal.style.display = 'none'; // Modalni yopish
        content.style.display = 'block'; // Asosiy sahifani ko'rsatish
        fetchTasks('incomplete');
        fetchTasks('complete');
    } else {
        loginError.classList.remove('hidden'); // Xato xabarni ko‘rsatish
        loginModal.style.display = 'flex'; // Modalni qayta ko'rsatish
    }
});

function fetchTasks(status) {
    fetch(`${baseURL}/${status}`)
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
    fetch(`${baseURL}/incomplete`, {
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
    fetch(`${baseURL}/complete`, {
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
    fetch(`${baseURL}/${id}`, {
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
        formula1: formData.get('formula1'),
        formula2: formData.get('formula2'),
        formula3: formData.get('formula3'),
        formula4: formData.get('formula4'),
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
        <td class="py-2 px-4 border-b">${task.formula1}</td>
        <td class="py-2 px-4 border-b">${task.formula2}</td>
        <td class="py-2 px-4 border-b">${task.formula3}</td>
        <td class="py-2 px-4 border-b">${task.formula4}</td>
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
