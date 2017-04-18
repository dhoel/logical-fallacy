import React from 'react';

export default function LoginPage() {

    return (
        <div className='login-page'>
            <h2>Logical Fallacy X</h2>
            <a href={'/api/auth/google'}>Login with Google</a>
        </div>
    )
}
