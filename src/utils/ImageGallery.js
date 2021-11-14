import React from 'react';
import ImageGallery from 'react-image-gallery';

export default (props) => {
    return <ImageGallery 
        items={props.items}
        showPlayButton={false}
        infinite={false}
    />
}
