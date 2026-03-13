import React from 'react';

export const VideoThumbnailCellRenderer = (props) => {
    const url = props.value;

    if (!url) return null;

    let thumbnailUrl = null;

    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
        thumbnailUrl = `https://img.youtube.com/vi/${match[1]}/0.jpg`;
    }

    const handleClick = () => {
        window.open(url, '_blank');
    };

    return (
        <div
            onClick={handleClick}
            style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%'
            }}
            title="Ver Video"
        >
            {thumbnailUrl ? (
                <img
                    src={thumbnailUrl}
                    alt="Video View"
                    style={{
                        height: '40px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                />
            ) : (
                <div style={{ fontSize: '24px', color: '#dc3545' }}>
                    <i className="bi bi-youtube"></i>
                </div>
            )}
        </div>
    );
};
