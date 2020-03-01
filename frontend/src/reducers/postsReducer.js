export default(state=[],action)=>{
    switch (action.type) {
    	case 'FETCH_POSTS':
    		return action.payload
        case 'CREATE_POST':
            return [...state,action.payload];
         case 'DELETE_POST':
            return state.filter(item=>item._id !== action.payload);   
    	default:
    		return state;
    }
}