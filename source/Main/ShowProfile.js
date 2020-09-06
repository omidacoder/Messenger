import React from 'react';
import {Container, Content, Header, Left, Right, Text, Icon, Button, Thumbnail, View, Spinner} from 'native-base'
import {StatusBar,StyleSheet,Dimensions,TouchableHighlight } from "react-native";
import {Actions} from "react-native-router-flux";
import AnimatedLinearGradient, {presetColors} from "react-native-animated-linear-gradient";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Modal from "react-native-modal";


export default class ShowProfile extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            isModalVisible: false,
            Random : Math.random()
        };
        setTimeout(()=>{
            this.setState({
                Random :  Math.random()
            })
        } , 2000, this);
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
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
    render(){
        return(
            <Container>

                <AnimatedLinearGradient useNativeDriver={true} customColors={presetColors.instagram} speed={2000}/>
                <Header transparent >
                    <Left>

                        <Icon style={{margin : 10 , color : 'white'}} name="md-arrow-back" onPress={()=>Actions.pop()}/>
                    </Left>
                    <Right>
                        <Text style={{color : 'white' , margin:10 , fontFamily : 'Lalezar-Regular' }}>پروفایل کاربری</Text>

                        <Menu
                            useNativeDriver={true}
                            ref={this.setMenuRef}
                            button={<Icon style={{color:'white' ,margin:10}} name="md-more" onPress={() => this.showMenu()}/>}
                        >
                            <MenuItem textStyle={{fontFamily : 'B-Yekan' , textAlign : 'right'}} onPress={this.hideMenu}>ارسال پیام</MenuItem>
                            <MenuDivider />
                            <MenuItem textStyle={{fontFamily : 'B-Yekan' , textAlign : 'right'}} onPress={this.hideMenu}>مسدود کردن</MenuItem>
                            <MenuDivider />
                            <MenuItem textStyle={{fontFamily : 'B-Yekan' , textAlign : 'right'}} onPress={this.hideMenu} >
                                حذف تاریخچه پیامها
                            </MenuItem>


                        </Menu>
                    </Right>

                </Header>
                <Content>
                    <View style={styles.upperContainer}>

                        <Thumbnail square style={{borderRadius : 1000 ,borderWidth : 2 , borderColor : 'white' , height : Dimensions.get('window').width *4/7, width : Dimensions.get('window').width *4/7 }} source={{uri:'http://192.168.43.162:8000'+this.props.pic+'?rnd='+this.state.Random}} />

                    </View>
                        <Text style={styles.mainText}>{this.props.name_of_user + ' ' + this.props.family}</Text>
                            <Text style={styles.subText} note>آخرین بازدید : {this.props.last_activity}</Text>

                <View style={{backgroundColor : 'white', minHeight : Dimensions.get('window').height *3/5}}>
                    <View style={{padding: 10 ,borderBottom : 2, borderBottomWidth : 1, borderBottomColor : 'white'  , alignItems : 'flex-end' }}>
                        <View style={{flexDirection : 'row'}}>
                            <Text style={{fontFamily : 'B-Yekan' , marginHorizontal  : 10}} note>بیو</Text><Icon name="md-information-circle" color="#4F8EF7" style={{marginLeft : 10}} />
                        </View>
                        <Text style={{  fontFamily : 'B-Yekan' , color : 'orange' }}>{this.props.biography}</Text>
                    </View>
                    <View style={{padding: 10 ,borderBottom : 2, borderBottomWidth : 1, borderBottomColor : 'white'  , alignItems : 'flex-end' }}>
                        <View style={{flexDirection : 'row'}}>
                            <Text style={{fontFamily : 'B-Yekan' , marginHorizontal  : 10}} note>نام کاربری</Text><Icon name="md-person" color="#4F8EF7" style={{marginLeft : 10}} />
                        </View>
                        <Text style={{  fontFamily : 'B-Yekan' , color : 'orange' }}>{this.props.realusername}</Text>
                    </View>
                    <Button style={{marginHorizontal : 20,marginTop: 20 , backgroundColor : 'orange',borderRadius : 40 , textAlign : 'center' , justifyContent: 'center' , alignItems: 'center'}}>
                        <Text style={{textAlign : 'center' , fontFamily : 'B-Yekan'}}>ارسال پیام</Text>
                    </Button>
                    <Modal
                        backdropOpacity={0}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={100}
                        animationIn={'fadeIn'}
                        animationOut={'fadeOut'}
                        isVisible={this.state.isModalVisible}

                    style={{justifyContent: 'flex-end' , margin : 0}}>
                        <View style={{ flex: .1 , backgroundColor : 'orange' , flexDirection: 'row' , justifyContent: 'space-between' }} >
                            <Icon style={{ color : 'white' , alignSelf : 'center' , marginLeft : 20}} name="md-close" onPress={()=>this.toggleModal()} />
                            <Text style={{color : 'white',textAlign : 'right',fontSize:12,alignSelf : 'center'  , fontFamily : 'B-Yekan'}}>لطفا اتصال خود را به اینترنت بررسی کنید</Text>
                            <Spinner large color='white' style={{width : 20,marginRight:20 , height : '100%'}}  />

                        </View>
                    </Modal>
                </View>
                </Content>
            </Container>
        )
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


}
const styles = StyleSheet.create({
    upperContainer : {
        height : Dimensions.get('window').height*2/5,
        width : Dimensions.get('window').width,
        padding : 20,
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center'

    },
    mainText : {
        color : 'white',
        fontFamily : 'B-Yekan',
        fontSize : 25,
        textAlign :'center'
    },
    subText : {
        color : 'white',
        fontFamily: 'B-Yekan',
        marginTop : 10,
        marginBottom : 10,
        fontSize: 10,
        textAlign : 'center'
    }
});