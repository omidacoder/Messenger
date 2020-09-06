import React from 'react'
import {Dimensions, ImageBackground, StatusBar, StyleSheet, ToastAndroid, TouchableOpacity} from "react-native";
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
    Card , CardItem
} from "native-base";
import {Actions} from "react-native-router-flux";
import {Kaede , Hideo} from 'react-native-textinput-effects';
import Realm from 'realm';
import awaitAsyncGenerator from "@babel/runtime/helpers/esm/awaitAsyncGenerator";
import {AsyncStorage} from 'react-native'
import {ChatSchema} from "../Classes/Schemas";
import API from "../Connection/API";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DatabaseMethods from "../Database/DatabaseMethods";
import SocketConnection from "../Connection/SocketConnection";


export default class CreateGroupChannelPage extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor('orange');
        const Title = this.props.type === "GROUP" ? "گروه" : "کانال";
        this.state={
            title : Title,
            groupName : '',
            search: '',
            des : '',
            searchedUsers :[<Text note style={{textAlign : 'center' ,fontFamily : "B-Yekan" }}>
                هیچ فردی در لیست مخاطبان شما وجود ندارد
            </Text>],
            AddedUsers : [<Text note style={{textAlign : 'center' , fontFamily : "B-Yekan"}}>
                هنوز هیج فردی را به گروه اضافه نکرده اید
            </Text>],
            AddedUsersReal : [],
            AddedIsEmpty:true,
            Random : Math.random()
        }
    }
    RemoveUserFromList = (index) =>{
        let newArray = this.state.AddedUsers.splice(index, 1);
        let newArrayReal = this.state.AddedUsersReal.splice(index, 1);
        this.setState({
            AddedUsers :newArray,
            AddedUsersReal : newArrayReal
        });
    };

     AddUserToList = (firstname , lastname , biography , username , pic) => {
         console.log(this.state.AddedUsersReal);
        for(let i =0;i<this.state.AddedUsersReal.length ; i++){
            console.log(this.state.AddedUsersReal[i].username + ' ' + username);
            if(this.state.AddedUsersReal[i].username === username)
            {
                ToastAndroid.show( 'این فرد از قبل وجود دارد' , ToastAndroid.LONG);
                return;
            }
        }
         if(!this.state.AddedIsEmpty) {
             this.setState({
                 AddedUsersReal: [...this.state.AddedUsersReal, {firstname, lastname, biography, username , pic}],
                 AddedUsers: [...this.state.AddedUsers, <ListItem thumbnail noIndent style={styles.listItemView}>

                     <Left>
                         <TouchableOpacity>

                             <Thumbnail square style={{borderRadius: 1000}}
                                        source={{uri : 'http://192.168.43.162:8000'+pic+'?rnd='+this.state.Random}}/>

                         </TouchableOpacity>
                     </Left>
                     <Body>
                         <TouchableOpacity>

                             <Text style={{
                                 fontFamily: 'B-Yekan',
                                 textAlign: 'left'
                             }}>{firstname + ' ' + lastname}</Text>
                             <Text note numberOfLines={1}
                                   style={{textAlign: 'left', fontFamily: 'B-Yekan'}}>{biography}</Text>

                         </TouchableOpacity>
                     </Body>
                     <Right style={styles.online}>
                         <Icon style={{color: 'orange'}} name="md-close"
                               onPress={() => this.RemoveUserFromList(this.state.AddedUsers.length)}/>

                     </Right>


                 </ListItem>

                 ]
             });

         }
         else{
             this.setState({
                 AddedUsersReal: [...this.state.AddedUsersReal, {firstname, lastname, biography, username , pic}],
                 AddedUsers: [ <ListItem thumbnail noIndent style={styles.listItemView}>

                     <Left>
                         <TouchableOpacity>

                             <Thumbnail square style={{borderRadius: 1000}}
                                        source={{uri : 'http://192.168.43.162:8000'+pic+'?rnd='+this.state.Random}}/>

                         </TouchableOpacity>
                     </Left>
                     <Body>
                         <TouchableOpacity>

                             <Text style={{
                                 fontFamily: 'B-Yekan',
                                 textAlign: 'left'
                             }}>{firstname + ' ' + lastname}</Text>
                             <Text note numberOfLines={1}
                                   style={{textAlign: 'left', fontFamily: 'B-Yekan'}}>{biography}</Text>

                         </TouchableOpacity>
                     </Body>
                     <Right style={styles.online}>
                         <Icon style={{color: 'orange'}} name="md-close"
                               onPress={() => this.RemoveUserFromList(this.state.AddedUsers.length)}/>

                     </Right>


                 </ListItem>

                 ]
             });
             this.setState({
                 AddedIsEmpty : false
             })
         }
};
     searchUser=async  (search) =>{
       const Token =await AsyncStorage.getItem('token');
        API.upload('http://192.168.43.162:8000/api/search', {

            token: Token,
            username: search,

        }, 'POST').then(r => {
            if(r.status === 'api_search_user_ok'){

                const JSX = <ListItem thumbnail noIndent style={styles.listItemView}>

                    <Left>
                        <Thumbnail square style={{borderRadius: 1000}}
                                   source={{uri : 'http://192.168.43.162:8000'+r.pic_url+'?rnd='+this.state.Random}}/>

                    </Left>
                    <Body>
                        <Text style={{
                            fontFamily: 'B-Yekan',
                            textAlign: 'left'
                        }}>{r.firstname + ' ' + r.lastname}</Text>
                        <Text note numberOfLines={1}
                              style={{textAlign: 'left', fontFamily: 'B-Yekan'}}>{r.biography}</Text>


                    </Body>
                    <Right style={styles.online}>
                        <Icon style={{color: 'orange'}} name="md-add" onPress={() => this.AddUserToList(r.firstname , r.lastname , r.biography , r.username , r.pic_url )}/>

                    </Right>


                </ListItem>;
                this.setState({searchedUsers :[JSX]})
            }
            else{
                if(r.status === 'api_search_user_failed'){
                    this.setState({
                        searchedUsers : [
                            <Text note style={{textAlign : 'center' ,fontFamily : "B-Yekan"}}>
                                هیچ فردی در لیست مخاطبان شما وجود ندارد
                            </Text>
                        ]
                    })
                }
            }
        })
    };

