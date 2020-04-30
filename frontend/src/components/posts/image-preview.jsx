import React,{Component} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default class LightboxImages extends Component {
  constructor(props) {
    super(props);
 
  }
  render() {
    const {image,closeLightBox} = this.props

    return (
      <div>      
          <Lightbox
            mainSrc={image}
            onCloseRequest={closeLightBox}              
          />
      </div>
    );
  }
}