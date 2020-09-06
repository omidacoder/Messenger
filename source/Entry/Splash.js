import React from 'react';
import {Text , Spinner,View} from "native-base";
import {Actions} from "react-native-router-flux";
import AnimatedLinearGradient, {presetColors} from "react-native-animated-linear-gradient";
import {Image, StatusBar, ToastAndroid} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import PushNotification from 'react-native-push-notification';

export default class Splash extends React.Component{
    componentWillMount(){
        setTimeout(() =>{
            const token =  Promise.resolve(this.getData());
        token.then(
                value=>{
                    console.log(value);
                    if(value == null){
                        // here must sync with api that this token exists
                        Actions.reset('first');
                    }
                    else{
                        Actions.reset('drawer');
                    }
                });

        }, 1000)
    }
    componentDidMount(): void {
    }
    getData =async () => {
        try {
            return await AsyncStorage.getItem('token');

        } catch(e) {
            // error reading value
            ToastAndroid.show("error happened in storing email" , ToastAndroid.LONG);
            return null;
        }
    };
    render(){

        return(
            <View style={{flex : 1 , justifyContent:'center',alignItems:'center'}}>
                <AnimatedLinearGradient customColors={presetColors.instagram} speed={4000}/>
            <Text style={{fontSize : 18 , color:'white' , fontFamily : 'Lalezar-Regular'}}>در حال برقراری اتصال با سرور ...</Text>
                <Image style={{ width : 100,
                    height : 100,
                    borderRadius : 30,
                    marginTop : 0,
                    marginBottom : 20,
                    elevation : 20}} source={require('./../assets/images/telewhite.png')} />
                <Spinner large color='white' style={{width : 200 , height : 200}}  />
            </View>
        )
    }
}