import React, { useRef, useState, useEffect } from 'react';

export const ImagenUploader = ({ accept = 'image/*', onChange, name, value }) => {
    const inputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const [preview, setPreview] = useState(null);
  
    // Mostrar vista previa cuando se actualiza el value
    useEffect(() => {
      if (value instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(value);
      } else if (typeof value === 'string') {
        setPreview(value); // puede ser base64 o url
      } else {
        setPreview(null);
      }
    }, [value]);
  
    const triggerFileSelect = () => {
      inputRef.current?.click();
    };
  
    const handleFileChange = (e) => {
      onChange && onChange(e); // tu función onFileChange se encarga
    };
  
    const handlePaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.includes('image')) {
          const file = item.getAsFile();
          const syntheticEvent = {
            target: {
              name,
              files: [file],
            },
          };
          onChange && onChange(syntheticEvent);
          break;
        }
      }
    };
  
    useEffect(() => {
      const zone = dropZoneRef.current;
      zone?.addEventListener('paste', handlePaste);
      return () => {
        zone?.removeEventListener('paste', handlePaste);
      };
    }, []);
  
    return (
      <div
        ref={dropZoneRef}
        onClick={triggerFileSelect}
        style={{
          width: 200,
          height: 200,
          border: '2px dashed #ccc',
          borderRadius: 10,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: preview ? `url(${preview})` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        title="Click o Ctrl+V para pegar imagen"
      >
        {!preview && <span style={{ color: '#aaa' }}>Click o Ctrl+V</span>}
        <input
          type="file"
          accept={accept}
          name={name}
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    );
}
