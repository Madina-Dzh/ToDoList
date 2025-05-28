import React from "react";
import axios from 'axios';

const Authentication = ({ onClose, logIn }) => {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/login', {
                name,
                email,
                password
            });
    
            if (response.status === 200) {
                // Успешный вход
                const { name } = response.data;
                alert('Вход успешен!');
                onClose(); // Закрываем модальное окно
                logIn(name);
            }
        } catch (error) {
            if (error.response) {
                // Запрос был сделан, и сервер ответил с кодом состояния, отличным от 2xx
                alert(error.response.data); // Показываем сообщение от сервера
            } else {
                // Ошибка при настройке запроса
                alert('Ошибка при входе. Пожалуйста, попробуйте позже.');
            }
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="Reg-Auth">
            <div className="Reg-Auth__container">
                <div className="Reg-Auth__header">Вход</div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Имя</td>
                                <td><input value={name} onChange={(e) => setName(e.target.value)} placeholder='Имя'/></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/></td>
                            </tr>
                            <tr>
                                <td>Пароль</td>
                                <td><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="buttons">
                    <button onClick={handleLogin}>Войти</button>
                    <button onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
}

export default Authentication;
