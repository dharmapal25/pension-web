import React from 'react'

const ERROR404 = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="not-found-badge">404</div>
                <h1>Oops! Page not found</h1>
                <p>
                    The page you are looking for may have been removed, renamed, or is temporarily unavailable.
                </p>
                <div className="not-found-actions">
                    <a className="not-found-link primary" href="/home">
                        Go Home
                    </a>
                    <button
                        type="button"
                        className="not-found-link secondary"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ERROR404