import { useEffect, useRef, useState } from "react";

import emoji1 from "../assets/emojis/emoji1.png";
import emoji2 from "../assets/emojis/emoji2.png";
import emoji3 from "../assets/emojis/emoji3.png";
import emoji4 from "../assets/emojis/emoji4.png";
import emoji5 from "../assets/emojis/emoji5.png";
import emoji6 from "../assets/emojis/emoji6.png";
import emoji7 from "../assets/emojis/emoji7.png";

const EMOJIS = [
    { value: ":bye:", image: emoji1, alt: "bye" },
    { value: ":heart:", image: emoji2, char: "heart" },
    { value: ":why:", image: emoji3, char: "why" },
    { value: ":swing:", image: emoji4, char: "swing" },
    { value: ":aaa:", image: emoji5, char: "aaa" },
    { value: ":ghostface:", image: emoji6, char: "ghostface" },
    { value: ":grr:", image: emoji7, char: "grr" },
];


const EMOJI_MAP = EMOJIS.reduce((map, emoji) => {
    map[emoji.value] = emoji;
    return map;
}, {});

const EMOJI_REGEX = /(:[a-zA-Z0-9_+-]+:)/g;

function renderMessageContent(text) {
    if (typeof text !== "string") {
        return null;
    }

    return text.split(EMOJI_REGEX).map((part, index) => {
        const emoji = EMOJI_MAP[part];

        if (emoji?.image) {
            return (
                <img
                    key={`${part}-${index}`}
                    src={emoji.image}
                    alt={emoji.alt}
                    style={{
                        width: 32,
                        height: 32,
                        verticalAlign: "middle",
                        display: "inline-block",
                    }}
                />
            );
        }

        if (emoji?.char) {
            return emoji.char;
        }

        return part;
    });
}

export default function ChatScreen({
    username,
    socket,
    onLogout,
}) {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        if (!socket) {
            return;
        }

        function handleMessage(event) {
            try {
                const data = JSON.parse(event.data);

                console.log("Mensagem recebida:", data);

                if (data.type === "user_joined") {
                    setMessages((previous) => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            type: "notification",
                            text: `${data.username} rasgou o véu da ilusão.`,
                        },
                    ]);

                    return;
                }

                if (data.type === "user_left") {
                    setMessages((previous) => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            type: "notification",
                            text: `${data.username} voltou para a ilusão da matéria.`,
                        },
                    ]);

                    return;
                }

                if (
                    !data.username ||
                    typeof data.message !== "string"
                ) {
                    console.warn(
                        "Mensagem WebSocket ignorada:",
                        data
                    );

                    return;
                }

                setMessages((previous) => [
                    ...previous,
                    {
                        id: crypto.randomUUID(),
                        type: "message",
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

        socket.addEventListener(
            "message",
            handleMessage
        );

        return () => {
            socket.removeEventListener(
                "message",
                handleMessage
            );
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

    useEffect(() => {
        if (!emojiPickerOpen) {
            return;
        }

        function handleClickOutside(event) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(
                    event.target
                )
            ) {
                setEmojiPickerOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [emojiPickerOpen]);

    function handleSubmit(event) {
        event.preventDefault();

        const text = messageText.trim();

        if (!text) {
            return;
        }

        if (!socket) {
            console.error(
                "WebSocket não existe."
            );
            return;
        }

        if (
            socket.readyState !== WebSocket.OPEN
        ) {
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

        console.log(
            "Enviando mensagem:",
            message
        );

        socket.send(
            JSON.stringify(message)
        );

        setMessageText("");

        inputRef.current?.focus();
    }

    function handleLogout() {
        setMessages([]);
        onLogout();
    }

    function handleEmojiSelect(emoji) {
        setMessageText(
            (previous) =>
                `${previous}${emoji.value} `
        );

        setEmojiPickerOpen(false);

        inputRef.current?.focus();
    }

    return (
        <section
            className="chat-screen"
            id="chatScreen"
            style={{
                display: "flex",
                flexDirection: "column",
            }}
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
                style={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                {messages.map((message) => {

                    if (
                        message.type ===
                        "notification"
                    ) {
                        return (
                            <div
                                key={message.id}
                                className="chat-notification"
                            >
                                {message.text}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={message.id}
                            className={`message${
                                message.own
                                    ? " own"
                                    : ""
                            }`}
                        >
                            <strong>
                                {message.username}
                            </strong>

                            <span>
                                {renderMessageContent(
                                    message.text
                                )}
                            </span>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            <form
                id="chatForm"
                onSubmit={handleSubmit}
            >
                <div
                    className="message-input"
                    style={{
                        position: "relative",
                    }}
                >
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
                        type="button"
                        title="Emojis"
                        onClick={() =>
                            setEmojiPickerOpen(
                                (open) => !open
                            )
                        }
                    >
                        <span className="material-icons">
                            mood
                        </span>
                    </button>

                    {emojiPickerOpen && (
                        <div
                            ref={emojiPickerRef}
                            className="emoji-picker"
                            style={{
                                position: "absolute",
                                width: "100%",
                                bottom: "100%",
                                right: 0,
                                marginBottom: 8,
                                display: "flex",
                                gap: 8,
                                padding: 8,
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            {EMOJIS.map(
                                (emoji) => (
                                    <button
                                        key={
                                            emoji.value
                                        }
                                        type="button"
                                        title={
                                            emoji.value
                                        }
                                        onClick={() =>
                                            handleEmojiSelect(
                                                emoji
                                            )
                                        }
                                        style={{
                                            border:
                                                "none",
                                            background:
                                                "transparent",
                                            cursor:
                                                "pointer",
                                            fontSize: 20,
                                            lineHeight: 1,
                                            padding: 4,
                                        }}
                                    >
                                        {emoji.image ? (
                                            <img
                                                src={
                                                    emoji.image
                                                }
                                                alt={
                                                    emoji.alt
                                                }
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            />
                                        ) : (
                                            emoji.char
                                        )}
                                    </button>
                                )
                            )}
                        </div>
                    )}

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