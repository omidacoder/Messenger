import React from 'react';
import { Text , Footer , Button , FooterTab ,} from 'native-base';
import {Animated, Dimensions, Easing, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class TabBar extends React.Component {
    componentDidMount(){
        StatusBar.setHidden(true,'fade');
    }
    constructor(props){
        super(props);
        this.selectedLoginValue = new Animated.Value(1);
        this.selectedRegisterValue = new Animated.Value(0);
    }

    componentDidMount(): void {
        StatusBar.setHidden(true,'fade');
    }
    selectanimationLogin(){

        Animated.timing(this.selectedLoginValue , {
            toValue : 1,
            duration : 500,
            easing : Easing.ease
        }).start()
    }
    selectanimationregister(){
        this.selectedValue.setValue(0);
        Animated.timing(this.selectedRegisterValue , {
            toValue : 1,
            duration : 500,
            easing : Easing.ease
        }).start()
    }
    unselectanimationregister() {

        Animated.timing(this.selectedRegisterValue , {
            toValue : 0,
            duration : 500,
            easing : Easing.ease
        }).start()
    }

    unselectanimationlogin() {

        Animated.timing(this.selectedLoginValue , {
            toValue : 0,
            duration : 500,
            easing : Easing.ease
        }).start()
    }
    renderTab(element)
    {
        const AnimationSettedWidthLogin = this.selectedLoginValue.interpolate({
            inputRange: [ 0 , 1],
            outputRange : [ 0 , Dimensions.get('window').width/2]
        });
        const AnimationSettedWidthRegister = this.selectedRegisterValue.interpolate({
            inputRange: [ 0 , 1],
            outputRange : [ 0 , Dimensions.get('window').width/2]
        });
        if(element.key == 'login'){

            return (
                <View style={styles.tabcontainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.onetabactive} key={element.key} onPress={() =>{
                    Actions[element.key]() ;

                    this.selectanimationLogin();
                    this.unselectanimationregister();
                    //animation here

                }} >
                    <Animated.View style={{ height:5,width : AnimationSettedWidthLogin ,marginBottom:15 ,alignItems : 'center',justifyContent:'center', backgroundColor : 'orange'}}/>
                    <Text style={{color: 'orange',textAlign:'center',fontSize:12,marginBottom : 15, fontFamily: 'Lalezar-Regular'}}>ورود</Text>
                </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={styles.tabcontainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.onetabactive} key={element.key} onPress={() =>{
                    Actions[element.key]() ;
                    this.selectedValue = new Animated.Value(0);
                    this.selectanimationregister();
                    this.unselectanimationlogin();
                    //animation here

                }} >
                    <Animated.View style={{ height:5,width : AnimationSettedWidthRegister,marginBottom : 15  , backgroundColor : 'orange'}}/>
                    <Text style={{color: 'orange',textAlign:'center',fontSize:12,marginBottom:15, fontFamily: 'Lalezar-Regular'}}>ثبت نام</Text>
                </TouchableOpacity>
                </View>
            )
        }
    }
    render() {
        const { state } = this.props.navigation;
        const activeTabIndex = state.index;



        return (
            <Footer style={styles.alltabs}>
                <FooterTab style={styles.footertabstyle}>
                {
                    state.routes.map(element => (

                        this.renderTab(element)
                    ))
                }
                </FooterTab>
            </Footer>
        );
    }


}
const styles = StyleSheet.create({
    alltabs : {
        flexDirection : 'row',
        flexWrap : 'nowrap',
        justifyContent : 'space-between',
        backgroundColor: 'white'

    },
    onetab : {
        color : 'orange',
        textAlign: 'center',
        width : Dimensions.get('window').width/2,
        backgroundColor: 'white',
        borderRadius : 0,

    },
    onetabactive : {
        color : 'orange',
        textAlign: 'center',
        width : Dimensions.get('window').width/2,
        backgroundColor: 'white',
        borderRadius : 0,
        justifyContent: 'center',
        alignContent : 'center',
        height : 100,
        flex: 1,
        alignItems : 'center'

    },
    footertabstyle:{
        flex : 1,
        flexDirection: 'row',
        backgroundColor : 'orange'


    },
    tabcontainer:{
        flexDirection : 'column',

    }

});