import React from 'react';

export default function LoginPage() {

    return (
      <div className="login-page">
        <h1 className="title-login">Logical Fallacy X</h1>
        <img className='login-img' src={require('../images/plato-socrates-aristotle.png')}
          alt="Socrates, Plato, and Aristotle"/>
        <a className="btn btn-login" href={'/api/auth/google'}>Login with Google</a>
      </div>
    );
};
