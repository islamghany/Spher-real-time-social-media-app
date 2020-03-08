import React from 'react';
import spinner from "../assets/icons/rolling.gif"
const Loading =(props)=>{
	return <div style={styles.container}>
       <img 
       height="40rem"
       width="40rem"
        src={spinner} 
        {...props}
        alt='loading..' />
	</div>
}
const styles ={
	container:{
		width:'100%',
		height:'100%',
		display:'flex',
		alignItems:'center',
		justifyContent:'center'
	},
	
}
export default Loading;
