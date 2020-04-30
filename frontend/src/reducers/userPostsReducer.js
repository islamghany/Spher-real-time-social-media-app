export default(state=[],action)=>{
	if(action.type === 'MORE_POSTS') return [...state,...action.payload];
    else if(action.type === 'ONE_MORE_POST') return [action.payload,...state];
	else if(action.type === 'DELETE_USER_POST') 
		 return state.filter(item=>item._id !== action.payload)        
	else return state;
}