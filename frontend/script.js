// URL del backend API
const API_URL = 'http://localhost:8000/api';

// Cargar todas las tareas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    // Permitir crear tarea con Enter
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTodo();
        }
    });
});

// Función para cargar todas las tareas desde el backend
async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();
        
        displayTodos(todos);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    }
}

// Función para mostrar las tareas en el HTML
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
     todoList.innerHTML = todos.map(todo =>`
     <div class="todo-item" id="todo-${todo.id}">
     <span 
     class="todo-text"
     id="text-${todo.id}"
     ondbclick="enableEdit(${todo.id},
        '${todo.title.replace(/'/g, "\\'")}')"
     >
     ${todo.title}
     </span>
     <div class="actions">
     <button class="edit-btn" onclick="enableEdit(${todo.id}, '${todo.title.replace(/'/g, "\\'")}')">
     Editar
     </button>
     <button class="delete-btn" onclick="deleteTodo(${todo.id})">
     Eliminar
     </button>
     </div>
     </div>
   `).join('');
}
function enableEdit(id, currenTitle){
    // Funcion para habilitar la edicion (al hacer doble clic o con el botón Editar)
    const item = document.getElementById(`todo-${id}`);
    const textSpan = document.getElementById(`text-${id}`);
    // Crear un input field para la edicion
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currenTitle;
    inputField.className = 'edit-input';

    // Crear el botón de guardar 
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar';
    saveButton.className = 'save-btn';
    saveButton.onclick = () => saveTodo(id , inputField.value);

    // Reemplazar el span con el input y añadir el botón de guardar
    item.replaceChild(inputField, textSpan);
    item.querySelector('.actions').innerHTML = ''; //Limpiar acciones existentes
    item.querySelector('.actions').appendChild(saveButton);

    inputField.focus();
    //  Permite guardar con Enter
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTodo(id , inputField.value);

        }
    });
}
// Funcioón para guardar los cambios en el backend (Llama al endpoint Put)
async function saveTodo(id, newTitle) {
   const title = newTitle.trim();
   if (!title) {
    alert('El título no puede estar vacío');
    return
    }

    try {
        const response = await fetch (`${API_URL}/todos/${id}`,{
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title}) //Usa el esquema TodoCreate
    });
    if (response.ok) {
        loadTodos();

     }else{
        alert('No se pudo guardar la tarea');
     }

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        alert('Error al actualizar la tarea');
           }
        }
 


// Función para crear una nueva tarea
         async function createTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) {
        alert('Por favor escribe una tarea');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            input.value = '';
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al crear tarea:', error);
        alert('Error al crear la tarea');
    }
}

// Función para eliminar una tarea
async function deleteTodo(id) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea');
    }
}

