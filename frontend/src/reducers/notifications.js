export default(state=[],action)=>{
	switch(action.type){
		case 'FETCH_NOTIFICATIONS':
		   return [...state,...action.payload];
		case 'ADD_NOTIFY':
		   return [action.payload,...state];
		case 'REMOVE_NOTIFY':
		   return state.filter(item=>item._id != action.payload);   
		default : return state;      
	}
}