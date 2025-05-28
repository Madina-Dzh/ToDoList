import axios from 'axios';
import React from 'react';
import ToDoItem from './component/ToDo/ToDoItem';
import Registration from './component/User/Registration';
import Authentication from './component/User/Authentication';
import ToDoEdit from './component/ToDo/ToDoEdit';

function App() {

  let [todo, setTodo] = React.useState([])
  let [showRegistration, setShowRegistration] = React.useState(false); // Состояние для управления видимостью регистрации
  let [showAuthentication, setShowAuthentication] = React.useState(false); // Состояние для управления видимостью аутентификации
  let [currentUser, setCurrentUser] = React.useState(() => {
    // Восстанавливаем значение из localStorage
    return localStorage.getItem('currentUser') || 0;
  }); // Состояние для хранения текущего пользователя
  let [currentId, setCurrentId] = React.useState(null);
  let [showEdit, setShowEdit] = React.useState(false);

  React.useEffect(() => {
    let data = axios.get('http://localhost:8000/')
    data.then(res => {
      setTodo(res.data)
    },)
  }, [])

  let input = React.createRef() // на подобии getelementbyid/class, но в react. Нужно в атрибуте ref тега передать переменную input 

  let postData = async () => {
    try {
      let newTask = await axios.post('http://localhost:8000/', {
        id: null,
        text: input.current.value,
        creator: currentUser, // Здесь будет ссылка на авторизованного пользователя
        responsible: '',
        status: "Новая"
      })

      setTodo([...todo, newTask.data]); // Обновляем дсостояние

      input.current.value = '';
      console.log(input.current.value) // выдает значение input
      document.location.reload();
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Функция на удаление записи
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/delete/${id}`); // Удаление из БД
      setTodo(todo.filter(t => t.id !== id)); // Удаление из состояния
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  // Функция изменения статуса записи
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/tasks/${id}`, { status: newStatus });
      setTodo(todo.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Занести имя текущего пользователя будет тут
  const logIn = (nameUS) => {
    setCurrentUser(prev => nameUS);
    // Сохраняем значение в localStorage
    localStorage.setItem('currentUser', nameUS);
  };

  // Выйти из системы
  const logOut = () => {
    setCurrentUser(0);
    // Удаляем значение из localStorage
    localStorage.removeItem('currentUser');
  };

  // Функция для открытия ToDoEdit
  const openEdit = (id) => {
    setCurrentId(id);
    setShowEdit(true);
  };


  return (
    <div className='site__wrapper'>
      <div className='header-buttons'>
        {currentUser === 0 ? (
          <div>
            <button onClick={() => setShowRegistration(true)}>Регистрация</button>
            <button onClick={() => setShowAuthentication(true)}>Вход</button>
          </div>
        ) : (
          <div>
            {currentUser}
            <button onClick={logOut}>Выйти</button>
          </div>
        )}
      </div>
      <h1>TO DO LIST</h1>
      {currentUser === 0 ? 
      (
        <></>
      ) : (
        <>
          <div className='AddTask__wrapper'>
          <input ref={input} placeholder='Write your task!'/>
          <button onClick={postData}>Add Task</button>
          </div>
          {
            todo.map(el => {
              return <ToDoItem key={el.id} text={el.text} id={el.id} status={el.status} creator={el.creator} responsible={el.responsible} onStatusChange={handleStatusChange} currentUser={currentUser} onEdit={() => openEdit(el.id)}/>
            })
          }
        </>
      )}
      {showRegistration && <Registration onClose={() => setShowRegistration(false)} logIn={logIn} />}
      {showAuthentication && <Authentication onClose={() => setShowAuthentication(false)} logIn={logIn} />}
      {showEdit && <ToDoEdit currentId={currentId} onClose={() => setShowEdit(false)} todo={todo} setTodo={setTodo} onDelete={handleDelete}/>}
    </div>
  );
}

export default App;
