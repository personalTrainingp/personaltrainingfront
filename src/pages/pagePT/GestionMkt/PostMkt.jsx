import { useForm } from '@/hooks/useForm';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

const registerPostMkt = {
	imagesPost: [],
	contenidoPost: '',
	fechaPost: new Date(),
	categoriaPost: 0,
	tagsPost: [],
	usuarioPost: '',
};
export const PostMkt = () => {
	const { formState, contenidoPost, onInputChange, onFileChange } = useForm(registerPostMkt);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formDataFiled, setformDataFiled] = useState(null)
    const [selectedFiled, setselectedFiled] = useState(null);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone()
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const formData = new FormData()
      formData.append('file', file);
      setformDataFiled(formData);
      console.log('asdf');
      reader.onloadend = () => {
        setselectedFiled(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  
	return (
		<form action="#" className="comment-area-box">
			<textarea
				rows={4}
				className="form-control border-0 resize-none"
				placeholder="Escribir cualquier cosa"
				name="contenidoPost"
				onChange={onInputChange}
				value={contenidoPost}
			></textarea>
            <div className="d-flex align-items-center mb-2 p-2 bg-light rounded rounded-2">
                <div className="flex-shrink-0">
                    <i
                        className={classNames(
                            'pi pi-image',
                            'widget-icon',
                            'bg-' + 'secondary' + '-lighten',
                            'text-' + 'secondary'
                        )}
                    />
                </div>
                <div className="flex-grow-1 ms-2">
                    <h5 className="my-0 fw-semibold">{'Imagen'}</h5>
                    <span>50kb</span>
                </div>
            </div>
			<div className="p-2 bg-light d-flex justify-content-between align-items-center">
				
				<div>
					<input
						type="file"
						className="d-none"
						id="image-post"
                        onChange={handleImageChange}
						accept="image/*,video/*"
					/>
					<input
						type="file"
						className="d-none"
						id="files-post"
                        onChange={handleFileChange}
						accept=".pdf,.doc,.docx,.xls,.xlsx"
					/>
					<label htmlFor="image-post">
						<a to="" className="btn btn-sm px-2 font-16 btn-light">
							<i className="uil uil-scenery"></i>
						</a>
					</label>
					<label htmlFor="files-post">
						<a to="" className="btn btn-sm px-2 font-16 btn-light">
							<i className="uil uil-paperclip"></i>
						</a>
					</label>
				</div>
				<button type="submit" className="btn btn-sm btn-success">
					<i className="uil uil-message me-1"></i>Agregar
				</button>
			</div>
		</form>
	);
};
