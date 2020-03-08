export default(state=[],action)=>{
    switch (action.type) {
    	case 'FETCH_POSTS':
    		return action.payload
        case 'CREATE_POST':
            return [action.payload,...state];
         case 'DELETE_POST':
            return state.filter(item=>item._id !== action.payload);   
    	default:
    		return state;
    }
}