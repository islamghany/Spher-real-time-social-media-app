export default(state={posts:[],length:0},action)=>{
    switch (action.type) {
    	case 'FETCH_POSTS':
    		return {posts:[...state.posts,...action.payload.posts],length:action.payload.length};
        case 'CREATE_POST':
            return {posts:[action.payload,...state.posts],length:state.length+1};
         case 'DELETE_POST':
            return {posts:[...state.posts.filter(item=>item._id !== action.payload)],length:state.length-1}             
         case 'EDIT_POST':
            return {posts:[...state.posts.map(item=>{ 
                 if(item._id === action.payload.id)
                  item.title=action.payload.title;
                 return item})],length:state.length}              	
        default:
    		return state;
    }
}