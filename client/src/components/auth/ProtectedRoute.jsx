import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom';
import CircularLoader from '../ui/CircularLoader';
const ProtectedRoute = ({ children }) => {

    const { loading, user } = useAuth();

    if (loading) {
        return (
            <CircularLoader fullPage />
        )
    }

    if (!user) {
        return <Navigate to={"/login"} replace />
    }

    console.log("protected route children : ", children)

    return children

}

export default ProtectedRoute
