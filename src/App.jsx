import { useEffect, useRef, useState } from "react";
import LoginScreen from "./components/LoginScreen";
import ChatScreen from "./components/ChatScreen";

const WEBSOCKET_URL = "wss://chat-backend-cgr1.onrender.com";

export default function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  
  const [socket, setSocket] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.addEventListener("open", () => {
      console.log("Conectado ao WebSocket");
      setSocket(ws);
    });

    ws.addEventListener("error", (error) => {
      console.error("Erro no WebSocket:", error);
    });

    ws.addEventListener("close", () => {
      console.log("Conexão com o servidor encerrada");
    });

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  function handleLogin(name) {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Não foi possível conectar ao servidor.");
      return;
    }

    setUsername(name);
    setLoggedIn(true);
  }

  function handleLogout() {
    setUsername("");
    setLoggedIn(false);
  }

  return (
    <main className="container">
      {!loggedIn && <LoginScreen onLogin={handleLogin} />}
      {loggedIn && (
        <ChatScreen username={username} socket={socket} onLogout={handleLogout} />
      )}
    </main>
  );
}
