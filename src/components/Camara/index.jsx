import React, { useEffect, useRef, useState } from 'react'
import {View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import styles from './styles';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import IconMI from 'react-native-vector-icons/MaterialIcons'
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';



export default function Camara({setVisibleCamara, setImagen}){
    const [CamaraPermisos, setCamaraPermisos] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [foto, setFoto] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const camaraRef = useRef(null);
    const {width} = useWindowDimensions();
    const height = Math.round((width * 16) / 9);


    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCamaraPermisos(status ==='granted');
        })();
    }, []);

     const TomarFoto = async () => {
        if(camaraRef){
            try{
                const foto = await camaraRef.current.takePictureAsync();
                setFoto(foto.uri)
            } catch (e){
                console.log(e);
            }
        }
       
        
     };

     if(CamaraPermisos === false){
        return <Text>No hay acceso a la camara</Text>
     }

     const guardarImagen = () => {
        setVisibleCamara(false);
        setImagen(foto);
     };

     const Imagen = () => {
        return (
            <>
                <View style={styles.containerImagen}>
                    <Image source={{uri: foto}} style={[styles.camera ,{height: "95%"}]}/>
                </View>
                <View style={styles.containerBotonesFotoTomada}>
                    <TouchableOpacity style={styles.botonFotoTomada} onPress={()=>{setFoto(null)}}>
                        <IconMC
                            name='reload'
                            color='white'
                            size={30}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonFotoTomada} onPress={guardarImagen}>
                        <Icon
                            name='check'
                            color='white'
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
            </>
           
        )
     }

     const Camara = () => {
        return (
            <>  
                <View style={styles.containerBotonesCamara}>
                    <View>
                        <TouchableOpacity onPress={()=>{setVisibleCamara(false)}}>
                            <Icon 
                                name='arrowleft'
                                color='white'
                                size={40}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <View>
                        <TouchableOpacity style={styles.botonFlash} 
                        onPress={()=> 
                            setFlash(flash === Camera.Constants.FlashMode.off 
                            ? Camera.Constants.FlashMode.on
                            : Camera.Constants.FlashMode.off)}>

                            <IconMC 
                                name='flash'
                                color={flash === Camera.Constants.FlashMode.off
                                ? "gray" 
                                : "white"}
                                size={40}
                            />
                                        
                        </TouchableOpacity>
                    </View>
                </View>

                <Camera style={[styles.camera ,{height: height}]} type={type}
                ref={camaraRef} flashMode={flash}
                ratio='16:9'
                />        
                

                <View style={styles.containerBotonSacarFoto}>
                    <TouchableOpacity style={styles.botonSacarFoto} onPress={TomarFoto}>
                        <IconMI 
                            name='motion-photos-on'
                            color='white'
                            size={80}
                        />
                    </TouchableOpacity>
                </View>
            </>    
        )
     }

    return(
        <View style={styles.containerCamara}>
           
           {!foto ? <Camara/> :
            <Imagen />}
            
        </View>

    )
}