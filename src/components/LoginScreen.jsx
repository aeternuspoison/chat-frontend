import { useState } from "react";

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    onLogin(trimmed);
  }

  return (
    <section className="login-screen" id="loginScreen">
      <div className="login-box">
        <div className="login-icon">
          <span className="material-icons">chat</span>
        </div>

        <h1>pleroma chat</h1>

        <p>Entre para começar a conversar.</p>

        <form id="loginForm" onSubmit={handleSubmit} style={{  margin: "10px"}}>

          <div className="input-wrapper">
            <span className="material-icons">person_outline</span>

            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <button type="submit">
            <span className="material-icons">login</span>
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}
