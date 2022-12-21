const valorInicial = {
    usuarios: null
};

const state = (state = valorInicial, action) => {
    if(action.type === "daLikeComentario"){
        if(state.usuarios !== null && state.usuarios[0] !== undefined){
            return {usuarios: [...state.usuarios, action.data]} 
        }else{
            if(action.data[0] !== undefined){
                return {usuarios: action.data} 
            }else{
                return {usuarios: [action.data]} 
            }
          
        }
    }else {
        if(action.type === "borrarLikeComentario"){
            if(state.usuarios !== null){

                if(action.position !== null){
                
                    let usuariosConlike1 = state.usuarios.slice(0,action.position);
                    let usuariosConlike2 = state.usuarios.slice(action.position+1);
                
                    let usuariosConlike = usuariosConlike1.concat(usuariosConlike2);

                    if(usuariosConlike[0] !== undefined){
                        return {usuarios: usuariosConlike}
                    }else{
                        return {usuarios: null}
                    }
                     
                }else{
                    return {usuarios: null}
                }
            
            }else{
                return {usuarios: state.usuarios}
            }
        }else{
            if(action.type === "limpiarRedux"){
                return {usuarios: null}
            }else{
                return state
            }
        }
    }   
}

export default state