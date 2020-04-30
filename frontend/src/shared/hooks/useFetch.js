import {useState,useEffect,useCallback} from 'react';
import axios from 'axios';

export const useFetch = ()=>{
	const [error,setErrors] = useState(null);
	const [loading,setLoading] = useState(null);

	const request = useCallback(
		async (
			url,
			method='get',
			data=null,
			headers=null,
			params=null)=>{
       try{
       setLoading(true); 
       const resData = await axios({
          	method,
          	url,
          	data,
          	headers,
          	params
          })
        setLoading(false);
        return resData;
      }catch (err) {
        if(err.response){
          setError(err.response.data.message);
        }else{
          setError(err.message);
        }
        setLoading(false);
        throw err;
      }
	},[]);
  const setError=(err)=>{
    setErrors(err);
  }
	const clearError =()=>{
		setError(null);
	}

  return {request,error,loading,clearError,setError};

}