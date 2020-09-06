import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, Image, ToastAndroid, StatusBar} from 'react-native'
import {Text , View , Container,Content,Form,Item,Input,Label,Button,Header,Body} from "native-base";
import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'
import {Actions , ActionConst} from "react-native-router-flux";
import AsyncStorage from "@react-native-community/async-storage";
import API from "../Connection/API";
export default class Login extends React.Component{
    componentDidMount(): void {
        StatusBar.setHidden(true,'fade');
    }

    constructor (props){
        super(props);
        this.state = {
            email : "",
            password : "",
            errorMessage : ''
        };
    }
    sendLoginRequest(){
        let Email = this.state.email;
        let Password = this.state.password;

            API.upload('http://192.168.43.162:8000/login/', {

                email_address: Email,
                password: Password,

            },'POST').then(r => {

                if(r.status === 'api_login_ok')
                {

                    this.storeData(r.auth_token,r.firstname,r.lastname,r.biography,r.username , r.pic_url);
                    Actions.reset('drawer' , { name : r.firstname  , family : r.lastname , biography : r.biography , username : r.username , email : this.state.email });
                }
                else if(r.status === 'api_login_failed'){
                    this.setState({
                        errorMessage : 'نام کاربری و یا رمز عبور اشتباه است'
                    })
                }
            });
    }
    storeData = async (token,first_name , last_name,biography , username , pic) => {
        try {
            await AsyncStorage.setItem('email', this.state.email);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('name',first_name);
            await AsyncStorage.setItem('family',last_name);
            await AsyncStorage.setItem('bio' , biography);
            await AsyncStorage.setItem('username' , username);
            await AsyncStorage.setItem('pic' , pic)
        } catch (e) {
            // saving error
            ToastAndroid.show("error happened in storing email" , ToastAndroid.LONG);
        }
    };
    render(){

        return(


            <Container style={{flexDirection: 'column-reverse',justifyContent:'space-between'}}>

                <AnimatedLinearGradient customColors={presetColors.instagram} speed={4000}/>
                <View >

                    <View style={styles.formContainerStyle}>
                        <Form style={styles.formStyle}>
                            <Item floatingLabel style={{color : 'orange'}}>
                                <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan'}}>ایمیل</Label>
                                <Input style={{color : 'orange'}} ref= {(el) => { this.email = el; }}
                                       onChangeText={(email) => this.setState({email})} value={this.state.email} />
                            </Item>
                            <Item  floatingLabel  style={{color : 'orange'}} >
                                <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan'}}>رمز عبور</Label>
                                <Input style={{color : 'orange'}} ref= {(el) => { this.password = el; }}
                                       onChangeText={(password) => this.setState({password})}  />
                            </Item>
                                <TouchableOpacity activeOpacity={.8} style={{elevation : 5 , backgroundColor: 'orange',padding: 10,marginTop : 60, borderRadius:20}} onPress={ () => this.sendLoginRequest()} full>
                                    <Text style={{color : 'white',textAlign : 'center', fontFamily: 'Lalezar-Regular'}}>ورود</Text>
                                </TouchableOpacity>
                            <Text note style={{color : 'red' , fontFamily : 'B-Yekan' , textAlign :'center' , marginTop : 30 , }}>{this.state.errorMessage}</Text>

                        </Form>
                    </View>
                </View>
                <View style={{justifyContent:'center',alignItems: 'center'}}>
                <Image style={{ width : 100,
                    height : 100,
                    borderRadius : 30,
                    marginTop : 0,
                    marginBottom : 20,
                elevation : 20}} source={require('./../assets/images/telewhite.png')} />
                </View>
                <Header transparent >
                    <Body style={{justifyContent : 'center',alignItems: 'center'}}>
                        <Text style={{color : 'white' , textAlign : 'center' , fontFamily: 'Lalezar-Regular'}}>صفحه ورود</Text>
                    </Body>
                </Header>
            </Container>

        )
    }
}

const styles = StyleSheet.create({
    formContainerStyle : {
        flexDirection : 'column',

    },
   formStyle : {
       backgroundColor : 'white',
       padding : 30,
       justifyContent : 'flex-start',
       width : Dimensions.get('window').width,
       height : Dimensions.get('window').height * 3 / 5,
   }
});