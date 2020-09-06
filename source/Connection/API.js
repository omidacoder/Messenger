import {NetInfo} from "react-native";
import DatabaseMethods from "../Database/DatabaseMethods";

export default class API{
    static async GetChatsOffline(){
        //lets get the chats if offline
        return DatabaseMethods.LoadChats().then(value => value);
    }
    static upload(url, data, Method) {
        let options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: Method
        };
        if(data !== null) {
            options.body = new FormData();
            for (let key in data) {
                options.body.append(key, data[key]);
            }
        }

        return fetch(url, options)
            .then(response => {
                return response.json()
                    .then(responseJson => {
                        //You put some checks here
                        return responseJson;
                    });
            });
    }
}