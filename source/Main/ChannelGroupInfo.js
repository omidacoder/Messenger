import React from 'react'
import {Dimensions,Image, ImageBackground, StatusBar, StyleSheet, ToastAndroid, TouchableOpacity} from "react-native";
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
    Body,
    View, Label, Input, Item,
    Card, CardItem, Spinner,
} from "native-base";
import {Actions} from "react-native-router-flux";
import {Kaede , Hideo} from 'react-native-textinput-effects';
import Realm from 'realm';
import awaitAsyncGenerator from "@babel/runtime/helpers/esm/awaitAsyncGenerator";
import {AsyncStorage} from 'react-native'
import {ChatSchema} from "../Classes/Schemas";
import API from "../Connection/API";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import DatabaseMethods from "../Database/DatabaseMethods";


export default class CreateGroupChannelPage extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor('orange');
        const Title = this.props.type === "GROUP" ? "گروه" : "کانال";
        this.state={
            title : Title,
            groupName : '',
            isModalVisible : false,
            userFoundTemplate : [],
            search : '',
            Users : [],
            UsersTemplate : [],
            searchedText : '',
            Random : Math.random()
        };
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this);
        this.getUsers();
    }

     getUsers = async ()=>{
        API.upload('http://192.168.43.162:8000/api/getgpmembers' ,{
            email_address : await AsyncStorage.getItem('email'),
            token : await AsyncStorage.getItem('token'),
            channel_id : this.props.channel_id
        },'POST').then( r => {
            let users = [];
            let userstemlpate = [];
            if(r.status === 'api_get_group_members_ok'){
                console.log('pic_url is' + r.data[0].pic_url);
                for(let i = 0 ; i<r.data.length;i++){
                    r.data[i].channel_id = this.props.channel_id;
                    users.push(r.data[i]);
                    userstemlpate.push(
                        <ListItem thumbnail  noIndent style={styles.listItemView}>

                            <Left>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage(r.data[i].name, r.data[i].family, r.data[i].biography, r.data[i].username , r.data[i].pic_url)}>
                                    <Thumbnail square style={{borderRadius: 1000}}
                                               source={{uri : 'http://192.168.43.162:8000'+r.data[i].pic_url+'?rnd='+this.state.Random}}/>

                                </TouchableOpacity>
                            </Left>
                            <Body>
                                <TouchableOpacity
                                    onPress={() => this.redirectToMessagesPage(r.data[i].name, r.data[i].family, r.data[i].biography, r.data[i].username,r.data[i].pic_url)}>

                                    <Text style={{
                                        fontFamily: 'B-Yekan',
                                        textAlign: 'left'
                                    }}>{r.data[i].name + " " + r.data[i].family}</Text>
                                    <Text note numberOfLines={1}
                                          style={{textAlign: 'left', fontFamily: 'B-Yekan'}}>{r.data[i].biography}</Text>

                                </TouchableOpacity>
                            </Body>
                            <Right style={styles.online}>
                                <Icon name={"md-person"}/>
                                <Text note style={{fontFamily: 'B-Yekan', fontSize: 10 , color : 'green'}}>{r.data[i].isadmin === 'true' ? 'عضو' : 'مدیر گروه'}</Text>
                            </Right>


                        </ListItem>
                    );
                    this.setState({
                        Users : [...users],
                        UsersTemplate : [...userstemlpate]
                    })
                }
                DatabaseMethods.saveUsers(r.data).catch(e=>{
                    console.log('Error in Realm Database Happened')
                });

            }
        })
    };
