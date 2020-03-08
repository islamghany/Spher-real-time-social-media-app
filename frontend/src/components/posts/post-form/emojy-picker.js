import React,{useState,useRef,useCallback,useEffect} from "react";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import {Emojy} from '../../../assets/icons/icons.js';
import Zoom from 'react-reveal/Zoom';

const EmojyPicker = ({handleChange})=>{
  const [showPicker , setShowPicker]=useState(false);
  const closePicker=useCallback(()=>{
  setShowPicker(false);
 },[])
    const addEmoji = e => {
  let sym = e.unified.split('-')
  let codesArray = []
  sym.forEach(el => codesArray.push('0x' + el))
  let emoji = String.fromCodePoint(...codesArray)
   handleChange(emoji);
  };
useEffect(()=>{
        window.addEventListener('click',closePicker);
        return ()=>  window.removeEventListener('click',closePicker);
 })
  return <>
   <span className="icon icon__emojy" onClick={(e)=>{
                e.stopPropagation();
                setShowPicker(true);}}>
                <Emojy width="2.2rem" height="2.4rem" fill="#8B8B85" />
                <div className="emjoy">
    <Zoom  style={{height : '0 !important', overflow :'hidden'}} collapse when={showPicker}> <span className="picker" onClick={(e)=>{e.stopPropagation()}}>
   <Picker 
   sheetSize={20}
    darkMode={true}
   emojiTooltip={true}
    title="Spher" set="messenger" onSelect={addEmoji}  />
      </span>
      </Zoom></div>
       </span> 
  </>
}
export default EmojyPicker;