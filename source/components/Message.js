import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity , Dimensions} from 'react-native';
import {Thumbnail} from "native-base";

export default class Message extends React.Component{
    constructor(props){
        super(props);
        this.state={
            Random : Math.random(),
            isPV : null,
        };
        this.setState({
            isPV : this.props.isPV ?  <></> :<Thumbnail source={{uri : 'http://192.168.43.162:8000' + this.props.pic+'?rnd='+this.state.Random}} square style={{borderRadius : 1000 , width : Dimensions.get('window').width /8 , height : Dimensions.get('window').width /8 , marginRight : 10 , alignSelf : 'flex-end' }} />
        });
        if(props.sent)
            this.state = {messageType : 'sent' , content : this.props.content , MyGroupName : (this.props.senderName !== null) ? <Text style={{color : 'yellow' , fontSize  : 12 , textAlign : 'right' , fontFamily: 'Lalezar-Regular'}}>{this.props.senderName}</Text>  : ''} ;
        if(props.received)
            this.state = {messageType : 'received' , content : this.props.content  , MyGroupName : (this.props.senderName !== null) ? <Text style={{color : 'yellow' , fontSize  : 12 , textAlign : 'right' , fontFamily: 'Lalezar-Regular'}}>{this.props.senderName}</Text>  : ''};
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this);
    }
    render(){
        console.log('isPV is' + this.props.isPV);
        if(this.state.messageType === 'sent')
        return(
          <View style={styles.messageSentContainer}>
              {/*<Text style={{color : 'yellow' , textAlign : 'right',fontSize: 12 , fontFamily: 'Lalezar-Regular' }}>{this.props.senderName}</Text>*/}
                <Text style={styles.messageContentSent}>{this.state.content}</Text>
              <Text note style={{textAlign : 'right' , marginRight : 5}}>{this.props.date}</Text>
          </View>
        );
        if(this.state.messageType === 'received')
            return(
                <>
                    {this.props.isPV ? <></> : <Thumbnail source={{uri : 'http://192.168.43.162:8000' + this.props.pic+'?rnd='+this.state.Random}} square style={{borderRadius : 1000 , width : Dimensions.get('window').width /8 , height : Dimensions.get('window').width /8 , marginRight : 10 , alignSelf : 'flex-end' }} />}
                <View style={styles.messageReceivedContainer}>
                    {this.state.MyGroupName}
                    <Text style={styles.messageContent}>{this.state.content}</Text>
                    <Text note style={{textAlign : 'right' , marginRight : 5}}>{this.props.date}</Text>
                </View>
                    </>
            );

    }
}
const styles = StyleSheet.create({
    messageSentContainer : {
        backgroundColor : '#00B1D9',
        padding : 10,
        borderRadius : 10,
        borderBottomRightRadius : 0,
        flexDirection : 'column',
        minWidth : Dimensions.get('window').width /3,
        maxWidth : Dimensions.get('window').width *3/ 4

    },
    messageReceivedContainer : {
        backgroundColor : 'orange',
        padding : 10,
        borderRadius : 10,
        borderBottomLeftRadius : 0,
        flexDirection: 'column',
        minWidth : Dimensions.get('window').width /3,
        maxWidth : Dimensions.get('window').width *3/ 4
    },
    messageContent : {
        color : 'white',
        fontSize : 10 ,
        fontFamily : 'B-Yekan'
    },
    messageContentSent :{
        color : 'white',
        fontSize : 10 ,
        fontFamily : 'B-Yekan',
        textAlign : 'right'
    }
});