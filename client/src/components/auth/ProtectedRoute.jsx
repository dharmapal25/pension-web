import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {

    const { loading, user } = useAuth();

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    if (!user) {
        return <Navigate to={"/"} replace />
    }

    console.log("protected route children : ", children)

    return children

}

export default ProtectedRoute