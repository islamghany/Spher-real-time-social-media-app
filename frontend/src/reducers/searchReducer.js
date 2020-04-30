export default(state=[],action)=>{
	if(action.type === 'SAVE_SEARCH') return [...state,...action.payload];
    if(action.type === 'NEW_SEARCH') return [...action.payload];
	else return state;
}