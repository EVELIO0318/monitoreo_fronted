import axios from "axios";

export const guardarIncidencia =async(formData)=>{
    const response = await axios.post(
      "http://10.0.100.71:3003/api/incidencias/guardarIncidencia",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
}


export const traerIncidenciasFilial =async(filial)=>{
    if (!filial) {
      return false;
    }else{
      const res = await axios.get(`http://10.0.100.71:3003/api/incidencias/incidenciasporid`,
         {
         params: {"IDfilial": filial},
         headers: {
           "Content-Type": "multipart/form-data",
         },
       }
     );
     
     return res.data;
    }
}


export const traerIncidenciasFecha=async(FechaI,FechaF)=>{

    
    const res = await axios.get(`http://10.0.100.71:3003/api/incidencias/incidenciasporfecha`,
         {
         params: {"FechaI": FechaI, "FechaF":FechaF},
         headers: {
           "Content-Type": "multipart/form-data",
         },
       }
     );

     return res;
  
}