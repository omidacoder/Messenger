import React from 'react';
import {
    Text,
    Container,
    Header,
    Left,
    Icon,
    Right,
    Content,
    List,
    ListItem,
    Thumbnail,
    Body,
    Button,
    Spinner
} from "native-base";
import ActionButton from 'react-native-action-button';
import Notify from './../Classes/Notification'
import {Actions} from "react-native-router-flux";
import {
    AsyncStorage,
    StatusBar,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    ToastAndroid,
} from 'react-native';
import Realm from 'realm';
import {MessageSchema, ChatSchema} from "../Classes/Schemas";
import Modal from "react-native-modal";
import DatabaseMethods from "../Database/DatabaseMethods";
import API from "../Connection/API";
import SocketConnection from "../Connection/SocketConnection";
import NetInfo from '@react-native-community/netinfo';
export default class ChatsPage extends React.Component {

    componentWillMount(): void {
        NetInfo.configure({
            reachabilityUrl: 'http://192.168.43.162:8000/api/getuserchats',
        });
    }

    constructor(props) {

        super(props);
        SocketConnection.connect();
        this.state = {
            ChatList: [
                <View style={{justifyContent : 'center' , alignItems : 'center' , flexDirection : 'column' ,marginTop : 50}}>
                <Spinner large color='orange'/>
                    <Text note style={{fontFamily:'B-Yekan' ,textAlign : 'center' }}> در حال بارگیری گفت و گو ها</Text>
                </View>],
            ws: SocketConnection.ws,
            token: "",
            isFirstTime: true,
            Random : Math.random(),
            drawerProps: {
                real_name: '',
                real_family: '',
                real_email: ''

            }

        };
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this);
        // DatabaseMethods.SaveChats([{name : 'omid' , family : 'davar' , biography : 'asdhasj' ,username : 'omidamusic', chatname : 'asdkasjd' , socket_id : 2}]);
        this.setTokenState();
        this.connect();
        this.LoadChats();

    }

    renderOfflineChats(OfflineChats) {
        if (OfflineChats.length > 0) {
            let ChatTemplates = [];
            // console.log('offline chats :' , JSON.stringify(OfflineChats));
            for (let i = 0; i < OfflineChats.length; i++) {

                //saving this chat to database
                ChatTemplates[i] = <ListItem thumbnail noIndent style={styles.listItemView}>

                    <Left>
                        <TouchableOpacity
                            onPress={() => this.redirectToMessagesPage(OfflineChats[i].name, OfflineChats[i].family, OfflineChats[i].biography, OfflineChats[i].username, OfflineChats[i].chatname, OfflineChats[i].socket_id, OfflineChats[i].channel_type, OfflineChats[i].group_name, OfflineChats[i].group_description, OfflineChats[i].group_num_of_members , OfflineChats[i].pic)}>

                            <Thumbnail square style={{borderRadius: 1000}}
                                       source={{uri : 'http://192.168.43.162:8000'+OfflineChats[i].pic+'?rnd='+this.state.Random}}/>

                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <TouchableOpacity
                            onPress={() => this.redirectToMessagesPage(OfflineChats[i].name, OfflineChats[i].family, OfflineChats[i].biography, OfflineChats[i].username, OfflineChats[i].chatname, OfflineChats[i].socket_id, OfflineChats[i].channel_type, OfflineChats[i].group_name, OfflineChats[i].group_description, OfflineChats[i].group_num_of_members ,OfflineChats[i].pic)}>

                            <Text style={{
                                fontFamily: 'B-Yekan',
                                textAlign: 'left'
                            }}>{(OfflineChats[i].channel_type === 'pv') ? OfflineChats[i].name + " " + OfflineChats[i].family : OfflineChats[i].group_name}</Text>
                            <Text note numberOfLines={1}
                                  style={{
                                      textAlign: 'left',
                                      fontFamily: 'B-Yekan'
                                  }}>{(OfflineChats[i].channel_type === 'pv') ? OfflineChats[i].biography : OfflineChats[i].group_description}</Text>

                        </TouchableOpacity>
                    </Body>
                    <Right style={styles.online}>
                        <Icon name={OfflineChats[i].channel_type === 'pv' ? "ios-radio-button-off" : "md-people"}/>
                        <Text note style={{
                            fontFamily: 'B-Yekan',
                            fontSize: 10
                        }}>{OfflineChats[i].channel_type === 'pv' ? "آفلاین" : "گروه"}</Text>
                    </Right>


                </ListItem>
            }
            this.setState({
                ChatList: [...ChatTemplates]
            });
        }
    }


    redirectToMessagesPage(name, family, biography, username, pv_name, channel_id, channel_type, group_name, group_description, group_num_of_members,pic) {
        if (channel_type === "pv")
            Actions.messages({
                username: name,
                family,
                biography,
                realusername: username,
                pv_name,
                ws: SocketConnection.ws,
                channel_id,
                pic
            });
        else if (channel_type === 'gp') {
            Actions.push('group_chat', {
                group_name,
                group_description,
                group_num_of_members,
                channel_id,
                ws: SocketConnection.ws,
                pic
            })
        }
    }

    async LoadChats() {
        const Token = await AsyncStorage.getItem('token');
        const Email = await AsyncStorage.getItem('email');
        // NetInfo.fetch('http://192.168.43.162:8000').then(state =>{
        //     console.log('isConnected Is : '+ state.isInternetReachable);
        //     if(state.isInternetReachable)
        try {
            API.upload('http://192.168.43.162:8000/api/getuserchats', {

                token: Token,
                email_address: Email,

            }, 'POST').then((r) => {
                if (r.status === 'api_get_chats_ok') {
                    let mychats = [];
                    for (let i = 0; i < r.data.length; i++) {
                        if (r.data[i].channel_type === 'pv') {
                            //downloading pictue

                            DatabaseMethods.SaveChats([{
                                name: r.data[i].name,
                                family: r.data[i].family,
                                biography: r.data[i].biography,
                                username: r.data[i].username,
                                socket_id: r.data[i].channel_id,
                                pic: r.data[i].pic_url,
                                chatname: r.data[i].pv_name
                            }])


                        } else if (r.data[i].channel_type === 'gp') {
                            //implement here later
                            DatabaseMethods.saveGroupChats([
                                {
                                    group_name : r.data[i].group_name,
                                    group_des : r.data[i].group_description,
                                    group_socket_id : r.data[i].channel_id,
                                    group_number_of_members : r.data[i].group_num_of_members
                                }
                            ]);
                        }


                        //saving this chat to database
                        mychats[i] = <ListItem thumbnail noIndent style={styles.listItemView}>

                            <Left>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage(r.data[i].name, r.data[i].family, r.data[i].biography, r.data[i].username, r.data[i].pv_name, r.data[i].channel_id, r.data[i].channel_type, r.data[i].group_name, r.data[i].group_description, r.data[i].group_num_of_members, r.data[i].pic_url)}>

                                    <Thumbnail square style={{borderRadius: 1000}}
                                               source={{uri: 'http://192.168.43.162:8000' + r.data[i].pic_url+'?rnd='+this.state.Random}}/>

                                </TouchableOpacity>
                            </Left>
                            <Body>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage(r.data[i].name, r.data[i].family, r.data[i].biography, r.data[i].username, r.data[i].pv_name, r.data[i].channel_id, r.data[i].channel_type, r.data[i].group_name, r.data[i].group_description, r.data[i].group_num_of_members, r.data[i].pic_url)}>

                                    <Text style={{
                                        fontFamily: 'B-Yekan',
                                        textAlign: 'left'
                                    }}>{(r.data[i].channel_type === 'pv') ? r.data[i].name + " " + r.data[i].family : r.data[i].group_name}</Text>
                                    <Text note numberOfLines={1}
                                          style={{
                                              textAlign: 'left',
                                              fontFamily: 'B-Yekan'
                                          }}>{(r.data[i].channel_type === 'pv') ? r.data[i].biography : r.data[i].group_description}</Text>

                                </TouchableOpacity>
                            </Body>
                            <Right style={styles.online}>
                                <Icon name={r.data[i].channel_type === 'pv' ? "ios-radio-button-off" : "md-people"}/>
                                <Text note style={{
                                    fontFamily: 'B-Yekan',
                                    fontSize: 10
                                }}>{r.data[i].channel_type === 'pv' ? "آفلاین" : "گروه"}</Text>
                            </Right>


                        </ListItem>
                    }
                    this.setState({
                        ChatList: [...mychats]
                    });

                }
            }).catch((e) => {
                ToastAndroid.show('مشکل در برقراری ارتباط با سرور', ToastAndroid.LONG);
                const that = this;
                DatabaseMethods.LoadChats().then(chats => {
                    that.renderOfflineChats(chats);
                }, that).catch(e=>{
                    console.log('Error in Realm Database Happened')
                });
                DatabaseMethods.LoadGroupChats().then(chats => {
                    that.renderOfflineChats(chats);
                }, that).catch(e=>{
                    console.log('Error in Realm Database Happened')
                });
            });
        }
        catch (e) {
            const that = this;
            DatabaseMethods.LoadChats().then(chats => {
                that.renderOfflineChats(chats);
            }, that).catch(e=>{
                console.log('Error in Realm Database Happened')
            });
            DatabaseMethods.LoadGroupChats().then(chats => {
                that.renderOfflineChats(chats);
            }, that).catch(e=>{
                console.log('Error in Realm Database Happened')
            });
        }




    }


    openSearch() {
        Actions.push('search', {ws: this.state.ws});
    }

    openCreateGroup() {
        Actions.push('create_group_chat', {ws: this.state.ws, type: "GROUP"})
    }

    openCreateChannel() {
        Actions.push('create_group_chat', {ws: this.state.ws, type: "CHANNEL"})
    }

    render() {
        return (

            <Container>
                <StatusBar backgroundColor="orange" barStyle="light-content"/>
                <Header style={{backgroundColor: 'orange'}}>
                    <Left>
                        <Icon style={{margin: 10, color: 'white'}} name="md-search"/>
                    </Left>
                    <Right>
                        <Text style={{color: 'white', margin: 10, fontFamily: 'Lalezar-Regular'}}>پیام رسان احمد</Text>
                        <Icon style={{color: 'white', margin: 10}} name="md-menu" onPress={() => Actions.drawerOpen()}/>
                    </Right>

                </Header>
                <Content>
                    <List style={styles.list}>
                        {this.state.ChatList}
                    </List>
                </Content>
                <ActionButton buttonColor="orange" useNativeDriver={true}>
                    <ActionButton.Item buttonColor='orange' style={{fontFamily: 'B-Yekan', fontSize: 25}}
                                       onPress={() => {
                                           this.openSearch()
                                       }} title="ایجاد گفت و گوی جدید">
                        <Icon name="md-person" style={{color: 'white'}}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='orange' title="ایجاد گروه جدید" onPress={() => {
                        this.openCreateGroup();
                    }}>
                        <Icon name="md-people" style={{color: 'white'}}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='orange' title="ایجاد کانال جدید" onPress={() => {
                        this.openCreateChannel()
                    }}>
                        <Icon name="md-notifications" style={{color: 'white'}}/>
                    </ActionButton.Item>
                </ActionButton>
                <Modal
                    backdropOpacity={0}
                    backdropTransitionInTiming={100}
                    backdropTransitionOutTiming={100}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    useNativeDriver={true}
                    isVisible={this.state.isModalVisible}

                    style={{justifyContent: 'flex-end', margin: 0}}>
                    <View style={{
                        flex: .1,
                        backgroundColor: 'orange',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Icon style={{color: 'white', alignSelf: 'center', marginLeft: 20}} name="md-close"
                              onPress={() => this.toggleModal()}/>
                        <Text style={{
                            color: 'white',
                            textAlign: 'right',
                            fontSize: 12,
                            alignSelf: 'center',
                            fontFamily: 'B-Yekan'
                        }}>لطفا اتصال خود را به اینترنت بررسی کنید</Text>
                        <Spinner large color='white' style={{width: 20, marginRight: 20, height: '100%'}}/>

                    </View>
                </Modal>
            </Container>

        )
    }

    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };
    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    async setTokenState() {
        this.setState({
            token: await AsyncStorage.getItem('token')
        });
    }
    connect = () => {
        let that = this; // cache the this
        // websocket onopen event listener
        SocketConnection.ws.onopen = async () => {

            console.log('Socket Open!');
            this.LoadChats();
            this.state.ws.send(JSON.stringify({
                type: "register",
                token: await AsyncStorage.getItem('token')
            }));
            // this.setState({ws: ws});
        };

        // websocket onclose event listener
        SocketConnection.ws.onclose = e => {
            setTimeout(function () {
                SocketConnection.connect();
                that.connect();
            }, 1000, that);
            if(this.state.isFirstTime) {
                this.toggleModal();
                //lets check internet connectivity

                this.setState({
                    isFirstTime : false
                })
                //not implemented yetasda


            }
        };

        // websocket onerror event listener

        SocketConnection.ws.onmessage = msg => {
            // Notify("پیام جدید" , "شاید یک پیام جدید داشته باشید");
            let message = JSON.parse(msg.data);
            if (message.type === 'realtime_create_chat_ok') {
                //chaching
                const messages = [{name : message.firstname , family : message.lastname , biography : message.biography , username : message.username , socket_id : Number(message.channel_id)}];
                DatabaseMethods.SaveChats(messages);
                let mychats = this.state.ChatList;
                this.setState({
                    ChatList: [
                        <ListItem thumbnail noIndent style={styles.listItemView}>

                            <Left>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage(message.firstname, message.lastname, message.biography, message.username, message.pv_name, message.channel_id, 'pv', '', '', '' , message.pic_url)}>

                                    <Thumbnail square style={{borderRadius: 1000}}
                                               source={{uri : 'http://192.168.43.162:8000' + message.pic_url+'?rnd='+this.state.Random}}/>

                                </TouchableOpacity>
                            </Left>
                            <Body>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage(message.firstname, message.lastname, message.biography, message.username, message.pv_name, message.channel_id, 'pv', '', '', '' , message.pic_url)}>

                                    <Text style={{
                                        fontFamily: 'B-Yekan',
                                        textAlign: 'left'
                                    }}>{message.firstname + " " + message.lastname}</Text>
                                    <Text note numberOfLines={1}
                                          style={{
                                              textAlign: 'left',
                                              fontFamily: 'B-Yekan'
                                          }}>{message.biography}</Text>

                                </TouchableOpacity>
                            </Body>
                            <Right style={styles.online}>
                                <Icon style={{color: 'lightgray'}} name="ios-radio-button-off"/>
                                <Text note style={{fontFamily: 'B-Yekan', fontSize: 10}}>آنلاین</Text>
                            </Right>


                        </ListItem>, ...mychats]
                })
            }
            if(message.type === 'realtime_create_group_ok'){
                //caching
                console.log('realtime_create_group is :' + JSON.stringify(message));
                DatabaseMethods.saveGroupChats([
                    {
                        group_name : message.gp_name,
                        group_des : message.description,
                        group_socket_id : message.channel_id,
                        group_number_of_members : message.numofmembers
                    }
                ]);
                let mychats = this.state.ChatList;
                this.setState({
                    ChatList: [
                        <ListItem thumbnail noIndent style={styles.listItemView}>

                            <Left>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage('','','','','', message.channel_id, 'gp', message.gp_name, message.description, message.num_of_members , message.pic_url)}>

                                    <Thumbnail square style={{borderRadius: 1000}}
                                               source={require('./../assets/images/group.jpg')}/>

                                </TouchableOpacity>
                            </Left>
                            <Body>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage('','','','','', message.channel_id, 'gp' , message.gp_name, message.description, message.num_of_members , message.pic_url)}>

                                    <Text style={{
                                        fontFamily: 'B-Yekan',
                                        textAlign: 'left'
                                    }}>{message.gp_name}</Text>
                                    <Text note numberOfLines={1}
                                          style={{
                                              textAlign: 'left',
                                              fontFamily: 'B-Yekan'
                                          }}>{message.description}</Text>

                                </TouchableOpacity>
                            </Body>
                            <Right style={styles.online}>
                                <Icon style={{color: 'lightgray'}} name="ios-radio-button-off"/>
                                <Text note style={{fontFamily: 'B-Yekan', fontSize: 10}}>آنلاین</Text>
                            </Right>


                        </ListItem>, ...mychats]
                })
            }

        };
            this.setState({
                ws : SocketConnection.ws
            })
    }


}
const styles = StyleSheet.create({
    listItemView: {

        backgroundColor: 'whitesmoke',
        height: 110

    },
    list: {},
    online: {
        height: 110
    }
});
//commented list item
