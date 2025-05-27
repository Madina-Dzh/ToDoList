const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors()) // для отсутствия ошибок при ajax-запросах
app.use(bodyParser.json()) // сказали приложению использовать bodyParser

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_diplom'
})

// Запуск сервера
app.listen(8000, () => {
    console.log('App started on port 8000')
})

// Эддпоинт для получения данных из БД
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results)
    })
})

// Эндпоинт для создания задачи
app.post('/', (req, res) => {
    // для того, чтобы бэкэнд научился принимать пост-запросы, ему нужно показать какие пост-запросы
    //const { text, creator, responsible, status } = req.body
    let data = [req.body.text, req.body.creator, req.body.responsible, req.body.status]
    db.query("INSERT INTO `tasks`(`text`, `creator`, `responsible`, `status`) VALUES (?,?,?,?)", data, (err, results) => {
        if (err) {
            return res.status(500).json(err)
        }
        res.json(results)
    })
})

// Эндпоинт для удаления задачи
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Эндпоинт для изменения статуса
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Обновление статуса задачи в БД
        await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Эдпоинт для регистрации
app.post('/register', async (req, res) => {
    let data = [req.body.name, req.body.email, req.body.password]
    db.query("INSERT INTO `accounts`(`name`, `email`, `password`) VALUES (?,?,?)", data, (err, results) => {
        if (err) {
            return res.status(500).json(err)
        }
        res.json(results)
    })
});

// Эндпоинт для входа пользователя
app.post('/login', (req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT * FROM accounts WHERE name = ? AND email = ? AND password = ?', [name, email, password], (err, results) => {
        if (err) return res.status(500).send('Ошибка сервера');
        if (results.length === 0) {
            return res.status(401).send('Неверные данные');
        }

        const user = results[0];

        // Проверка пароля
        //if (bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ id: user.id, name: user.name }); // Возвращаем данные пользователя
        //} else {
        //    res.status(401).send('Неверный пароль');
        //}
        console.log(`${name} вошёл в систему`);
    });
});


// Эндпоинт для редактирования задачи
app.put('/tasks/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const { status } = req.body;
    const { responsible } = req.body;

    try {
        await db.query('UPDATE tasks SET text = ?, status = ?, responsible = ? WHERE id = ?', [text, status, responsible, id]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Эндпоинт для получения всех пользователей
app.get('/users', (req, res) => {
    db.query('SELECT name FROM accounts', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);}
    )
});