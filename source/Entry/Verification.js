import React from 'react';
import {Container, Header, Icon, Left, Right, Text,Content,View,Button} from 'native-base';
import {Actions} from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import {Dimensions, StatusBar, StyleSheet, ToastAndroid} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import {TextInput} from "react-native";
import API from "../Connection/API";

let Email = [];
export default class Verification extends  React.Component{
    constructor(props){
        super(props);
        StatusBar.setHidden(false, 'fade');
        StatusBar.setBackgroundColor('orange', true);
    }
    verify(code)
    {
        console.log(code);
        let myPromise = Promise.resolve(this.getData());
        myPromise.then(
            value=>{
                API.upload('http://192.168.43.162:8000/verification', {

                    verification_code: code,
                    email_address: value,

                },'POST').then(r => {
                    //do something with `r`
                    console.log(r);
                    if(r.status === 'verification_successful')
                    {
                        ToastAndroid.show("Registered successfully",ToastAndroid.LONG);
                        this.storeToken(r.auth_token);
                        Actions.reset('setprofile');
                    }
                });
            }
        );


    }

    storeToken = async (data) => {
        try {
            await AsyncStorage.setItem('token', data);
        } catch (e) {
            // saving error
            ToastAndroid.show("error happened in email" , ToastAndroid.LONG);
        }
    };
    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if(value !== null) {
                return value;
            }
        } catch(e) {
            // error reading value
            ToastAndroid.show("error happened in storing email" , ToastAndroid.LONG);
            return null;
        }
    };
    render(){
        return(
          <Container>
              <Header style={{backgroundColor : 'orange'}}>
                  <Left>
                      <Icon style={{margin : 10 , color : 'white'}} name="md-search"/>
                  </Left>
                  <Right>
                      <Text style={{color : 'white' , margin:10 , fontFamily : 'Lalezar-Regular' }}>پیام رسان احمد</Text>
                      <Icon style={{color:'white' ,margin:10}} name="md-menu" />
                  </Right>

              </Header>
              <Content>
                  <View  style={{flexDirection : 'column' ,  justifyContent: 'center' , padding : 10 }}>
                      <Text style={{ textAlign:'center' , marginTop:150 ,color : 'orange', fontFamily : 'B-Yekan' , fontSize : 15}}> لطفا کد تایید هشت رقمی خود را وارد کنید</Text>
                      <CodeInput containerStyle={{marginTop : 30 , padding : 30}}
                          keyboardType="numeric"
                          codeLength={8}
                          className='border-circle'
                          autoFocus={false} size={30}
                          activeColor='darkorange'
                          inactiveColor='orange'
                          codeInputStyle={{ fontWeight: '600' }}
                                 onFulfill={(code) =>{this.verify(code)} }
                      />
                      {/*<TextInput placeholder="متن پیام شما" style={styles.formStyle} ref= {(el) => { this.message = el; }}*/}
                      {/*           onChangeText={(message) => this.setState({message})} value={this.state.message} />*/}
                      {/*           <Button full style={{marginTop : 20 , backgroundColor : 'orange'}} onPress={() => this.verify()}>*/}
                      {/*               <Text>تایید کد</Text>*/}
                      {/*           </Button>*/}
                      <Text note style={{ textAlign:'center' , marginTop:20, fontFamily : 'B-Yekan' , fontSize : 10}}> کد تایید به آدرس ایمیل شما ارسال شده است و برای شما تا 5 دقیقه اعتبار خواهد داشت </Text>
                  </View>
              </Content>
          </Container>
        );
    }
}
const styles = StyleSheet.create({
   formStyle : {
       justifyContent : 'center',
       alignItems : 'center'

   }
});