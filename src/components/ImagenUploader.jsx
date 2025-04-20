import React, { useRef, useState, useEffect } from 'react';

export const ImagenUploader = ({ accept = 'image/*', height='100%', onChange, name, value }) => {
  const inputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    onChange && onChange(e);
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
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
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
        width: '100%',
        minHeight: 200,
        border: '2px dashed #ccc',
        borderRadius: 10,
        // backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: '10px',
      }}
      title="Click o Ctrl+V para pegar imagen"
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{
            height: height,
            width: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        <span style={{ color: '#aaa' }}>Click o Ctrl+V</span>
      )}

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
};
