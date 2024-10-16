import { CardTitle } from '@/components'
import { DateMask } from '@/components/CurrencyMask'
import config from '@/config'
import React from 'react'
import { Card } from 'react-bootstrap'

export const ItemFileCli = ({name_file, deleteFile, tipo_doc, observacion, fecha_creacion}) => {
  return (
    <Card>
							<Card.Body className='p-2'>
								<CardTitle
									containerClass="d-flex align-items-center justify-content-between"
									title={
										<>
                                            <div className="flex-shrink-0 me-3">
                                                        <div className="avatar-sm">
                                                            <span
                                                                className={'avatar-title bg-primary text-white rounded'}
                                                            >
                                                                <i
                                                                    className={'mdi mdi-file-document-edit font-24'}
                                                                ></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <p className="mb-0 font-light font-15">Fecha de creacion: <DateMask date={fecha_creacion} format={'dddd D [de] MMMM [del] YYYY [a las] hh:mm'}/></p>
                                                        <h5 className="mt-0 mb-1 font-20 font-bold">{observacion}</h5>
                                                        <p className="mb-0">TIPO: {tipo_doc}</p>
                                                    </div>
                                                    <div className='left'>
                                                        <a href={`${config.API_IMG.FILE_CLI_DOC_ADJ}${name_file}`}>
                                                            <i className='mx-3 mdi mdi-download cursor-pointer text-black font-24'></i>
                                                        </a>
                                                        <i onClick={deleteFile} className='mx-3 mdi mdi-delete cursor-pointer font-24'></i>
                                                    </div>
										</>
									}
								/>
							</Card.Body>
						</Card>
  )
}
