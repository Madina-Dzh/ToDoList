import React from "react";

let ToDoItem = ({ text, id, status, creator, responsible, onDelete, onStatusChange, currentUser, onEdit }) => {
    const handleDelete = () => {
        onDelete(id);
    };

    const handleStatusChange = () => {
        if (currentUser === creator) {
            onStatusChange(id, status === "Новая" ? "В процессе" : status === "В процессе" ? "Выполнено" : "Новая");
        }
    };


    return (
        <div className="ToDoItem">
            <div>
                <button className={`check-status ${status === "В процессе" ? "yellow" : status === "Выполнено" ? "green" : ""}`} onClick={handleStatusChange}></button>
                <span>{id}. </span>{text} - <strong>{status}</strong>
                <div className="rights">
                    <div>Создатель: {creator}</div>
                    {responsible === "" ?
                        (
                            <></>
                        ) : (
                            <div>Ответственный: {responsible}</div>
                        )}
                </div>
            </div>
            <div className="changeTask">
                {currentUser === creator ?
                    (
                        <>
                            <button className="edit-in-task" onClick={onEdit}>&#9998;</button>
                            <button className="delete-in-task" onClick={handleDelete}>&times;</button>
                        </>
                    ) : (
                        <></>
                    )}
            </div>
        </div>
    );
}

export default ToDoItem;