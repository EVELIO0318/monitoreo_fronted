import axios from "axios";


const API='http://10.0.100.71:3003/api/filiales';


export const getAllFiliales =async()=>{
    const res = await axios.get(`${API}/AllFiliales`);
    return res.data;
}