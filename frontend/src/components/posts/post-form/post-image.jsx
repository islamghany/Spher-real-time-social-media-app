import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Zoom from "react-reveal/Zoom";
import { Crop, Close } from "../../../assets/icons/icons";

const PostImage = React.memo(({ previewUrl, removeImage, setImgData }) => {
  const [crop, setCrop] = useState(null);
  const CropperRef = useRef(0);

  return (
    <div>
      {crop && (
        <div className="modal__container">
          <div className="modal">
            <div
              className="modal__body cropper"
              onClick={(e) => e.stopPropagation()}
            >
              <Cropper
                ref={CropperRef}
                src={previewUrl}
                style={{ height: "80vh", width: "100%" }}
                // Cropper.js options
                zoomable={false}
                aspectRatio={1}
                viewMode={2}
                responsive={true}
                guides={false}
              />
              <div className="modal__footer">
                <button
                  className="btn btn--outlined-danger"
                  onClick={() => setCrop(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--contained-success"
                  onClick={() => {
                    setCrop(null);
                    setImgData(CropperRef.current.cropper.getData());
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {previewUrl ? (
        <div className="form__images--container">
          <div className="form__images--row">
            <div>
              <Zoom>
                <div className="img">
                  <img src={previewUrl} alt="aa" />
                </div>
              </Zoom>
            </div>
            <div className="form__images--options">
              <span className="icon del" onClick={removeImage}>
                <Close width="2.2rem" height="2.2rem" fill="#fff" />
              </span>
              <span
                className="icon crop"
                onClick={() => {
                  setCrop(true);
                }}
              >
                <Crop width="2.2rem" height="2.2rem" fill="#fff" />
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});
export default PostImage;
