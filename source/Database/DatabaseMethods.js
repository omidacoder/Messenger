import Realm from 'realm';
import {ChatSchema, GroupSchema, MessageSchema , UserSchema} from "../Classes/Schemas";

export default class DatabaseMethods{
    static SaveMessages(Messages){
        // message_id,message_text,send_date_time,sent_status,sender_username,message_type,chat_socket_id
            Realm.open({
                schema : [MessageSchema , ChatSchema , GroupSchema , UserSchema]
            }).then((realm)=>{
                realm.write(() => {
                for (let i =0 ; i<Messages.length;i++) {
                    let {message_id,message_text,send_date_time,sent_status,sender_username,message_type,chat_socket_id} = Messages[i];
                    console.log('messages saving : ' + JSON.stringify(Messages[i]));

                        let chat = realm.create('Message', {
                            message_id, message_text, send_date_time, sent_status, sender_username, message_type , chat_socket_id
                        }, 'all');
                }
                });

            // realm.close();
            },Messages);
    }
    static SaveChats(Chats){
        //Chats is Array Of Objects
        Realm.open({
            schema: [ChatSchema , MessageSchema , GroupSchema , UserSchema]
        }).then(
            (realm) => {
                for (let i = 0; i < Chats.length; i++) {
                    let {name,family,biography,username,chatname,pic,socket_id} = Chats[i];
                    realm.write(() => {
                        let chat = realm.create('Chat', {
                            name, family, biography, username, chatname, pic ,socket_id
                        }, 'all');
                    });
                }
                // realm.close();

            }, Chats
        )
    }
    static async LoadChats(){

        let Chats = [];
       return Realm.open({
            schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then((realm)=>{
            //continue from here
            const chats = realm.objects('Chat');
           const channel_type = 'pv';
            for(let i = 0 ;i<chats.length ; i++){
                const {name , family , biography , chatname,pic , socket_id , username} = chats[i];
                Chats[i] = {name , family , biography , username,pic , chatname , socket_id , channel_type};
            }
            // realm.close();

            return Chats;
        },Chats).then(mychats => mychats);


    }
    static async LoadGroupChats(){
        //for chats page
        let Groups = [];
        return Realm.open({
            Schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then( realm =>{
            const groups = realm.objects('Group');
            for (let i = 0 ; i<groups.length ; i++){
                const {group_name , group_des , group_socket_id} = groups[i];
                Groups[i] = {group_name , group_des , group_socket_id};
            }
            // realm.close();
            return Groups;
        },Groups).then(group=>group);
    }
    static async LoadGroupChat(socket_id){
        //for single group
        let Groups = [];
        return Realm.open({
            Schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then( realm =>{
            let Group = realm.objects('Group').filtered('group_socket_id="'+socket_id+'"');

                let {group_name , group_des ,group_creator , group_admins,group_number_of_members, group_socket_id} = Group;
                Groups = {group_name , group_des ,group_creator , group_admins,group_number_of_members, group_socket_id};

            // realm.close();
            return Groups;
        },Groups).then(group=>group);
    }
    static async LoadMessages(socket_id){
        let Messages = [];
        return Realm.open({
            Schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then( realm =>{
            const messages = realm.objects('Message').filtered('chat_socket_id ="'+socket_id+'"');
            for (let i = 0 ; i<messages.length ; i++){
                const {message_id , message_text , send_date_time , sender_username , sent_status , message_type , chat_socket_id} = messages[i];
                Messages[i] = {message_id , message_text , send_date_time , sender_username , sent_status,message_type , chat_socket_id};
            }
            // realm.close();
            return Messages;
        },Messages).then(message=>message);



    }
    static  async saveGroupChats(Chats){
        Realm.open({
            Schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then(realm =>{
            for (let i = 0; i < Chats.length; i++) {
                let { group_name , group_des,group_number_of_members , group_socket_id} = Chats[i];
                realm.write(() => {
                    let Group = realm.create('Group', {
                         group_name , group_des,group_number_of_members , group_socket_id
                    }, 'all');
                });
            }
        },Chats);

    }
    static async saveUsers(users , socket_id){
        Realm.open({
            Schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then(realm =>{
            for (let i = 0; i < users.length; i++) {
                let {username , name , family , biography } = users[i];
                realm.write(() => {
                    let user = realm.create('User', {
                        username , name , family , biography , socket_id
                    }, 'all');
                    let Group = realm.objects('Group').filtered('group_socket_id="'+socket_id+'"');
                    Group[0].group_users.push(user);
                });
            }
        },users , socket_id);
    }
    static async LoadUsers(socket_id){
        let Users = [];
        return Realm.open({
            Schema : [ChatSchema , MessageSchema , GroupSchema , UserSchema ]
        }).then( realm =>{
            let Group = realm.objects('Group').filtered('group_socket_id="'+socket_id+'"');
            let users = Group.group_users;
            for(let i = 0 ; i<users.length ; i++){
                const {username , name , family , biography , pic } = users[i];
                Users[i] = {username , name , family , biography , pic};
            }


            // realm.close();
            return Users;
        },Users).then(users=>users);
    }


}