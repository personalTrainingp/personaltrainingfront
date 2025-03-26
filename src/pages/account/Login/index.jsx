import { useAuthStore } from "@/hooks/useAuthStore"
import { useForm } from "@/hooks/useForm"
import { useEffect, useState } from "react"
import { Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import positivotransparente_LOGO from '@/assets/images/brand-change/Positivo-transparente.png'
import banner_LOGO from '@/assets/images/brand-change/banner_2.webp'
import styled from "styled-components";

const loginFormField = {
    usuario_user: '',
    password_user: ''
}
const registerFormField ={
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerPassword2: '',
}

export default function Login() {
  
  const { startLogin, startRegister, errorMessage, jwtInfo } = useAuthStore()
  const { usuario_user, password_user, onInputChange: onLoginInputChange } = useForm(loginFormField)


  const loginSubmit = (event) =>{
      event.preventDefault()
      startLogin({usuario_user, password_user})
  }

  useEffect(() => {
      if (errorMessage!== undefined) {
        Swal.fire('Error en la autenticacion', errorMessage, 'error')
      }
  }, [errorMessage])
  useEffect(() => {
    const setFullHeight = () => {
      const elements = document.querySelectorAll('.js-fullheight');
      elements.forEach(element => {
        element.style.height = `${window.innerHeight}px`;
      });
    };

    setFullHeight();
    window.addEventListener('resize', setFullHeight);

    return () => {
      window.removeEventListener('resize', setFullHeight);
    };
  }, []);

  const togglePasswordVisibility = (event) => {
    const target = event.currentTarget;
    target.classList.toggle('fa-eye');
    target.classList.toggle('fa-eye-slash');
    const input = document.querySelector(target.getAttribute('toggle'));
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };
  return (
    <SpanContainer>
        <div className="img js-fullheight" style={{backgroundImage: `url(${banner_LOGO})`}}>
            <div className="img js-fullheight" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <section className="ftco-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6 text-center mb-5">
                                <h2 className="heading-section">
                                    <img src={positivotransparente_LOGO} width="250px"/>
                                </h2>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-6 col-lg-4">
                                <div className="login-wrap p-0">
                            <form onSubmit={loginSubmit} className="signin-form">
                                <div className="form-group" style={{margin: '1rem'}}>
                                    <input type="text" name='usuario_user' value={usuario_user} onChange={onLoginInputChange} className="form-control" placeholder="Usuario" required/>
                                </div>
                            <div className="form-group" style={{margin: '1rem'}}>
                            <input id="password-field" type="password" name='password_user' value={password_user} onChange={onLoginInputChange} className="form-control" placeholder="Contraseña" required/>
                            <span toggle="#password-field" onClick={togglePasswordVisibility} className="fa fa-fw fa-eye field-icon toggle-password"></span>
                            </div>
                            <div className="form-group" style={{margin: '1rem'}}>
                                <button type="submit" style={{border: '1px solid #fbceb5', background: '#fbceb5', color: '#000'}} className="form-control btn btn-primary submit px-3">Entrar</button>
                            </div>
                        </form>
                        <p className="w-100 text-center">&mdash; Sistema CHANGE THE SLIM STUDIO &mdash;</p>
                        </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </SpanContainer>
  )
}
const SpanContainer = styled.span`

.ftco-section {
    padding: 7em 0; }
  
  .ftco-no-pt {
    padding-top: 0; }
  
  .ftco-no-pb {
    padding-bottom: 0; }
  
  .heading-section {
    font-size: 28px;
    color: #000; }
  
  .img {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center; }
  
  .login-wrap {
    position: relative;
    color: rgba(255, 255, 255, 0.9); }
    .login-wrap h3 {
      font-weight: 300;
      color: #fff; }
    .login-wrap .social {
      width: 100%; }
      .login-wrap .social a {
        width: 100%;
        display: block;
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #000;
        background: #fff; }
        .login-wrap .social a:hover {
          background: #000;
          color: #fff;
          border-color: #000; }

          .form-group {
            position: relative; }
          
          .field-icon {
            position: absolute;
            top: 50%;
            right: 15px;
            -webkit-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.9); }
            
.form-control {
    background: transparent;
    border: none;
    height: 50px;
    color: white !important;
    border: 1px solid transparent !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border-radius: 40px;
    padding-left: 20px;
    padding-right: 20px;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s; }
    @media (prefers-reduced-motion: reduce) {
      .form-control {
        -webkit-transition: none;
        -o-transition: none;
        transition: none; } }
    .form-control::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: rgba(255, 255, 255, 0.8) !important; }
    .form-control::-moz-placeholder {
      /* Firefox 19+ */
      color: rgba(255, 255, 255, 0.8) !important; }
    .form-control:-ms-input-placeholder {
      /* IE 10+ */
      color: rgba(255, 255, 255, 0.8) !important; }
    .form-control:-moz-placeholder {
      /* Firefox 18- */
      color: rgba(255, 255, 255, 0.8) !important; }
    .form-control:hover, .form-control:focus {
      background: transparent !important;
      outline: none !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      border-color: rgba(255, 255, 255, 0.4) !important; }
    .form-control:focus {
      border-color: rgba(255, 255, 255, 0.4) !important; }
  
`

/*
<div className="container login-container">
          <div className="row justify-content-center">
              <div className="col-md-6 login-form-1">
                  <h3>Ingreso</h3>
                  <form onSubmit={loginSubmit}>
                      <div className="form-group mb-2">
                          <input 
                              type="text"
                              className="form-control"
                              placeholder="Usuario"
                              name='usuario_user'
                              value={usuario_user}
                              onChange={onLoginInputChange}
                          />
                      </div>
                      <div className="form-group mb-2">
                          <input
                              type="password"
                              className="form-control"
                              placeholder="Contraseña"
                              name='password_user'
                              value={password_user}
                              onChange={onLoginInputChange}
                          />
                      </div>
                      <div className="form-group mb-2">
                          <Button 
                              type="submit"
                              value="Login" 
                          >Entra</Button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
*/