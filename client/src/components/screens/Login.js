import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder="email" />
        <input type="password" placeholder="password" />

        <button
          className="btn waves-effect waves-light"
          type="submit"
          name="action"
        >
          Login
        </button>
        <h5>
          <Link to="/signup">First time? create an account </Link>
        </h5>
      </div>
    </div>
  );
}

export default Login;
