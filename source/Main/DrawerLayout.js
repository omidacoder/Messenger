import React from 'react';
import {View, Text, Item, Icon, Thumbnail, Right, Body, Left} from 'native-base';
import {Image, StyleSheet, TouchableNativeFeedback, TouchableOpacity, AsyncStorage, ToastAndroid} from "react-native";

import {Actions} from 'react-native-router-flux';
import ChatsPage from "./ChatsPage";
import SocketConnection from "../Connection/SocketConnection";

export default class DrawerLayout extends React.Component {
    componentWillMount(): void {

    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            family: '',
            email: '',
            pic : '',
            ws : this.props.ws,
            Random : Math.random()
        };
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this)

    }

   async  loadInformation() {

        this.setState({
            name: await AsyncStorage.getItem('name'),
            family: await AsyncStorage.getItem('family'),
            email: await AsyncStorage.getItem('email'),
            pic : await AsyncStorage.getItem('pic')

        })
    }

    async openSetProfile() {
        Actions.setprofile({
            real_name: await AsyncStorage.getItem('name'),
            real_family: await AsyncStorage.getItem('family'),
            real_biography: await AsyncStorage.getItem('bio'),
            real_username: await AsyncStorage.getItem('username')

        });
    }
    openCreatePvChat() {
        Actions.push('search', {ws: SocketConnection.ws});
    }

    openCreateGroupChat(){
        Actions.push('create_group_chat' , {ws : SocketConnection.ws , type : "GROUP"})
    }
    openCreateChannelChat(){
        Actions.push('create_group_chat' , {ws : SocketConnection.ws , type : "CHANNEL"})
    }
    render() {
        this.loadInformation();
        return (
            <View style={drawer.container}>
                <View style={drawer.imageHeader}>
                    <Body>
                        <Thumbnail  style={{margin: 20}} large source={{ uri : 'http://192.168.43.162:8000' +this.state.pic+'?rnd='+this.state.Random , headers: {Pragma: 'no-cache'  }}}/>
                    </Body>
                    <Right>
                        <View style={{margin: 40}}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'B-Yekan',
                                textAlign: 'center'
                            }}>{this.state.name + ' ' + this.state.family}</Text>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'B-Yekan',
                                fontSize: 10,
                                textAlign: 'center'
                            }}>{this.state.email}</Text>
                        </View>
                    </Right>
                    <TouchableOpacity onPress={() => {
                        this.openSetProfile()
                    }}>
                        <Icon name='md-create' style={{color: 'white', marginLeft: 10, marginBottom: 10}}/>
                    </TouchableOpacity>
                </View>
                <View>

                    <Item style={drawer.item}>
                        <TouchableNativeFeedback onPress={()=>this.openCreatePvChat()}>

                            <Right style={{padding: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={drawer.itemTitle}>گفت و گوی جدید</Text>
                                <Icon name="md-person" style={drawer.itemIcon}/>
                            </Right>


                        </TouchableNativeFeedback>
                    </Item>
                    <Item style={drawer.item}>
                        <TouchableNativeFeedback onPress={() => this.openCreateGroupChat()}>

                            <Right style={{padding: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={drawer.itemTitle}>گروه جدید</Text>
                                <Icon name="md-people" style={drawer.itemIcon}/>
                            </Right>


                        </TouchableNativeFeedback>
                    </Item>
                    <Item style={drawer.item}>
                        <TouchableNativeFeedback onPress={() => this.openCreateChannelChat()}>

                            <Right style={{padding: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={drawer.itemTitle}>کانال جدید</Text>
                                <Icon name="md-notifications" style={drawer.itemIcon}/>
                            </Right>


                        </TouchableNativeFeedback>
                    </Item>

                    <Item style={drawer.item}>
                        <TouchableNativeFeedback>

                            <Right style={{padding: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={drawer.itemTitle}>تنظیمات</Text>
                                <Icon name="md-settings" style={drawer.itemIcon}/>
                            </Right>


                        </TouchableNativeFeedback>
                    </Item>
                    <Item style={drawer.item}>
                        <TouchableNativeFeedback onPress={() => {
                            this.Forget();
                            this.Logout()
                        }}>

                            <Right style={{padding: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={drawer.itemTitle}>خروج از حساب کاربری</Text>
                                <Icon name="md-exit" style={drawer.itemIcon}/>
                            </Right>


                        </TouchableNativeFeedback>
                    </Item>
                </View>
            </View>
        )
    }

    async Forget() {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('family');
        await AsyncStorage.removeItem('biography');
        SocketConnection.ws.close();

    }

    Logout() {
        Actions.reset('splash');
    }

}
const drawer = StyleSheet.create({
    container: {
        flex: 1
    },
    imageHeader: {
        height: 180,
        width: '100%',
        backgroundColor: 'orange'
    },
    item: {
        justifyContent: 'flex-end',

    },
    itemTitle: {
        fontFamily: 'B-Yekan',
        color : 'gray'

    },
    itemIcon: {
        marginLeft: 10,
        color: 'orange',

    },

});

