import React from 'react';
import {Header, Content, View, Button, Footer, Container, Left, Icon, Right, Text, Thumbnail, Input} from "native-base";
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from "react-native-router-flux";
import {Hoshi, Isao, Sae, Kohana, Hideo} from 'react-native-textinput-effects'
import {Dimensions, Image, ImageBackground, StatusBar, ToastAndroid, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {getData, setToken, setEmail} from './../Classes/DataKeys'
import API from "../Connection/API";
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
export default class SetProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.real_name ? props.real_name : '',
            family: props.real_family ? props.real_family : '',
            bio: props.real_biography ? props.real_biography : '',
            username: props.real_username ? props.real_username : '',
            isModalVisible : false,
            picture : null,
            radius : 100000
        };
        StatusBar.setBackgroundColor('orange');
    }

    skipPressed() {
        Actions.reset('drawer')
    }

   async sendUserInfoRequest() {

        const Name = this.state.name;
        const Family = this.state.family;
        const Bio = this.state.bio;
        const Username = this.state.username;
        const Things = {Name , Family , Bio , Username};
        this.storeThings(Things);
        const Email =  await AsyncStorage.getItem('email');
        const Token = await AsyncStorage.getItem('token');
        // const Form = new FormData();
        // Form.append('firstname' , Name);
        // Form.append('lastname' , Family);
        // Form.append('username' , Username);
        // Form.append('biography' , Bio);
        // Form.append('tokem',Token);
        // Form.append('email_address' , Email);
        // Form.append('picture' , this.state.picture);
       console.log('picture is' + JSON.stringify(this.state.picture));
        API.upload('http://192.168.43.162:8000/api/userprofile', {

            firstname: Name,
            lastname: Family,
            username: Username,
            biography: Bio,
            token: Token,
            email_address: Email,
            picture : this.state.picture,



        },'PUT').then(r => {
            if (r.status === 'api_update_profile_ok') {
                ToastAndroid.show("با موفقیت ثبت گردید" , ToastAndroid.LONG);
                this.updateMyProfilePic(r.pic_url);
                this.skipPressed();
            }
        });


    }
    async updateMyProfilePic(pic){
        await AsyncStorage.setItem('pic' ,pic)
    }
    storeThings = async (data) => {
        try {
            await AsyncStorage.setItem('name', data.Name);
            await AsyncStorage.setItem('family', data.Family);
            await AsyncStorage.setItem('bio', data.Bio);
            await AsyncStorage.setItem('username', data.Username);
        } catch (e) {
            // saving error
            ToastAndroid.show("error happened in email" , ToastAndroid.LONG);
        }
    };
    render() {
        return (
            <Container>
                <Header style={{backgroundColor: 'orange'}}>
                    <Left>
                        <TouchableOpacity onPress={() => this.skipPressed()}>
                            <Text style={{fontFamily: "Lalezar-Regular", color: 'white'}}>رد شدن</Text>
                        </TouchableOpacity>
                    </Left>
                    <Right>
                        <Text style={{color: 'white', margin: 10, fontFamily: 'Lalezar-Regular'}}>اطلاعات کاربری</Text>
                        <TouchableOpacity onPress={() => this.sendUserInfoRequest()}>
                            <Icon style={{color: 'white', margin: 10}} name="md-checkmark-circle-outline"/>
                        </TouchableOpacity>
                    </Right>

                </Header>
                <Content>
                    <View style={{flexDirection: 'row', justifyContent: 'center', width: '100%'}}>

                        <ImageBackground source={this.state.picture === null ? require('./../assets/images/default.jpg') : {uri : this.state.picture.uri}} style={{
                            marginTop: 30,
                            justifyContent: 'center',
                            borderRadius: this.state.radius,
                            alignItems: 'center',
                            width: Dimensions.get('window').width * 3 / 7,
                            height: Dimensions.get('window').width * 3 / 7
                        }}
                          imageStyle={{borderRadius : 1000000}}
                        >
                            <Icon name="ios-add-circle" style={{
                                fontSize: 60,
                                color: 'orange',
                                marginTop: Dimensions.get('window').width * 3 / 10,
                                marginRight: Dimensions.get('window').width * 3 / 10
                            }} onPress={()=>this.toggleModal()}/>
                        </ImageBackground>

                    </View>
                    <View style={{padding: 20}}>
                        <Kohana
                            style={{
                                borderRadius: 10,
                                fontFamily: 'B-Yekan',
                                backgroundColor: '#f9f5ed',
                                paddingBottom: 10,
                                textAlign: 'right',
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}
                            label={'نام'}
                            iconClass={MaterialsIcon}
                            iconName={'person'}
                            iconColor={'orange'}
                            inputPadding={16}
                            labelStyle={{color: 'orange', marginLeft: Dimensions.get('window').width * 2 / 3}}
                            inputStyle={{color: 'orange', textAlign: 'right'}}
                            labelContainerStyle={{paddingBottom: 10}}
                            iconContainerStyle={{padding: 10}}
                            ref={(el) => {
                                this.name = el;
                            }}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        <Kohana
                            style={{
                                borderRadius: 10,
                                fontFamily: 'B-Yekan',
                                backgroundColor: '#f9f5ed',
                                paddingBottom: 10,
                                textAlign: 'right',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 20
                            }}
                            label={'نام خانوادگی'}
                            iconClass={MaterialsIcon}
                            iconName={'person-outline'}
                            iconColor={'orange'}
                            inputPadding={16}
                            labelStyle={{color: 'orange', marginLeft: Dimensions.get('window').width / 2}}
                            inputStyle={{color: 'orange', textAlign: 'right'}}
                            labelContainerStyle={{paddingBottom: 10}}
                            iconContainerStyle={{padding: 10}}
                            ref={(el) => {
                                this.family = el;
                            }}
                            onChangeText={(family) => this.setState({family})}
                            value={this.state.family}

                        />
                        <Kohana
                            style={{
                                borderRadius: 10,
                                fontFamily: 'B-Yekan',
                                backgroundColor: '#f9f5ed',
                                paddingBottom: 10,
                                textAlign: 'right',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 20
                            }}
                            label={'بیو'}
                            iconClass={MaterialsIcon}
                            iconName={'edit'}
                            iconColor={'orange'}
                            inputPadding={16}
                            labelStyle={{color: 'orange', marginLeft: Dimensions.get('window').width * 2 / 3}}
                            inputStyle={{color: 'orange', textAlign: 'right'}}
                            labelContainerStyle={{paddingBottom: 10}}
                            iconContainerStyle={{padding: 10}}
                            ref={(el) => {
                                this.bio = el;
                            }}
                            onChangeText={(bio) => this.setState({bio})}
                            value={this.state.bio}

                        />
                        <Kohana
                            style={{
                                borderRadius: 10,
                                fontFamily: 'B-Yekan',
                                backgroundColor: '#f9f5ed',
                                paddingBottom: 10,
                                textAlign: 'right',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 20
                            }}
                            label={'نام کاربری'}
                            iconClass={MaterialsIcon}
                            iconName={'credit-card'}
                            iconColor={'orange'}
                            inputPadding={16}
                            labelStyle={{color: 'orange', marginLeft: Dimensions.get('window').width / 2 + 20}}
                            inputStyle={{color: 'orange', textAlign: 'right'}}
                            labelContainerStyle={{paddingBottom: 10}}
                            iconContainerStyle={{padding: 10}}
                            ref={(el) => {
                                this.username = el;
                            }}
                            onChangeText={(username) => this.setState({username})}
                            value={this.state.username}

                        />
                        <Text note style={{textAlign: 'center', marginTop: 30}}>
                            نام کاربری میتواند شامل حروف انگلیسی و اعداد و آندرلاین باشد و نباید توسط شخص دیگری انتخاب
                            شده باشد
                        </Text>
                    </View>
                </Content>
                <Modal
                    backdropTransitionInTiming={1}
                    backdropTransitionOutTiming={1}
                    animationIn={'slideInUp'}
                    useNativeDriver={true}
                    backdropOpacity={.3}
                    swipeDirection={['down']}
                    onSwipeComplete={() => {this.toggleModal()}}
                    isVisible={this.state.isModalVisible}
                    style={{justifyContent: 'flex-end', margin: 0 , height : 100}}>
                    <View style={{
                        flex: .2,
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderTopLeftRadius : 30,
                        borderTopRightRadius : 30,
                        padding : 45
                    }}>

                            <Button full style={{backgroundColor : 'orange'}} onPress={()=>this.getImageFromCamera()}>
                                <Text style={{color : 'white' , fontFamily : 'B-Yekan'}}>عکس گرفتن با دوربین</Text><Icon name='ios-camera' color={'white'}/>
                            </Button>
                            <Button full style={{backgroundColor : 'orange'}} onPress={()=>this.getImageFromGallery()}>
                                <Text style={{color : 'white' , fontFamily : 'B-Yekan'}} >انتخاب عکس از گالری</Text><Icon name='ios-albums' color={'white'}/>
                            </Button>
                        </View>


                </Modal>
            </Container>

        )
    }
    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };
    getImageFromCamera(){
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);
            this.setState({
                picture : {
                    uri : image.path,
                    type : image.mime,
                    name : 'photo.jpg'
                }
            })
            //create object with uri, type, image name
            // let photo = {
            //     uri: image.path,
            //     type: image.mime,
            //     name: 'photo.jpg',
            // };
            // let formData = new FormData();
            // formData.append('picture', photo);

            //upload photo with upload method later
        });
    }
    getImageFromGallery(){
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            this.setState({
                picture : {
                    uri : image.path,
                    type : image.mime,
                    name : 'photo.jpg'
                }
            })
        });
    }

}