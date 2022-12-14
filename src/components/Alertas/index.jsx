import React,{useState,useEffect} from "react"
import { View, Text, ScrollView, Dimensions } from 'react-native';
import styles from "./styles"
import CardAlerta from "../CardAlerta"
import { useSelector } from "react-redux";
import IconAD from 'react-native-vector-icons/AntDesign';
import Alerta from "../Alerta"
import { Appbar } from 'react-native-paper';
import Comentarios from "../Comentarios";


export default function Alertas({handlePressButtons,socket}) {

    const [alertas, setAlertas] = useState([])
    const alertasRedux = useSelector(state => state.alertas.alertas)
    const [alertaSeleccionada, setAlertaSeleccionada] = useState(null)
    const [verAlerta, setVerAlerta] = useState(null)
    const [verComentarios, setVerComentarios] = useState(false);
    const [isVisibleAlerta, setIsVisibleAlerta] = useState(false);
    const dimensionesPantalla = Dimensions.get("window");


    useEffect(() => {
        if(alertasRedux !== undefined){
            setAlertas(alertasRedux);
        }
    },[alertasRedux]) 

    return(
        <>
            {isVisibleAlerta ? <Alerta socket={socket} setIsVisibleAlerta={setIsVisibleAlerta} verAlerta={verAlerta} /> : null }
            {verComentarios ? <Comentarios socket={socket} setVerComentarios={setVerComentarios} alertaId={alertaSeleccionada.id} /> : (null)} 

            <View style={styles.containerAlertas} >
            <Appbar.Header style={styles.containerNav}>
                <Appbar.Content style={styles.containerTitle} titleStyle={styles.title} title="Alertas" />
                <Appbar.Action animated={false} style={styles.botonCerrar} onPress={()=>{handlePressButtons("mapa")}} icon={props => <IconAD name="close" size={35} color="black" />} />
            </Appbar.Header>
                <View style={dimensionesPantalla.height < 700 ? styles.alertasPantallaPeque: styles.alertasPantallaGrand}>
                    <ScrollView style={styles.containerAlertasActuales}> 
                       {alertas !== null ? (
                            alertas.map((alerta,i) => (
                               alerta.activa === true ? 
                                    <CardAlerta socket={socket} alerta={alerta} setIsVisibleAlerta={setIsVisibleAlerta} setVerAlerta={setVerAlerta} key={i} setVerComentarios={setVerComentarios} setAlertaSeleccionada={setAlertaSeleccionada}/>
                               :(null)   
                            ))
                        ):(
                            <View style={styles.containerNoAlertas}>
                                <Text style={styles.textoNoAlertas}>No se encontraron alertas.</Text>
                            </View>
                        )}     
    
                    </ScrollView> 
                </View>  
            </View>
        </>
        
    )
}