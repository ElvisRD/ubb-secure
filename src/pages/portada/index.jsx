import React,{useEffect, useState} from "react";
import {View,Text, Linking, Image, PermissionsAndroid, BackHandler} from "react-native";
import {Provider, Dialog, Portal, Button } from "react-native-paper";
import styles from "./styles";
import {guardarAlertaRedux} from "../../redux/actions/alertasActions";
import {obtenerAlertas} from "../../data/alertas";
import { guardarComentarioRedux } from "../../redux/actions/comentariosActions";
import { daLikeComentarioRedux } from "../../redux/actions/likesActions";
import { daLikeAlertaRedux } from "../../redux/actions/likesActions";
import { guardarSugerenciaRedux } from "../../redux/actions/sugerenciasActions";
import { obtenerSugerencias } from "../../data/sugerencias";
import { useDispatch } from "react-redux";
import {obtenerComentarios} from "../../data/comentarios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guardarUsuarioRedux, guardarUbicacionRedux } from "../../redux/actions/usuarioActions";
import * as Location from 'expo-location';
import Cargando from "../../components/Cargando";



export default function Portada({navigation}){
    const [permisoLocalizacion, setPermisoLocalizacion] = useState(false);
    const [verificarActivacionPermiso, setVerificarActivacionPermiso] = useState(0); 
    const [cargando, setCargando] = useState(false);
   

    const dispatch = useDispatch();

    useEffect(() => {
       const obtenerDatosStorage = async() => {
        try {
          const jsonValue = await AsyncStorage.getItem('usuario')
          const datosUsuario = JSON.parse(jsonValue);
          if(jsonValue !== null){
              
              let permiso = await obtenerPermisoUbicacion();
          
              if(permiso){
                dispatch(guardarUsuarioRedux(datosUsuario));
                getAlertas();
                getComentarios();
              
                if(datosUsuario.tipo === "Administrador"){
                  getSugerencias();
                } 

              }else{
                setPermisoLocalizacion(true)
              }
              
              
              navigation.navigate("Home")
            
          }else{
            navigation.navigate("Login")
          }
        } catch(e) {
          console.log("error al obtener datos");
        }
       }

       const getAlertas = () => {
        const likeAlertas = [];
        obtenerAlertas().then((result) => {
          dispatch(guardarAlertaRedux(result))
           result.map(alerta => {
                 if(alerta.daLikeAlerta[0] !== undefined){
                   alerta.daLikeAlerta.map(like => {
                    likeAlertas.push(like);
                   })
                 }
           }); 
           if(likeAlertas[0] !== undefined){
            dispatch(daLikeAlertaRedux(likeAlertas));
           }
        }).catch((err) => {
           console.log("no se encontraron alertas");
        });
       }

       const getComentarios = () => {
        const likeComentarios = [];
        obtenerComentarios().then((result) => {
          dispatch(guardarComentarioRedux(result))
          result.map(comentario => {
            if(comentario.daLikeComentario[0] !== undefined){
              comentario.daLikeComentario.map(like => {
                likeComentarios.push(like);
              })  
            }
          }); 

          if(likeComentarios[0] !== undefined){
            dispatch(daLikeComentarioRedux(likeComentarios));
          }

        }).catch((err) => {
           console.log("no se encontraron comentarios");
        });
       }

       const getSugerencias = async () => {
        await obtenerSugerencias().then((result) => {
           dispatch(guardarSugerenciaRedux(result))
        }).catch((err) => {
           console.log("no se encontraron sugerencias");
        });
       } 

       const obtenerPermisoUbicacion = async() => {
          
            try {
              const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
             
              if (granted === true) {
                let location = await Location.getCurrentPositionAsync({});
                dispatch(guardarUbicacionRedux(location));
                return true;
              } else {
                setPermisoLocalizacion(true)
              }
            } catch (err) {
              console.log(err);
            }   
       }

       obtenerDatosStorage();
    }, [verificarActivacionPermiso])


    return (
      <>
        {cargando ? <Cargando /> : null}
        <View style={styles.containerPortada}>
            <Text>Portada</Text>
        </View>
        <Provider >
                <Portal>
                          <Dialog visible={permisoLocalizacion} dismissable={false} >
                              <Dialog.Icon icon="alert" />
                              <Dialog.Title>Permiso de localizaci??n</Dialog.Title>
                              <Dialog.Content><Text>Para el correcto funcionamiento de la aplicaci??n es obligatorio el permiso de localizaci??n,
                                si usted rechaza este permiso la aplicaci??n se cerrar??.</Text></Dialog.Content>
                              <Dialog.Actions style={{justifyContent: "center"}}>
                                  <Button onPress={()=> BackHandler.exitApp()}>Rechazar</Button>
                                  <Button onPress={() => Linking.openSettings()}>Ir a Configuraciones</Button>
                                  <Button onPress={()=> setVerificarActivacionPermiso(verificarActivacionPermiso+1)}>Verificar</Button>
                              </Dialog.Actions>
                          </Dialog>
                </Portal>
        </Provider>
      </>
     
      
        
  
    )
    
}