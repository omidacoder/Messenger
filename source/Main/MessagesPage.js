import React from 'react';
import Realm from 'realm';
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
    Footer,
    Form, Item, Label, Input, Spinner
} from "native-base";
import ActionButton from 'react-native-action-button';
import {Actions} from "react-native-router-flux";
import {
    StyleSheet,
    TouchableNativeFeedback,
    ScrollView,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    ToastAndroid, StatusBar
} from 'react-native';
import Message from './../components/Message';
import WS from 'react-native-websocket'
import AsyncStorage from '@react-native-community/async-storage';
import Sound from 'react-native-sound';
import DatabaseMethods from "../Database/DatabaseMethods";
import API from "../Connection/API";
import {ChatSchema, GroupSchema, MessageSchema, UserSchema} from "../Classes/Schemas";
import Notify from "../Classes/Notification";
import SocketConnection from "../Connection/SocketConnection";

export default class MessagesPage extends React.Component {
    sound = new Sound('frog.ogg');

    componentDidMount(): void {
        StatusBar.setBackgroundColor('orange', true);
    }

    constructor(props) {
        super(props);
        // console.log('websocket in messages page is : ' + this.props.ws);
        this.state = {
            isFirstTime: true,
            message: "",
            token: "",
            messages: [],
            username: "",
            channel_id: this.props.channel_id,
            pv_name: this.props.pv_name,
            contact_username: this.props.realusername,
            ws: this.props.ws,
            SampleRendered : false
        };
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this);
        this.setUsernameState();
        //here we need to get all messages
        if (this.props.pv_name !== 'NOTSET')
            this.getAllMessages();
        else{
            this.setState({
                messages : []
            });
        }
        this.connect()


    }

    connect(){
        const that = this;
        SocketConnection.ws.onmessage = (message) => {
            let text = JSON.parse(message.data);
            console.log('message from ahmad : ' + message.data);
            if (text.status === "realtime_create_chat_ok") {
                this.setState({
                    pv_name: text.pv_name,
                    channel_id: text.channel_id
                });
                DatabaseMethods.SaveChats([{
                    name: text.firstname,
                    family: text.lastname,
                    biography: text.biography,
                    username: text.username,
                    chatname: text.pv_name,
                    socket_id: Number(text.channel_id)
                }]);
                console.log('text is : ' + text);
                //now we can send the first message
                this.state.ws.send(JSON.stringify({
                    type: "realtime_send_message",
                    m_text: this.state.message,
                    m_type: 'text',
                    m_sender: this.state.username,
                    m_belongs_to: text.channel_id,
                    m_group_type: 'pv',
                }));
                return;

            }
            //now i should store this message to my database
            console.log('real time save message is :'+ JSON.stringify(message));
            if (text.sender_username !== this.state.username && text.sender_username) {
                Notify("پیام جدید", "شاید یک پیام جدید داشته باشید");
            }
            let messages = [{
                message_id: '-1',
                message_text: text.text_message,
                send_date_time: '',
                sent_status: 'SENT',
                sender_username: text.sender_username,
                message_type: 'text',
                chat_socket_id: this.state.channel_id
            }];
            // DatabaseMethods.SaveMessages(messages);
            if (text.sender_username !== this.state.username && text.sender_username === this.state.contact_username) {
                const prevMessages = this.state.messages;
                this.setState({
                    messages: [...prevMessages,
                        <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                            <Left>
                                <Message received isPV={true} content={text.text_message}/>
                            </Left>
                        </ListItem>]
                });

                this.sound.play();
                // this.scrollView._root.scrollToEnd({animated : true,duration : 500});
            }
        };
        SocketConnection.ws.onclose = (e) => {
            setTimeout(function () {
                SocketConnection.connect();
                that.connect();
            }, 1000 , that);


                //lets check internet connectivity

        }

    }
    async setItemForChatsPage(name , family , biography , username , chatname , socket_id){
        await AsyncStorage.setItem('last_chat' , {name,family,biography , username ,chatname,socket_id});
        //continue from here in chats page and load this last chat
    }
    renderOfflineMessages = async (messages)=>{
        const Username =this.state.username;
        const messagetemplates = [];
        for(let i = 0 ;i<messages.length ; i++) {
            if (messages[i].sender_username === Username)
                messagetemplates[i]=
                    <ListItem thumbnail noIndent style={styles.listSentItemView}>
                        <Left>
                            <Message sent isPV={true} content={messages[i].message_text}/>
                        </Left>
                    </ListItem>;

            else {
                messagetemplates[i]=
                    <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                        <Left>
                            <Message received isPV={true} content={messages[i].message_text}/>
                        </Left>
                    </ListItem>;

            }

        }
        if (messagetemplates.length !== 0)
            this.setState({
                messages : [...messagetemplates]
            });
        else{
            this.setState({messages :[]});
        }
};
    async getAllMessages() {
        //make an function to check internet and loads here
        const Username = await AsyncStorage.getItem('username');

        API.upload('http://192.168.43.162:8000/api/getmessages', {

            channel_id: this.state.channel_id,
            token: await AsyncStorage.getItem('token'),
            email_address: await AsyncStorage.getItem('email'),
            channel_type: 'pv'

        }, 'POST').then(
            (r) => {
                if (r.status === 'api_get_messages_ok') {
                    if(r.data.length === 0){
                        this.setState({messages :[<View style={{justifyContent : 'center' , alignItems : 'center' , flexDirection : 'column' ,marginTop : 50}}>
                                <Icon name='md-chatboxes' color={'orange'}/>
                                <Text note style={{fontFamily:'B-Yekan' ,textAlign : 'center' }}> هیچ پیامی موجود نیست</Text>
                            </View>]});
                        return;
                    }
                    let messagetemplates = [];
                    for (let i = 0; i < r.data.length; i++) {
                        console.log('username : '+r.data[i].sender_username);
                        //saving to offline database
                        r.data[i].sent_status = "SENT";
                        r.data[i].message_type = 'Text';
                        r.data[i].chat_socket_id = (this.state.channel_id).toString();
                        //saving template
                        if (r.data[i].sender_username === Username)
                            messagetemplates.push(
                                <ListItem thumbnail noIndent style={styles.listSentItemView}>
                                    <Left>
                                        <Message sent isPV content={r.data[i].message_text}/>
                                    </Left>
                                </ListItem>);

                        else {
                            messagetemplates.push(
                                <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                                    <Left>
                                        <Message pic={r.data[i].pic_url} isPV received content={r.data[i].message_text}/>
                                    </Left>
                                </ListItem>);

                        }


                    }
                    this.setState({
                        messages: [...messagetemplates]
                    });
                    //saving to database
                    // console.log('chats saving : ' + JSON.stringify(r.data));
                    // this.scrollView._root.scrollToEnd({animated : true , duration : 500});
                    DatabaseMethods.SaveMessages(r.data)
                }
            }).catch((e)=>{
            ToastAndroid.show('مشکل در برقراری ارتباط با سرور', ToastAndroid.LONG);
            //lets check internet connectivity
            const that = this;
            DatabaseMethods.LoadMessages(this.state.channel_id).then(messages => {
                console.log('channel id passed to load message is : '+this.state.channel_id + ' and messages loaded : ' + messages);
                that.renderOfflineMessages(messages);
            }, that)
        });

    }
    async setUsernameState() {
        const Username = await AsyncStorage.getItem('username');
        this.setState({
            username: await AsyncStorage.getItem('username')
        });
        // Realm.open({
        //     schema: [ChatSchema, MessageSchema,GroupSchema , UserSchema]
        // }).then((realm) => {
        //     let channel = realm.objects('Chat').filtered('chatname = "' + this.state.pv_name + '"');
        //     //now ready to send message
        //     console.log('channel is :' + JSON.stringify(channel));
        //     this.setState({
        //         channel_id: channel[0].socket_id
        //     });
        //     // setTimeout(()=>{
        //     //     realm.close();
        //     // } , 8000 , realm)
        // }, Username);
    }
    async sendClicked() {

        if(this.state.SampleRendered){
            this.setState({
                SampleRendered : false
            });
            const prevMessages = this.state.messages;
            this.setState({
                messages: [<ListItem thumbnail noIndent style={styles.listSentItemView}>
                    <Left>
                        <Message sent isPV={true} content={this.state.message}/>
                    </Left>
                </ListItem>]
            });
            if (this.state.pv_name === "NOTSET") {
                //now we need to send create chat first
                this.state.ws.send(JSON.stringify({
                    type: "realtime_create_chat",
                    email_address: await AsyncStorage.getItem('email'),
                    username: this.props.realusername,
                    token: await AsyncStorage.getItem('token')

                }));
                return;

            }
            this.state.ws.send(JSON.stringify({
                type: "realtime_send_message",
                m_text: this.state.message,
                m_type: 'text',
                m_sender: this.state.username,
                m_belongs_to: this.state.channel_id,
                m_group_type: 'pv',
            }));

            // this.scrollView._root.scrollToEnd({animated : true,duration : 500});

            return ;
        }
        const prevMessages = this.state.messages;
        this.setState({
            messages: [...prevMessages, <ListItem thumbnail noIndent style={styles.listSentItemView}>
                <Left>
                    <Message sent isPV={true} content={this.state.message}/>
                </Left>
            </ListItem>]
        });
        if (this.state.pv_name === "NOTSET") {
            //now we need to send create chat first
            this.state.ws.send(JSON.stringify({
                type: "realtime_create_chat",
                email_address: await AsyncStorage.getItem('email'),
                username: this.props.realusername,
                token: await AsyncStorage.getItem('token')

            }));
            return;

        }
        this.state.ws.send(JSON.stringify({
            type: "realtime_send_message",
            m_text: this.state.message,
            m_type: 'text',
            m_sender: this.state.username,
            m_belongs_to: this.state.channel_id,
            m_group_type: 'pv',
        }));

        // this.scrollView._root.scrollToEnd({animated : true,duration : 500});

        this.setState({
            message : ''
        })
    }
    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                return value;
            }
        } catch (e) {
            // error reading value
            ToastAndroid.show("error happened in storing email", ToastAndroid.LONG);
            return null;
        }
    };
    render() {
        let myPromise = Promise.resolve(this.getData());
        myPromise.then(
            value => {
                this.state.token = value;
            }
        );

        return (

            <Container>

                <Header style={{backgroundColor: 'orange'}}>
                    <Left>
                        <Icon style={{margin: 10, color: 'white'}} name="md-arrow-back" onPress={() => Actions.pop()}/>

                    </Left>
                    <TouchableOpacity style={{marginTop: 10}} onPress={() => Actions.push('showprofile', {
                        name_of_user: this.props.username,
                        family: this.props.family,
                        biography: this.props.biography,
                        realusername: this.props.realusername,
                        pic : this.props.pic,
                        last_activity: 'recently'
                    })}>
                        <Body style={{flexDirection: 'row'}}>
                            <Thumbnail square style={{borderRadius: 1000, height: 40, width: 40}}
                                       source={{uri : 'http://192.168.43.162:8000'+this.props.pic+'?rnd='+this.state.Random}}/>
                            <Text style={{
                                color: 'white',
                                marginLeft: 10,
                                marginTop: 5,
                                fontFamily: 'B-Yekan'
                            }}>{this.props.username + " " + this.props.family} </Text>

                        </Body>
                    </TouchableOpacity>

                    <Right>

                        <Icon style={{color: 'white', margin: 10}} name="md-more"/>
                    </Right>

                </Header>
                <View style={{flex: 1}}>
                    <Content style={{marginBottom: 50, flex: 1}}
                             ref={ref => this.scrollView = ref}>

                        <List style={styles.list} ref={(el) => {
                            this.list = el;
                        }}>
                            {this.state.messages}
                        </List>

                    </Content>
                </View>
                <Footer style={{bottom: 0, position: 'absolute', backgroundColor: 'white'}}>
                    <View style={styles.bottomViewContainer}>
                        <Icon name="md-link" style={{color: 'white', flex: .1}}/>
                        <Icon name="md-camera" style={{color: 'white', flex: .1}}/>
                        <TextInput placeholder="متن پیام شما" style={styles.formStyle} ref={(el) => {
                            this.message = el;
                        }}
                                   onChangeText={(message) => this.setState({message})} value={this.state.message}/>
                        <TouchableOpacity style={styles.sendButton} onPress={() => this.sendClicked()}>
                            <Icon name="md-send" style={{color: 'orange', textAlign: 'center', alignSelf: 'center'}}/>
                        </TouchableOpacity>

                    </View>
                </Footer>
            </Container>

        )
    }
}

const styles = StyleSheet.create({
    bottomViewContainer: {
        backgroundColor: 'orange',
        width: '100%',
        height: '100%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formStyle: {
        color: 'orange',
        backgroundColor: 'white',
        flex: .6,
        borderRadius: 10,
        fontFamily: 'B-Yekan',
        fontSize: 10,
        paddingRight: 10,
        paddingLeft: 10,


    },
    sendButton: {
        backgroundColor: 'white',
        borderRadius: 60,
        fontFamily: 'B-Yekan',
        height: 40,
        color: 'orange',
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingLeft: 5


    },
    list: {},
    listSentItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        minHeight: 40
    },
    listReceivedItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        minHeight: 20

    }
});
// onContentSizeChange={(contentWidth, contentHeight)=>{
//     this.scrollView.scrollToEnd({animated: true});
// }}