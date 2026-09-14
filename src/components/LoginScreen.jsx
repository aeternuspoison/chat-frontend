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
      <section
            className="login-screen"
            id="loginScreen"
            style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                minHeight: "100vh",
                padding: "24px",
                boxSizing: "border-box",
            }}
        >
            <div
                className="login-box"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "32px 24px",
                    boxSizing: "border-box",
                }}
            >
                <div className="login-icon">
                    <span className="material-icons">
                        chat
                    </span>
                </div>

                <h1>pleroma chat</h1>

                <p>Conversa Privada sem registros <br/> (só nos meus logs...)</p>

                <form
                    id="loginForm"
                    onSubmit={handleSubmit}
                    style={{
                        width: "100%",
                        marginTop: "28px",
                    }}
                >
                    <div
                        className="input-wrapper"
                        style={{
                            width: "100%",
                            minHeight: "54px",
                            boxSizing: "border-box",
                        }}
                    >
                        <span className="material-icons">
                            person_outline
                        </span>

                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Digite seu nome"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            autoComplete="name"
                            autoCapitalize="words"
                            enterKeyHint="go"
                            required
                            style={{
                                fontSize: "16px",
                                minHeight: "52px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            minHeight: "54px",
                            marginTop: "18px",
                            fontSize: "16px",
                        }}
                    >
                        <span className="material-icons">
                            login
                        </span>
                        Entrar
                    </button>
                </form>
                
            </div>
        <footer
            style={{
                position: "absolute",
                bottom: "20px",
                left: "0",
                width: "100%",
                textAlign: "center",
                fontSize: "14px",
            }}
        >
            <p>&copy; 2026 - AeternusPoison <br/> Todos os direitos reservados.</p>
        </footer>
        </section>
        
    );
    }
