import React, { Component } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default class LightboxImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
    };
  }
  render() {
    const { photoIndex } = this.state;
    const { images, closeLightBox } = this.props;

    return (
      <div>
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={closeLightBox}
          onMovePrevRequest={() =>
            this.setState({
              photoIndex: (photoIndex + images.length - 1) % images.length,
            })
          }
          onMoveNextRequest={() =>
            this.setState({
              photoIndex: (photoIndex + 1) % images.length,
            })
          }
        />
      </div>
    );
  }
}
