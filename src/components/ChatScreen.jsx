import { useEffect, useRef, useState } from "react";

export default function ChatScreen({ username, socket, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!socket) {
            return;
        }

        function handleMessage(event) {
            try {
                const data = JSON.parse(event.data);

                console.log("Mensagem recebida:", data);

                setMessages((previous) => [
                    ...previous,
                    {
                        id: crypto.randomUUID(),
                        username: data.username,
                        text: data.message,
                        own: data.username === username,
                    },
                ]);
            } catch (error) {
                console.error(
                    "Erro ao processar mensagem:",
                    error
                );
            }
        }

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        const text = messageText.trim();

        if (!text) {
            return;
        }

        if (!socket) {
            console.error("WebSocket não existe.");
            return;
        }

        if (socket.readyState !== WebSocket.OPEN) {
            console.error(
                "WebSocket não está conectado.",
                "readyState:",
                socket.readyState
            );

            return;
        }

        const message = {
            username: username,
            message: text,
        };

        console.log("Enviando mensagem:", message);

        socket.send(JSON.stringify(message));

        setMessageText("");

        inputRef.current?.focus();
    }

    function handleLogout() {
        setMessages([]);
        onLogout();
    }

    return (
        <section
            className="chat-screen"
            id="chatScreen"
            style={{ display: "flex" }}
        >
            <header className="chat-header">
                <div className="chat-title">
                    <div className="chat-icon">
                        <span className="material-icons">
                            chat
                        </span>
                    </div>

                    <div>
                        <h2>Chat</h2>

                        <span className="online">
                            <span className="status-dot"></span>
                            Online
                        </span>
                    </div>
                </div>

                <button
                    className="logout-button"
                    id="logoutButton"
                    title="Sair"
                    onClick={handleLogout}
                >
                    <span className="material-icons">
                        logout
                    </span>
                </button>
            </header>

            <div
                id="chatMessages"
                className="chat-messages"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message${
                            message.own ? " own" : ""
                        }`}
                    >
                        <strong>
                            {message.username}
                        </strong>

                        <span>
                            {message.text}
                        </span>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            <form
                id="chatForm"
                onSubmit={handleSubmit}
            >
                <div className="message-input">
                    <input
                        type="text"
                        id="messageInput"
                        name="message"
                        placeholder="Digite uma mensagem..."
                        autoComplete="off"
                        ref={inputRef}
                        value={messageText}
                        onChange={(event) =>
                            setMessageText(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button
                        type="submit"
                        title="Enviar"
                    >
                        <span className="material-icons">
                            send
                        </span>
                    </button>
                </div>
            </form>
        </section>
    );
}