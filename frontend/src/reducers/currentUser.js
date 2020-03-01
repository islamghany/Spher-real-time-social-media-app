export default(state={},action)=>{
	switch (action.type) {
		case 'USER_DATA_IN':
			return action.payload;
		case 'USER_DATA_OUT':
		    return null	
		default:
			return state;
	}
}