export default(state=null,action)=>{
	switch (action.type) {
		case 'LOGIN_TOKEN':
			return action.payload
		default:
			return state;
	}
}