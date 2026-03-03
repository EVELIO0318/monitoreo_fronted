import axios from "axios";


const API='http://10.0.100.71:3003/api/filiales';


export const getAllFiliales =async(IDfilial)=>{
    const res = await axios.get(`${API}/circuits`,
        {
        params: {IDfilial},
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
}