import React from 'react'
import useAuthUser from '../hooks/useAuthRole';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ERROR404 from '../components/ERROR404';

const Instructor = () => {

    const { user, loading, fetchUser } = useAuthUser();

    useEffect(()=> {
        fetchUser()
    },[])

    const location = useLocation();

    console.log(location.state);

    console.log(user)
    
    if(!user) return <ERROR404/>

    return (
        <>
            <div>

                {
                    (loading) ?

                        <h1>Loading...</h1>
                        :
                        <div>
                            <h1>instructor {location.state.user.email} </h1>
                            {/* <h2> {location.state.email} </h2> */}
                        </div>
                }
                <h2> {location.state.email} </h2>

            </div>
        </>
    )
}

export default Instructor