sendCreateGroupRequest = async ()=>{
    let username = [];
    for (let i = 0 ; i<this.state.AddedUsersReal.length ; i++){
        username.push(this.state.AddedUsersReal[i].username);
    }
    username.push(await AsyncStorage.getItem('username'));
    const Email = await AsyncStorage.getItem('email');
    const Token =  await AsyncStorage.getItem('token');
  API.upload('http://192.168.43.162:8000/api/creategpchat' ,{
      email_address : Email,
      token : Token,
      gp_name : this.state.groupName,
      gp_description : this.state.des,
      usernames : JSON.stringify(username)
  },'PUT').then( r => {
      if(r.status === 'api_create_group_ok')
      {
          //taking nothing
          console.log('channel_id from server : ' + r.channel_id);
          DatabaseMethods.saveGroupChats([{group_name : this.state.groupName , group_des :this.state.des , group_number_of_members : this.state.AddedUsersReal.length , group_socket_id : r.channel_id}]);
          ToastAndroid.show( 'گروه با موفقیت ایجاد شد' , ToastAndroid.LONG);
          Actions.reset('drawer');
          // Actions.push('group_chat' , { groupName : this.state.groupName , usernames : JSON.stringify(username) , channel_id : r.channel_id , ws : SocketConnection.ws,group_description : this.state.des ,group_num_of_members : this.state.AddedUsersReal.length});
      }
  }
  )
    // API.upload('http://192.168.43.162:8000/api/createchannel' ,{
    //     email_address : Email,
    //     token : Token,
    //     gp_name : this.state.groupName,
    //     gp_description : this.state.des,
    //     usernames : JSON.stringify(username)
    // },'PUT').then( r => {
    //         if(r.status === 'api_create_channel_ok')
    //         {
    //             //taking nothing
    //             Actions.pop();
    //             Actions.push('channel_chat' , { groupName : this.state.groupName , usernames : JSON.stringify(username) , group_socket_id : r.socket_id});
    //         }
    //     }
    // )
};

    render() {
        return (
            <Container>
                <StatusBar backgroundColor="orange" barStyle="light-content"/>
                <Header style={{backgroundColor: 'orange'}}>
                    <Left>
                        <Icon style={{margin: 10, color: 'white'}} name="md-arrow-back" onPress={() => Actions.pop()}/>
                    </Left>
                    <Right>
                        <Text style={{color: 'white', margin: 10, fontFamily: 'Lalezar-Regular'}}>
                            {this.state.title}
                        </Text>
                        <TouchableOpacity onPress={() => this.sendCreateGroupRequest()}>
                            <Icon style={{color: 'white', margin: 10}} name="md-checkmark-circle-outline"/>
                        </TouchableOpacity>

                    </Right>

                </Header>
                <Content style={{paddingTop : 20 ,  paddingHorizontal : 10 }}>
                    <View style={{flexDirection : 'row' , height : 140}}>
                            <ImageBackground source={require('./../assets/images/default.jpg')} style={{
                                borderRadius: 1000000,
                                flex:.4,
                                height : 100,
                                width : 100

                            }}>
                                <Icon name="md-add-circle" style={{
                                    fontSize: 40,
                                    marginTop : 60,
                                    color: 'orange',
                                }}/>
                            </ImageBackground>
                        <View style={{flexDirection : 'column' , flex : .6}}>
                            <Item floatingLabel style={{color : 'orange' }}>
                                <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan' }}>نام {this.state.title}</Label>
                                <Input style={{color : 'orange'}} ref= {(el) => { this.GroupName = el; }}
                                       onChangeText={(groupName) => this.setState({groupName})} value={this.state.groupName} />
                            </Item>
                        <Item floatingLabel style={{color : 'orange' ,marginTop: 10 ,marginBottom : 40}}>
                            <Label style={{fontSize:12,color:'orange', fontFamily: 'B-Yekan' }}> توضیحات {this.state.title}</Label>
                            <Input style={{color : 'orange'}} ref= {(des) => { this.des = des; }}
                                   onChangeText={(des) => this.setState({des})} value={this.state.des} />
                        </Item>
                        </View>
                    </View>
                    <Card style={{backgroundColor: '#eee' , marginTop: 20 }} >
                        <CardItem header style={{flexDirection : 'row' , justifyContent : 'flex-end' ,backgroundColor: '#eee'}}>
                            <Text style={{fontFamily : "B-Yekan" , textAlign : "right" , color : 'orange'}}>اضافه کردن مخاطبان</Text>
                        </CardItem>
                            {this.state.searchedUsers}
                        <CardItem style={{flexDirection : 'row' , justifyContent : 'center' , marginTop: 30 }}>
                            <Hideo
                                ref={(el)=>{this.searchBox = el}}
                                onChangeText={(search)=>{
                                    this.setState({search});
                                    this.searchUser(search);
                                }}
                                iconClass={FontAwesomeIcon}
                                iconName={'search'}
                                iconColor={'white'}
                                // this is used as backgroundColor of icon container view.
                                iconBackgroundColor={'orange'}
                                inputStyle={{ color: 'orange' , backgroundColor: "#eee" }}
                                value ={this.state.search}
                            />
                        </CardItem>
                    </Card>
                    <Card style={{backgroundColor: '#eee' , marginTop: 30,paddingBottom : 20}} >
                        <CardItem header style={{flexDirection : 'row' , justifyContent : 'flex-end' ,backgroundColor: '#eee'}}>
                            <Text style={{fontFamily : "B-Yekan" , textAlign : "right" , color : 'orange'}}>اعضای {this.state.title}</Text>
                        </CardItem>
                                {this.state.AddedUsers}
                    </Card>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    listItemView: {

        backgroundColor: 'whitesmoke',
        height: 75,
        width : '100%',
        marginBottom : 10,

    },
    list: {
        marginTop: 20
    },
    online: {
        height: 70
    }
});
