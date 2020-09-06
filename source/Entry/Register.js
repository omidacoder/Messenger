import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, Image, StatusBar,ToastAndroid} from 'react-native'
import {Text , View , Container,Content,Form,Item,Input,Label,Button,Header,Body} from "native-base";
import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'
import AsyncStorage from '@react-native-community/async-storage';
import {Actions} from 'react-native-router-flux'
import API from "../Connection/API";
export default class Register extends React.Component{

    componentDidMount(): void {
        StatusBar.setHidden(false,'fade');
    }

    sendRegisterRequest(){
        let Email = this.state.email;
        let Password = this.state.password;
        let Confirm = this.state.confirm;
        if(Password  === Confirm){

            API.upload('http://192.168.43.162:8000/registration', {

                    email_address: Email,
                    password: Password,
                    pass_confirmation: Confirm,

            },'POST').then(r => {
                if(r.status === 'successful')
                {
                    this.storeData();
                    ToastAndroid.show("asldkasl",ToastAndroid.LONG);
                    Actions.verification();
                }
            });

        }
    }

    storeData = async () => {
        try {
             await AsyncStorage.setItem('email', this.state.email);
        } catch (e) {
            // saving error
            ToastAndroid.show("error happened in storing email" , ToastAndroid.LONG);
        }
    };

    constructor(props){
        super(props);
        this.state  = {
            email : "",
            password : "",
            confirm : "",
        }
    }

    render(){
        return(
            <Container style={{flexDirection: 'column-reverse'}}>
                <StatusBar backgroundColor="orange" barStyle="light-content" />
                <AnimatedLinearGradient customColors={presetColors.instagram} speed={4000}/>
                <View >

                    <View style={styles.formContainerStyle}>
                        <Form style={styles.formStyle}>
                            <Item  floatingLabel  style={{color : 'orange',marginTop:60}} >
                                <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan'}}>ایمیل</Label>
                                <Input style={{color : 'orange'}} ref= {(el) => { this.email = el; }} onChangeText={(email) => this.setState({email})}
                                       value={this.state.text} />
                            </Item>
                            <Item  floatingLabel  style={{color : 'orange',marginTop:0}} >
                                <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan'}}>رمز عبور</Label>
                                <Input style={{color : 'orange'}} ref= {(el) => { this.password = el; }} onChangeText={(password) => this.setState({password})}
                                       value={this.state.text} />
                            </Item>
                            <Item  floatingLabel  style={{color : 'orange',marginTop:0}} >
                                <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan'}}>تایید رمز عبور</Label>
                                <Input style={{color : 'orange'}} ref= {(el) => { this.confirm = el; }} onChangeText={(confirm) => this.setState({confirm})}
                                       value={this.state.text} />
                            </Item>
                            <TouchableOpacity onPress={() => this.sendRegisterRequest()} activeOpacity={.8} style={{elevation : 5 ,backgroundColor: 'orange',padding: 10,marginTop : 60, borderRadius:20}}  full>
                                <Text style={{color : 'white',textAlign : 'center', fontFamily: 'Lalezar-Regular'}}>ثبت نام</Text>
                            </TouchableOpacity>

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
                        <Text style={{color : 'white' , textAlign : 'center' , fontFamily: 'Lalezar-Regular'}}>صفحه ثبت نام</Text>
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
        paddingLeft : 30,
        paddingRight : 30,
        paddingTop : 0,
        justifyContent : 'flex-start',
        width : Dimensions.get('window').width,
        height : Dimensions.get('window').height * 3 / 5,
    }
});