searchUser = async () => {
    const Token =await AsyncStorage.getItem('token');
    API.upload('http://192.168.43.162:8000/api/search', {

        token: Token,
        username: this.state.search,

    }, 'POST').then(r => {
        if(r.status === 'api_search_user_ok'){
            this.setState({
                userFoundTemplate : [
                    <View style={{flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                        <Thumbnail square source={{uri : 'http://192.168.43.162:8000'+r.pic_url+'?rnd='+this.state.Random}} style={{width : (Dimensions.get('window').height - 48) *6/20,marginTop: 10 , height: (Dimensions.get('window').height - 48) *6/20 , borderRadius : 100000000000 , border : 'solid' , borderWidth : 3 , borderColor : 'orange'}} />
                        <Text style={{fontFamily : 'B-Yekan' , color : 'black' , marginTop: 10}}>{r.firstname + ' ' + r.lastname}</Text>
                        <Text note style={{fontFamily : 'B-Yekan' , marginTop: 10}}>{r.biography}</Text>
                        <Button style={{color : 'white' , backgroundColor: 'orange' , marginTop: 10 , padding : 10}} onPress={()=>{this.AddMember()}} >
                            <Icon name="md-add"/>
                            <Text style={{fontFamily : 'B-Yekan' , color : 'white'}}> اضافه کردن </Text>
                        </Button>
                    </View>
                        ],
                searchedText : r.username
            })
        }
        else{
            if(r.status === 'api_search_user_failed'){

                this.setState({
                    userFoundTemplate : [
                        <View style={{flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <Text style={{fontFamily : 'B-Yekan' , color : 'gray'}}>نتیجه ای یافت نشد</Text>
                        </View>
                    ]
                })
            }
        }
    })
};

async AddMember(){
    API.upload('http://192.168.43.162:8000/api/getgpmembers' , {
        token : await AsyncStorage.getItem('token'),
        email_address : await AsyncStorage.getItem('email'),
        channel_id : this.props.channel_id,
        usernames : JSON.stringify([this.state.searchedText])
    } , 'PUT').then(r=>{
        if(r.status === 'api_group_user_add_ok'){
            this.toggleModal();
            this.setState({
                users : [],
                usersTemplate : []
            }, ()=>{
                this.getUsers();
            });

        }
    },this)
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

                        <Text style={{color: 'white', margin: 5 , marginHorizontal : 20, fontFamily: 'Lalezar-Regular'}}>
                            {this.state.title}
                        </Text>
                        <Icon name="md-create" style={{color : 'white'}}/>
                    </Right>

                </Header>
                <Content style={{ }}>
                    <View style={{flexDirection : 'row' , height : 150 , backgroundColor: 'orange' , padding : 20}}>
                        <Thumbnail source={require('./../assets/images/group.jpg')} style={{
                            borderRadius: 70,
                            flex:.4,
                            height : '100%',
                            marginLeft : 10,
                            border : 'solid',
                            borderColor : 'white',
                            borderWidth : 2,
                            backgroundColor: 'white'



                        }}>
                        </Thumbnail>
                        <View style={{  flex : .6 ,marginTop: 50 , paddingRight : 20}}>
                            <Text style={{fontFamily :'B-Yekan' , color : 'white' , textAlign :'right' , fontSize : 20 }}>{this.props.groupName}</Text>
                            <Text note style={{fontFamily :'B-Yekan' , color : 'white' , textAlign :'right' , }}> توضیحات :  {this.props.group_description}</Text>
                            <Text note style={{fontFamily :'B-Yekan' , color : 'white' , textAlign :'right' , }}> تعداد اعضا : {this.props.group_num_of_members}</Text>
                        </View>

                    </View>
                    <Card style={{backgroundColor: '#eee'}} >
                        <CardItem header style={{flexDirection : 'row' , justifyContent : 'flex-end' ,backgroundColor: '#eee'}}>
                            <Text style={{fontFamily : "B-Yekan" , textAlign : "right" , color : 'orange'}}>اعضای {this.state.title}</Text>
                        </CardItem>
                               {this.state.UsersTemplate}
                        <CardItem footer style={{flexDirection : 'row' , justifyContent : 'center' }}>
                            <TouchableOpacity onPress={() => {this.toggleModal()}}>
                            <Text note style={{textAlign : 'center' , fontFamily : "B-Yekan" , color: 'orange'}}>
                                اضافه کردن مخاطب
                            </Text>
                            </TouchableOpacity>
                        </CardItem>

                    </Card>

                </Content>
                <Modal
                    backdropTransitionInTiming={100}
                    backdropTransitionOutTiming={100}
                    animationIn={'slideInUp'}
                    backdropOpacity={.3}
                    useNativeDriver={true}
                    swipeDirection={['down']}
                    onSwipeComplete={() => {this.toggleModal()}}
                    isVisible={this.state.isModalVisible}
                    style={{justifyContent: 'flex-end', margin: 0 , height : 100}}>
                    <View style={{
                        flex: .8,
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderTopLeftRadius : 30,
                        borderTopRightRadius : 30
                    }}>
                        <View >
                            {this.state.userFoundTemplate}
                        </View>
                        <View style={{position : 'absolute' , bottom : 0 , right : 0 , left : 0}} >
                            <Hideo
                                ref={(el)=>{this.search = el}}
                                onChangeText={(search)=>{
                                    this.setState({search});
                                }}
                                iconClass={FontAwesomeIcon}
                                iconName={'search'}
                                iconColor={'orange'}
                                // this is used as backgroundColor of icon container view.
                                iconBackgroundColor={'#eee'}
                                inputStyle={{ color: 'orange' , backgroundColor: "#eee" }}
                                value ={this.state.search}
                            />
                        </View>
                        <Button onPress={()=>{this.searchUser()}} style={{width : 48 , height : 48 , color : 'white' , backgroundColor: 'orange' , position :'absolute' , right : 0 , bottom :0  }}>
                            <Icon name='md-arrow-forward' />
                        </Button>
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

}
const styles = StyleSheet.create({
    listItemView: {

        backgroundColor: 'whitesmoke',
        height: 75,
        width : '100%',
        elevation: 10

    },
    list: {
        marginTop: 20
    },
    online: {
        height: 70
    }
});
