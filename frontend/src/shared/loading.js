import React from 'react';
import spinner from "../assets/icons/spinner.gif"
const Loading =(props)=>{
	return <div style={styles.container}>
       <img 
       height="10%"
       width="10%"
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
