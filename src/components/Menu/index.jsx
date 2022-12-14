import React,{useState} from "react"
import { View, Text, TouchableOpacity} from 'react-native';
import styles from "./styles"
import { Dialog, Portal, Appbar, Provider, Button } from 'react-native-paper';
import IconAD from 'react-native-vector-icons/AntDesign';
import ModalSugerencia from "../ModalSugerencia";
import ModalLugaresProblematicos from "../LugaresProblematicos";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfiguracionNotificaciones from "../ConfiguracionNotificaciones";
import ModalVerSugerencias from "../ModalVerSugerencias";
import {limpiarRedux} from "../../redux/actions/usuarioActions";
import {useSelector, useDispatch} from "react-redux"

export default function Menu({handlePressButtons, navigation, socket}){
    const [isVisibleLugares, setModalLugaresProblematicos] = useState(false);
    const [isVisibleSugerencia, setModalSugerencia] = useState(false);
    const [isVisibleCerrarSesion, setIsVisibleCerrarSesion] = useState(false);
    const [isVisibleVerSugerencias, setIsVisibleVerSugerencias] = useState(false);
    const [isVisibleConfiguracionNotificaciones, setVisibleConfiguracionNotificaciones] = useState(false);
    const usuarioRedux = useSelector(state => state.usuario.usuario);
    const dispatch = useDispatch();

    const eliminarToken = async () => {
        try {
          await AsyncStorage.removeItem('usuario')
          console.log("el usuario fue removido");
        } catch(e) {
            console.log("error al remover el usuario");
        }

        setIsVisibleCerrarSesion(false); 
        dispatch(limpiarRedux());
        handlePressButtons("mapa");
        navigation.navigate("Login");
      
    }
    
    return(
        <>
        {isVisibleLugares ? <ModalLugaresProblematicos setModalLugaresProblematicos={setModalLugaresProblematicos} />:(null)} 
        {isVisibleSugerencia ? <ModalSugerencia setModalSugerencia={setModalSugerencia} socket={socket} />:(null)}
        {isVisibleConfiguracionNotificaciones ? <ConfiguracionNotificaciones setVisibleConfiguracionNotificaciones={setVisibleConfiguracionNotificaciones} />:(null)}
        {isVisibleVerSugerencias ? <ModalVerSugerencias setModalVerSugerencias={setIsVisibleVerSugerencias} socket={socket} />:(null)}
        
        <View style={styles.containerMenu} >
              <View style={styles.menu}>
                <Appbar.Header style={styles.containerNav}>
                    <Appbar.Content style={styles.containerTitle} titleStyle={styles.title} title="Men??" />
                    <Appbar.Action animated={false} style={styles.botonCerrar} onPress={()=>{handlePressButtons("mapa")}} icon={props => <IconAD name="close" size={35} color="black" />} />
                </Appbar.Header>

                <View style={styles.containerOpciones}> 
                    <TouchableOpacity style={styles.opcionPerfil} onPress={()=>{setVisibleConfiguracionNotificaciones(true)}} >
                        <Text style={styles.textOpcion}>Notificaciones</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.opcionPerfil} onPress={()=>{setModalSugerencia(true)}}>
                        <Text style={styles.textOpcion}>Enviar sugerencia</Text>
                    </TouchableOpacity>
                    {
                        usuarioRedux.tipo === "Administrador" ? (
                            <>
                                <TouchableOpacity style={styles.opcionPerfil} onPress={()=>{setIsVisibleVerSugerencias(true)}}> 
                                    <Text style={styles.textOpcion}>Ver sugerencias</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.opcionPerfil} onPress={()=>{setModalLugaresProblematicos(true)}}>
                                    <Text style={styles.textOpcion}>Ver lugares</Text>
                                </TouchableOpacity>
                            </>
                            
                        ) : (null)
                    }
                    
                </View>
                <View style={styles.containerBotonCerrarSesion}>
                    <TouchableOpacity style={styles.botonCerrarSesion} onPress={()=>{setIsVisibleCerrarSesion(true)}} >
                        <Text style={styles.textCerrarSesion}>Cerrar sesi??n</Text>
                    </TouchableOpacity> 
                </View>
              </View>
        
                <Provider >
                    <Portal>
                        <Dialog visible={isVisibleCerrarSesion} onDismiss={()=>setIsVisibleCerrarSesion(false)}>
                            <Dialog.Icon icon="alert" />
                            <Dialog.Title>??Est??s seguro que deseas cerrar sesi??n?</Dialog.Title>
                            <Dialog.Actions>
                            <Button onPress={()=>setIsVisibleCerrarSesion(false)}>Cancelar</Button>
                            <Button onPress={eliminarToken}>Confirmar</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </Provider>
        </View>
        </>
        
    )
}