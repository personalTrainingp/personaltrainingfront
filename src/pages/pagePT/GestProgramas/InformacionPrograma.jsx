import { useForm } from '@/hooks/useForm';
import React from 'react'

export const InformacionPrograma = ({data}) => {
    const {sigla_pgm, desc_pgm, name_pgm, onInputChange} = useForm(data)
  return (
    <>
        <form className='m-4'>
            <div className='mb-3'>
                <label className="form-label col-form-label" htmlFor='name_pgm'>
                    Nombre del programa:
                </label>
                <div>
                    <input
                        type="text"
                        className="form-control"
                        onChange={onInputChange}
                        name="name_pgm"
                        id="name_pgm"
                        value={name_pgm}
                        required
                    />
                </div>
            </div>
            <div className='mb-3'>
                <label className="form-label col-form-label" htmlFor='sigla_pgm'>
                    Sigla del programa:
                </label>
                <div>
                    <input
                        type="text"
                        className="form-control"
                        onChange={onInputChange}
                        name="sigla_pgm"
                        id="sigla_pgm"
                        value={sigla_pgm}
                        required
                    />
                </div>
            </div>
            <div className='mb-3'>
                <label className="form-label col-form-label" htmlFor='desc_pgm'>
                    Descripcion del programa:
                </label>
                <div>
                    <textarea
                        type="text"
                        className="form-control"
                        onChange={onInputChange}
                        name="desc_pgm"
                        id="desc_pgm"
                        value={desc_pgm}
                        required
                    />
                </div>
            </div>
        </form>
    </>
  )
}
