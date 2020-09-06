import React from 'react'
import {StatusBar, StyleSheet, ToastAndroid, TouchableOpacity} from "react-native";
import {
    Container,
    Header,
    Icon,
    Left,
    Right,
    Text,
    Content,
    Button,
    List,
    ListItem,
    Thumbnail,
    Body
} from "native-base";
import {Actions} from "react-native-router-flux";
import {Kaede} from 'react-native-textinput-effects';
import Realm from 'realm';
import awaitAsyncGenerator from "@babel/runtime/helpers/esm/awaitAsyncGenerator";
import {AsyncStorage} from 'react-native'
import {ChatSchema} from "../Classes/Schemas";
import API from "../Connection/API";

export default class StartChatPage extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor('orange');
        this.state = {
            name: "",
            Chats: [],
            selected_name: "",
            ws: this.props.ws,
            thename: '',
            family: '',
            biography: ''
        }
    }
    redirectToMessagesPage(username, family, biography, realusername, pv_name,pic) {
        // {username : name , family , biography , realusername : username , pv_name , ws : this.state.ws}
        Actions.pop();
        Actions.messages({ username, family, biography, realusername, pv_name, ws: this.state.ws , pic});
    }

    async searchRequest() {
        const Token = await AsyncStorage.getItem('token');
       API.upload('http://192.168.43.162:8000/api/search', {

            token: Token,
            username: this.state.name,

        }, 'POST').then(r => {
            //do something with `r`
            // console.log(r);
            if (r.status === 'api_search_user_ok') {
                // console.log(r.firstname);
                console.log(r);
                const chats = this.state.Chats;
                this.setState({
                    Chats: [...chats, <ListItem thumbnail noIndent style={styles.listItemView}>

                        <Left>
                            <TouchableOpacity
                                onPress={() => this.redirectToMessagesPage(r.firstname, r.lastname, r.biography, r.username, "NOTSET" , r.pic_url)}>

                                <Thumbnail square style={{borderRadius: 1000}}
                                           source={{uri : 'http://192.168.43.162:8000' + r.pic_url}}/>

                            </TouchableOpacity>
                        </Left>
                        <Body>
                            <TouchableOpacity
                                onPress={() => this.redirectToMessagesPage(r.firstname, r.lastname, r.biography, r.username, "NOTSET" , r.pic_url)}>

                                <Text style={{
                                    fontFamily: 'B-Yekan',
                                    textAlign: 'left'
                                }}>{r.firstname + ' ' + r.lastname}</Text>
                                <Text note numberOfLines={1}
                                      style={{textAlign: 'left', fontFamily: 'B-Yekan'}}>{r.biography}</Text>

                            </TouchableOpacity>
                        </Body>
                        <Right style={styles.online}>
                            <Icon style={{color: 'orange'}} name="md-close" onPress={() => this.cancelSearch()}/>

                        </Right>


                    </ListItem>

                    ],
                    selected_name: this.state.name,

                    thename: r.name,
                    family: r.family,
                    biography: r.biography

                })

            }
        });

    }

    cancelSearch() {
        this.setState({
            Chats: []
        })
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor="orange" barStyle="light-content"/>
                <Header style={{backgroundColor: 'orange'}}>
                    <Left>
                        <Icon style={{margin: 10, color: 'white'}} name="md-arrow-back" onPress={() => Actions.pop()}/>
                    </Left>
                    <Right>
                        <Text style={{color: 'white', margin: 10, fontFamily: 'Lalezar-Regular'}}>جست و جوی کاربر</Text>

                    </Right>

                </Header>
                <Content style={{paddingTop: 100, paddingLeft: 20, paddingRight: 20}}>
                    <Text note style={{fontFamily: 'B-Yekan', marginTop: 0}}>نام کاربری را برای شروع یک گفت و گوی جدید
                        وارد کنید</Text>
                    <Kaede
                        label={'نام کاربری'}
                        inputPadding={10}
                        inputStyle={{marginBottom: 20, borderRadius: 50}}
                        labelContainerStyle={{backgroundColor: '#f9f5ed'}}
                        labelStyle={{textAlign: 'left', fontFamily: 'B-Yekan', color: 'orange'}}
                        ref={(el) => {
                            this.name = el;
                        }}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                    />
                    <Button full style={{backgroundColor: 'orange', textAlign: 'center'}}
                            onPress={() => this.searchRequest()}>
                        <Text style={{color: 'white', fontFamily: 'B-Yekan'}}>جست و جو</Text>
                    </Button>
                    <Text note style={{textAlign: 'center', fontFamily: 'B-Yekan', marginTop: 20, fontSize: 15}}> لیست
                        افراد یافت شده</Text>
                    <List style={styles.list}>

                        {this.state.Chats}

                    </List>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    listItemView: {

        backgroundColor: 'whitesmoke',
        height: 75,
        elevation: 10

    },
    list: {
        marginTop: 20
    },
    online: {
        height: 70
    }
});
