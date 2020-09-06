import {AsyncStorage, TouchableOpacity} from 'react-native'
import DatabaseMethods from "../Database/DatabaseMethods";
import {Body, Icon, Left, ListItem, Right, Text, Thumbnail} from "native-base";
export default class SocketConnection {
    static ws: WebSocket;
   static connect = () => {
        SocketConnection.ws = new WebSocket("ws://192.168.43.162:8000/ws/chats/");
        // websocket onopen event listener
        SocketConnection.ws.onopen = async () => {
            console.log('Socket Open!');
            this.ws.send(JSON.stringify({
                type: "register",
                token: await AsyncStorage.getItem('token')
            }));

        };
            // websocket onclose event listener
            SocketConnection.ws.onclose = e => {
                const that = this;
                setTimeout(function () {
                    that.connect();
                }, 1000 , that);
            };
            // ws.close();


        };
    // GetInstance = ()=> {
    //     if (this.GotInstance) {
    //         return this.ws;
    //     } else {
    //         this.connect();
    //         this.GotInstance = true;
    //         return this.ws;
    //     }
    // }

}