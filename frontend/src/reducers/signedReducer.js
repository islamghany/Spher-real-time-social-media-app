export default(state=null,action)=>{
	if(action.type === 'SIGN_IN') return action.payload;
	else if(action.type ==='SIGN_OUT') return null; 
	else return state;
}