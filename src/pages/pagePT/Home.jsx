import React from 'react'
import logo_change from '@/assets/images/change-logo-dark-transparente.png'
export const Home = () => {
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'center',  alignContent: 'center'}}>
        <div style={{height: '80vh', alignItems: 'center', alignContent: 'center'}}>
          <div className='d-flex flex-column text-center' style={{opacity: '.7'}}>
            <img src={logo_change} width={900}/>
            <span className='font-24 fw-bold'>
                {/* Bienvenido al sistema de CHANGE THE SLIM STUDIO */}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
