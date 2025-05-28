import React from "react";
import axios from "axios";

let ToDoEdit = ({ currentId, onClose, todo, setTodo }) => {

    const [newText, setNewText] = React.useState('');
    const [newStatus, setNewStatus] = React.useState('');
    const [creator, setCreator] = React.useState('');
    const [newResponsible, setResponsible] = React.useState('');
    const [users, setUsers] = React.useState([]);


    React.useEffect(() => {
        // Получаем список пользователей
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        // Найдите задачу по currentId и установите текст в состояние
        const taskToEdit = todo.find(task => task.id === currentId);
        if (taskToEdit) {
            setNewText(taskToEdit.text);
            setNewStatus(taskToEdit.status);
            setCreator(taskToEdit.creator);
            setResponsible(taskToEdit.responsible);
        }
    }, [currentId, todo]);

    const handleChange = async () => {
        try {
            // Отправьте запрос на обновление задачи
            const updatedTask = await axios.put(`http://localhost:8000/tasks/edit/${currentId}`, {
                text: newText,
                status: newStatus,
                responsible: newResponsible
                // Добавьте другие поля, если необходимо
            });

            // Обновите состояние todo с новым текстом
            setTodo(prevTodo =>
                prevTodo.map(task =>
                    task.id === currentId ? updatedTask.data : task
                )
            );

            // Закройте редактор
            onClose();
            document.location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async () => {
        try {
            // Отправьте запрос на удаление задачи
            await axios.delete(`http://localhost:8000/tasks/${currentId}`);

            // Обновите состояние todo, удалив задачу
            setTodo(prevTodo => prevTodo.filter(task => task.id !== currentId));

            // Закройте редактор
            onClose();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="ToDoEdit">
            <div className="ToDoEdit__container">
                <div className="ToDoEdit__header">
                    Редактирование задачи {currentId}
                </div>
                <div className="title-status">
                    <button className="check-status"></button>
                    <input placeholder="Введите название задачи"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)} />
                </div>
                <div className="rights">
                    <div className="on-the-sides">
                        <span>Создатель:</span>
                        <span>{creator}</span>
                    </div>
                    <div className="on-the-sides">
                        <span>Ответственный: </span>
                        <select value={newResponsible} onChange={(e) => setResponsible(e.target.value)}>
                            <option value="">Выберите пользователя</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="on-the-sides">
                        <span>Статус: </span>
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <option value="Новая">Новая</option>
                            <option value="В процессе">В процессе</option>
                            <option value="Выполнено">Выполнено</option>
                        </select>
                    </div>
                </div>
                <button className="del" onClick={handleDelete}>Удалить задачу</button>
                <div className="buttons on-the-sides">
                    <button className="cancellation" onClick={onClose}>Отмена</button>
                    <button className="change" onClick={handleChange}>Изменить</button>
                </div>
            </div>
        </div>
    );
};

export default ToDoEdit;