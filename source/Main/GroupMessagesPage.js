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
import {ChatSchema, MessageSchema} from "../Classes/Schemas";
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
export default class GroupMessagesPage extends React.Component {
    sound = new Sound('frog.ogg');
    componentDidMount(): void {
        StatusBar.setHidden(false, 'fade');
        StatusBar.setBackgroundColor('orange', true);


    }
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            token: "",
            ShowMessage : true,
            messages: [<View style={{justifyContent : 'center' , alignItems : 'center' , flexDirection : 'column' ,marginTop : 50}}>
                <Spinner large color='orange'/>
                <Text note style={{fontFamily:'B-Yekan' ,textAlign : 'center' }}> در حال بارگیری پیام ها</Text>
            </View>],
            username : "",
            socket_id : '',
            ws : this.props.ws,
            Random : Math.random()
        };
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this);
        this.setUsernameState();
        //here we need to get all messages
            this.getAllMessages();

        this.state.ws.onmessage = (message) => {
            this.setState({
                ShowMessage : false
            });
            let text = JSON.parse(message.data);
            //now i should store this message to my database
            let messages = [{message_id:-1,message_text: text.text_message,send_date_time: '',sent_status: 'SENT',sender_username : text.sender_username,message_type: 'text' }];
            DatabaseMethods.SaveMessages(messages);
            //remember to add this message to a group
            if (this.props.channel_id === text.channel_id) {
                if (text.sender_username !== this.state.username) {
                    DatabaseMethods.saveUsers([{username : text.sender_username , name : text.sender_name , family : text.sender_family , biography : '' , socket_id : this.props.channel_id}]);

                    const prevMessages = this.state.messages;
                    if(this.state.ShowMessage === false)
                    this.setState({
                        messages: [...prevMessages,
                            <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                                <Left>
                                    <Message received pic={text.pic_url} senderName={text.sender_name + ' ' + text.sender_family}
                                             content={text.text_message}/>
                                </Left>
                            </ListItem>]
                    });
                    else{
                        this.setState({
                            messages: [
                                <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                                    <Left>
                                        <Message received pic={text.pic_url} senderName={text.sender_name + ' ' + text.sender_family}
                                                 content={text.text_message}/>
                                    </Left>
                                </ListItem>]
                        });
                    }

                    this.sound.play();
                    try {
                        this.scrollView._root.scrollToEnd({animated: true, duration: 500});
                    }
                    catch (e) {

                    }
                }
            }
            else{
                if (text.sender_username !== this.state.username){
                    this.sound.play();

                }
            }



        }

    }
    async getAllMessages() {
        //make an function to check internet and loads here

        const Username = await AsyncStorage.getItem('username');
        API.upload('http://192.168.43.162:8000/api/getmessages', {

            channel_id: this.props.channel_id,
            token: await AsyncStorage.getItem('token'),
            email_address: await AsyncStorage.getItem('email'),
            channel_type : 'gp'

        }, 'POST').then(
            (r) => {
                if (r.status === 'api_get_messages_ok') {
                    if(r.data.length === 0){
                        this.setState({
                            messages : []
                            ,ShowMessage : false
                        });
                        return;
                    }
                    let messagetemplates = [];
                    for (let i =0 ; i<r.data.length;i++){
                        r.data[i].sent_status = 'SENT';
                        r.data[i].chat_socket_id = this.props.channel_id;
                        //saving template
                        if (r.data[i].sender_username === Username)
                            messagetemplates.push(
                                <ListItem thumbnail noIndent style={styles.listSentItemView}>
                                    <Left>
                                        <Message sent senderName={r.data[i].name+ ' '+r.data[i].family} content={r.data[i].message_text}/>
                                    </Left>
                                </ListItem>);

                        else {
                            //so this is not me save this user to database
                            DatabaseMethods.saveUsers([{username:r.data[i].sender_username , name : r.data[i].name , family : r.data[i].family , biography : '' , socket_id:this.props.channel_id  }] , this.props.channel_id)
                            messagetemplates.push(
                                <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                                    <Left>
                                        <Message pic={r.data[i].pic_url} received senderName={r.data[i].name+ ' '+r.data[i].family} content={r.data[i].message_text}/>
                                    </Left>
                                </ListItem>)

                        }

                    }
                    this.setState({
                        messages : [...messagetemplates]
                    });
                    //saving to database
                    DatabaseMethods.SaveMessages(r.data);
                }
                try {
                    this.scrollView._root.scrollToEnd({animated: true, duration: 500});
                }
                catch (e) {

                }
            } , this).catch(e=>{
                //now we should render from local database
            DatabaseMethods.LoadMessages(this.props.channel_id).then( messages => {
                this.renderOfflineMessages(messages);
            }).catch(e=>{
                console.log('Error in Realm Database Happened')
            });
        },this);

    }
    renderOfflineMessages(messages){
        //loading users from database
        DatabaseMethods.LoadUsers(messages[0].chat_socket_id).then(Users=>{
        let messagetemplates = [];

        for (let i =0 ; i<r.data.length;i++){
            let user = {name : '' , family : '' , username : null};
            for (let j =0;j<Users.length;j++){
                if(messages[i].sender_username === Users[j].username){
                    user.name = Users[j].name;
                    user.family = Users[j].family;
                    user.username = Users[j].username;
                }
            }
            //saving template
            if (messages[i].sender_username === Username)
                messagetemplates.push(
                    <ListItem thumbnail noIndent style={styles.listSentItemView}>
                        <Left>
                            <Message sent senderName={user.name+ ' '+user.family} content={messages.message_text}/>
                        </Left>
                    </ListItem>);

            else {
                messagetemplates.push(
                    <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                        <Left>
                            <Message received senderName={user.name+ ' '+user.family} content={messages.message_text}/>
                        </Left>
                    </ListItem>)

            }

        }
        this.setState({
            messages : [...messagetemplates]
        });
        }).catch(e=>{
            console.log('Error in Realm Database Happened')
        });
    }
    async setUsernameState(){
        const Username = await AsyncStorage.getItem('username');
        this.setState({
            username : await AsyncStorage.getItem('username')
        });
    }

    async sendClicked() {
        this.setState({
            ShowMessage : false
        });
        const Name = await AsyncStorage.getItem('name');
        const Family = await AsyncStorage.getItem('family');
        const prevMessages = this.state.messages;
        if(this.state.ShowMessage === false)
        this.setState({
            messages: [...prevMessages ,  <ListItem thumbnail noIndent style={styles.listSentItemView}>
                <Left>
                    <Message sent senderName={Name + ' ' + Family} content={this.state.message}/>
                </Left>
            </ListItem>]
        });
        else{
            this.setState({
                messages: [  <ListItem thumbnail noIndent style={styles.listSentItemView}>
                    <Left>
                        <Message sent senderName={Name + ' ' + Family} content={this.state.message}/>
                    </Left>
                </ListItem>]
            });
        }
        this.state.ws.send(JSON.stringify({
            type: "realtime_send_message",
            m_text: this.state.message,
            m_type : 'text',
            m_sender : this.state.username,
            m_belongs_to : this.props.channel_id,
            m_group_type : 'gp',
        }));
        //saving to database later
        try {
            this.scrollView._root.scrollToEnd({animated: true, duration: 500});
        }
        catch (e) {

        }

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
                    <TouchableOpacity style={{marginTop : 10}} onPress={()=>Actions.push('group_info' , { groupName : this.props.group_name , group_description : this.props.group_description ,type : 'GROUP', group_num_of_members : this.props.group_num_of_members , channel_id : this.props.channel_id})}>
                        <Body style={{flexDirection: 'row',paddingBottom : 5}}>
                            <Thumbnail square style={{borderRadius: 1000, height: 40, width: 40}}
                                       source={{uri : 'http://192.168.43.162:8000'+this.props.pic+'?rnd='+this.state.Random}} />
                            <View style={{flexDirection : 'column',justifyContent : 'flex-start'}}><Text style={{color: 'white', marginLeft: 10, fontFamily: 'B-Yekan'}}>{this.props.group_name} </Text>
                                <Text note style={{color : 'white', marginLeft: 10 , fontSize : 10 ,justifyContent : 'flex-start' , textAlign: 'left', fontFamily: 'B-Yekan'}}>{this.props.group_num_of_members} نفر</Text></View>


                        </Body>
                    </TouchableOpacity>

                    <Right>

                        <Icon style={{color: 'white', margin: 10}} name="md-more"/>
                    </Right>

                </Header>
                <Content style={{marginBottom : 50}}
                         ref={ref => this.scrollView = ref}>

                    <List style={styles.list} ref={(el) => {
                        this.list = el;
                    }}>
                        {this.state.messages}
                    </List>

                </Content>
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
        tintColor: 'orange',


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
    list: {
    },
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