import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
    console.log(box);
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id="inputImage" src={imageUrl} alt="" width="500px" height="auto"/>
                <div className="bounding-box" style={{
                    top: box.topRow,
                    right: box.rightCol,
                    bottom: box.bottomRow,
                    left: box.leftCol
                }}>
                </div>
            </div>
        </div>
    )
}
// https://www.thestatesman.com/wp-content/uploads/2017/08/1493458748-beauty-face-517.jpg

export default FaceRecognition;