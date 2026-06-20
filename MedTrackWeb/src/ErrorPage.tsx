import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg border-0 text-center p-5" style={{ maxWidth: "600px" }}>
                <div className="display-1 text-danger mb-3">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>

                <h1 className="fw-bold mb-3">Oops!</h1>

                <h4 className="text-muted mb-3">
                    Something went wrong
                </h4>

                <p className="text-secondary mb-4">
                    The server is currently unavailable or an unexpected error
                    occurred. Please try again later.
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/")}
                    >
                        Back Home
                    </button>
                </div>
            </div>
        </div>
    );
}