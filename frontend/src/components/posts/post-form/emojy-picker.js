import React, { useState, useRef, useCallback, useEffect } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { Smile } from "../../../assets/icons/icons.js";

const EmojyPicker = ({ handleChange, style ,className}) => {
  const [showPicker, setShowPicker] = useState(false);
  const closePicker = useCallback(() => {
    setShowPicker(false);
  }, []);
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    handleChange(emoji);
  };
  
  return (
    <>
{ showPicker && <div className="icon__wrapperr" onClick={closePicker}></div>}
      <span
        className="icon icon__emojy"
        onClick={(e) => {
          e.stopPropagation();
          setShowPicker((e) => !e);
        }}
      >

        <Smile width="2.2rem" height="2.4rem" fill="#8B8B85" />
        <div className="emjoy">
          {showPicker && (
            <span
              className={`picker ${className ?className:''}`}
              style={style}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >

              <Picker
                sheetSize={20}
                darkMode={true}
                emojiTooltip={true}
                title="Spher"
                set="messenger"
                onSelect={addEmoji}
              />
            </span>
          )}
        </div>
      </span>
    </>
  );
};
export default EmojyPicker;
