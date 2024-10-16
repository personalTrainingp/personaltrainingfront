import { useComentarioStore } from '@/hooks/hookApi/useComentarioStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
dayjs.extend(relativeTime);
const registerComentario ={
	comentario_com: ''
}

export const SectionProspectoComentarios = ({data}) => {
    const {user} = useSelector(e=>e.auth)
    const { formState, comentario_com, onInputChange, onResetForm } = useForm(registerComentario)
	const { obtenerComentarioxLOCATION, postComentario } = useComentarioStore()
    const submitComment = async(e)=>{
		e.preventDefault()
		postComentario( {uid_location: data.uid_comentario, comentario_com: formState.comentario_com, uid_usuario: user.uid } )
		onResetForm()
    }
	useEffect(() => {
        obtenerComentarioxLOCATION(data.uid_comentario)
    }, [])
	const {dataComentarios} = useSelector(e=>e.comentario)
	const prospectoViewComentario = ()=>{
	}
	const prospectoDeleteComentario = ()=>{

	}
  return (
    <DivContainer className='comments-container'>
		<ul id="comments-list" className="comments-list">
			<li>
				<div className="comment-main-level">
                    <div className="comment-avatar"></div>
                    <div className="comment-box">
					<div className="comment-head">
                <h6 className="comment-name"><a>{user.name}</a></h6>
            </div>
            <div className="row">
                <form onSubmit={submitComment}>
                    <div className='col-12'>
                        <textarea
                            type='text'
                            className='form-control'
                            onChange={onInputChange}
                            value={comentario_com}
                            name='comentario_com'
                            placeholder='Escribe un comentario'
                        />
                    </div>
                    <div className='col-2'>
                        <Button style={{width: 'fit-content', padding: '4px', margin: '10px'}}>Comentar</Button>
                    </div>
                </form>
            </div>
                    </div>
                </div>
			</li>
			{
				dataComentarios.map(e=>{
                    return(
						<li key={e.id_comentario}>
							<div className="comment-main-level">
								<div className="comment-avatar"></div>
								<div className="comment-box">
									<div className="comment-head">
										<h6 className="comment-name">{e.auth_user?.nombres_apellidos_user}</h6>
										<span>{dayjs(e.fec_registro).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A')}</span>
										<div className='text-right'>
											{e.auth_user.uid==user.uid && (
												<>
													<Link to="" onClick={prospectoViewComentario} className="action-icon">
														<i className="mdi mdi-square-edit-outline"></i>
													</Link>
													<Link to="" onClick={prospectoDeleteComentario} className="action-icon">
														<i className="mdi mdi-delete"></i>
													</Link>
												</>
											)
											}
										</div>
									</div>
									<div className="comment-content">
										<p>
											{e.comentario_com}
										</p>
									</div>
								</div>
							</div>
						</li>
                    )
                })
			}
		</ul>
    </DivContainer>
  )
}



const DivContainer = styled.div`
/**
 * Oscuro: #283035
 * Azul: #03658c
 * Detalle: #c7cacb
 * Fondo: #dee1e3
 ----------------------------------*/
 &, * {
 	margin: 0;
 	padding: 0;
 	-webkit-box-sizing: border-box;
 	-moz-box-sizing: border-box;
 	box-sizing: border-box;
 }

 a {
 	color: #03658c;
 	text-decoration: none;
 }

ul {
	list-style-type: none;
}

body {
	font-family: 'Roboto', Arial, Helvetica, Sans-serif, Verdana;
	background: #dee1e3;
}

/** ====================
 * Lista de Comentarios
 =======================*/
& {
	margin: 20px 10px 15px;
	width: 568px;
}

& h1 {
	font-size: 36px;
	color: #283035;
	font-weight: 400;
}

& h1 a {
	font-size: 18px;
	font-weight: 700;
}

.comments-list {
	margin-top: 30px;
	position: relative;
}

.comments-list:before {
	content: '';
	width: 2px;
	height: 100%;
	background: #c7cacb;
	position: absolute;
	left: 32px;
	top: 0;
}

.comments-list:after {
	content: '';
	position: absolute;
	background: #c7cacb;
	bottom: 0;
	left: 27px;
	width: 7px;
	height: 7px;
	border: 3px solid #dee1e3;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	border-radius: 50%;
}

.reply-list:before, .reply-list:after {display: none;}
.reply-list li:before {
	content: '';
	width: 60px;
	height: 2px;
	background: #c7cacb;
	position: absolute;
	top: 25px;
	left: -55px;
}


.comments-list li {
	margin-bottom: 15px;
	display: block;
	position: relative;
}

.comments-list li:after {
	content: '';
	display: block;
	clear: both;
	height: 0;
	width: 0;
}

.reply-list {
	padding-left: 88px;
	clear: both;
	margin-top: 15px;
}
/**
 * Avatar
 ---------------------------*/
.comments-list .comment-avatar {
	width: 65px;
	height: 65px;
	position: relative;
	z-index: 99;
	float: left;
	border: 3px solid #FFF;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
	-webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.2);
	-moz-box-shadow: 0 1px 2px rgba(0,0,0,0.2);
	box-shadow: 0 1px 2px rgba(0,0,0,0.2);
	overflow: hidden;
}

.comments-list .comment-avatar img {
	width: 100%;
	height: 100%;
}

.reply-list .comment-avatar {
	width: 50px;
	height: 50px;
}

.comment-main-level:after {
	content: '';
	width: 0;
	height: 0;
	display: block;
	clear: both;
}
/**
 * Caja del Comentario
 ---------------------------*/
.comments-list .comment-box {
	float: left;
	position: relative;
	-webkit-box-shadow: 0 1px 1px rgba(0,0,0,0.15);
	-moz-box-shadow: 0 1px 1px rgba(0,0,0,0.15);
	box-shadow: 0 1px 1px rgba(0,0,0,0.15);
}

.comments-list .comment-box:before, .comments-list .comment-box:after {
	content: '';
	height: 0;
	width: 0;
	position: absolute;
	display: block;
	border-width: 10px 12px 10px 0;
	border-style: solid;
	border-color: transparent #FCFCFC;
	top: 8px;
	left: -11px;
}

.comments-list .comment-box:before {
	border-width: 11px 13px 11px 0;
	border-color: transparent rgba(0,0,0,0.05);
	left: -12px;
}

.reply-list .comment-box {
    width: 30rem;
    hyphens: auto;
}
.comment-box .comment-head {
	background: #FCFCFC;
	padding: 10px 12px;
	border-bottom: 1px solid #E5E5E5;
	overflow: hidden;
	-webkit-border-radius: 4px 4px 0 0;
	-moz-border-radius: 4px 4px 0 0;
	border-radius: 4px 4px 0 0;
    width: 30rem;
    hyphens: auto;
}

.comment-box .comment-head i {
	float: right;
	margin-left: 14px;
	position: relative;
	top: 2px;
	color: #A6A6A6;
	-webkit-transition: color 0.3s ease;
	-o-transition: color 0.3s ease;
	transition: color 0.3s ease;
}

.comment-box .comment-head i:hover {
	color: #03658c;
}

.comment-box .comment-name {
	color: #283035;
	font-size: 17px;
	font-weight: 700;
	float: left;
	margin-right: 10px;
}

.comment-box .comment-name a {
	color: #283035;
}

.comment-box .comment-head span {
	float: left;
	color: #999;
	font-size: 13px;
	position: relative;
	top: 1px;
}

.comment-box .comment-content {
	background: #FFF;
	padding: 12px;
	font-size: 15px;
	color: #595959;
	-webkit-border-radius: 0 0 4px 4px;
	-moz-border-radius: 0 0 4px 4px;
	border-radius: 0 0 4px 4px;
    width: 30rem;
    hyphens: auto;
}

.comment-box .comment-name.by-author, .comment-box .comment-name.by-author a {color: #03658c;}


/** =====================
 * Responsive
 ========================*/
// @media only screen and (max-width: 766px) {
// 	.& {
// 		width: 480px;
// 	}

// 	.comments-list .comment-box {
// 		width: 390px;
// 	}

// 	.reply-list .comment-box {
// 		width: 320px;
// 	}
// }
`