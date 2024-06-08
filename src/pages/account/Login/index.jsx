import { useAuthStore } from "@/hooks/useAuthStore"
import { useForm } from "@/hooks/useForm"
import { useEffect } from "react"
import { Button } from "react-bootstrap";
import Swal from 'sweetalert2';


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
  
  const { startLogin, startRegister, errorMessage } = useAuthStore()

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
  return (
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
  )
}
