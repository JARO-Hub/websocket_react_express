import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // Opcional: decodificar token para obtener nombre del usuario
            const payload = JSON.parse(atob(token.split(".")[1]));
            localStorage.setItem("username", payload.name);

            navigate("/"); // Redirige a la pantalla principal del chat
        } else {
            alert("OAuth failed");
        }
    }, [navigate]);

    return <div>Loading...</div>;
}

export default OAuthSuccess;