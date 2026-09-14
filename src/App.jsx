import { useEffect, useRef, useState } from "react";

import LoginScreen from "./components/LoginScreen";
import ChatScreen from "./components/ChatScreen";

const WEBSOCKET_URL = "wss://plemora-chat.onrender.com/";

export default function App() {
    const [username, setUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    const socketRef = useRef(null);

    useEffect(() => {
        console.log("Tentando conectar ao WebSocket...");
        console.log("URL:", WEBSOCKET_URL);

        const ws = new WebSocket(WEBSOCKET_URL);

        socketRef.current = ws;

        ws.addEventListener("open", () => {
            console.log("Conectado ao WebSocket");

            setSocket(ws);
            setConnected(true);
        });

        ws.addEventListener("error", (error) => {
            console.error("Erro no WebSocket:", error);

            setConnected(false);
        });

        ws.addEventListener("close", (event) => {
            console.log("Conexão com o servidor encerrada.");
            console.log("Código:", event.code);
            console.log("Motivo:", event.reason);

            setConnected(false);
            setSocket(null);
        });

        return () => {
            console.log("Encerrando WebSocket...");

            ws.close();

            socketRef.current = null;
        };
    }, []);

    function handleLogin(name) {
        const cleanName = name.trim();

        if (!cleanName) {
            return;
        }

        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            alert("O servidor ainda não está conectado.");
            return;
        }

        /*
         * Avisa o backend que o usuário entrou.
         */
        const joinMessage = {
            type: "join",
            username: cleanName,
        };

        console.log("Usuário entrando:", joinMessage);

        socketRef.current.send(
            JSON.stringify(joinMessage)
        );

        setUsername(cleanName);
        setLoggedIn(true);
    }

    function handleLogout() {
  
        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN &&
            username
        ) {
            const leaveMessage = {
                type: "leave",
                username: username,
            };

            console.log("Usuário saindo:", leaveMessage);

            socketRef.current.send(
                JSON.stringify(leaveMessage)
            );
        }

        setUsername("");
        setLoggedIn(false);
    }
    

    return (
        <main className="container">
            {!loggedIn && (
                <LoginScreen
                    onLogin={handleLogin}
                    connected={connected}
                />
            )}

            {loggedIn && socket && (
                <ChatScreen
                    username={username}
                    socket={socket}
                    onLogout={handleLogout}
                />
            )}
        </main>
    );
}