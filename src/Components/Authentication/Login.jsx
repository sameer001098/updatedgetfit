import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    const res = await axios.post(
      'https://projects.funtashtechnologies.com/getfitapi/loginsuperadmin.php',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (res.data && res.data.Result === "true") {
      const { userId, firstname } = res.data;
      localStorage.setItem('getfituserid', userId);
      localStorage.setItem('getfitfirstname', firstname);

      navigate('/');
    } else {
      alert(res.data?.ResponseMsg || 'Login failed');
    }
  } catch (err) {
    alert(err.response?.data?.ResponseMsg || 'Login failed');
  }
};


  return (
    <div className="px-5 py-5 p-lg-0 min-h-screen bg-white d-flex flex-column justify-content-center w-100">
      <div className="d-flex justify-content-center">
        <div className="col-lg-5 col-xl-4 p-12 p-xl-20 position-fixed start-0 top-0 h-screen overflow-y-hidden bg-primary d-none d-lg-flex flex-column">
          <a className="d-block" href="#">
            <img src={logo} className="h-10" alt="..." />
          </a>
          <div className="mt-32 mb-20">
            <h1 className="ls-tight  font-bolder display-6 text-white mb-5">
              Let’s build something amazing today.
            </h1>
            <p className="text-white text-opacity-80">
              Maybe some text here will help me see it better. Oh God. Oke, let’s do it then.
            </p>
          </div>
          <div className="w-56 h-56 bg-orange-500 rounded-circle position-absolute bottom-0 end-20 transform translate-y-1/3"></div>
        </div>

        <div className="col-12 col-md-9 col-lg-7 offset-lg-5 border-left-lg min-h-screen d-flex flex-column justify-content-center position-relative">
          <div className="py-lg-16 px-lg-20">
            <div className="row">
              <div className="col-lg-10 col-md-9 col-xl-6 mx-auto ms-xl-0">
                <div className="mt-10 mt-lg-5 mb-6 d-lg-block">
                  <span className="d-inline-block d-lg-block h1 mb-4 mb-lg-6 me-3">👋</span>
                  <h1 className="ls-tight text-dark font-bolder h2">Nice to see you!</h1>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="mb-5">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label" htmlFor="password">Password</label>
                     
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="check_example" />
                      <label className="form-check-label" htmlFor="check_example">Keep me logged in</label>
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary w-full">Sign in</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}

export default Login;
