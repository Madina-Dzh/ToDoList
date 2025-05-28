import React, { useState } from "react";
import axios from 'axios';

const Registration = ({ onClose, logIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        // Проверка на совпадение паролей
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8000/register', {
                name,
                email,
                password
            });

            if (response.status === 200) {
                // Успешная регистрация
                alert('Регистрация успешна!');
                logIn(name);
                onClose(); // Закрываем модальное окно
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('Ошибка при регистрации. Попробуйте еще раз.');
        }
    };

    return (
        <div className="Reg-Auth">
            <div className="Reg-Auth__container">
                <div className="Reg-Auth__header">Регистрация</div>
                {error && <div className="error-message">{error}</div>}
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
                            <tr>
                                <td>Подтверждение пароля</td>
                                <td><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm'/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="buttons">
                    <button onClick={handleRegister}>Регистрация</button>
                    <button onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
}

export default Registration;
