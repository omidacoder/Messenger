import Realm from 'realm'
//Schema for Pv Chat
export const ChatSchema = {
    name: 'Chat',
    primaryKey : 'socket_id',
    properties: {
        name:  'string?',
        family: 'string?',
        biography : 'string?',
        username : 'string',
        chatname : 'string',
        pic : 'string?',
        socket_id : 'int',
    }
};
export const UserSchema = {
    name : 'User',
    primaryKey : 'username',
    properties : {
        username : 'string',
        name : 'string',
        family : 'string?',
        biography : 'string?',
        pic : 'string?',
        socket_id : 'string'
    }
};
export const ChannelSchema ={
    name : 'Channel',
    primaryKey : 'channel_socket_id',
    properties : {
        channel_name : 'string',
        channel_admins : 'User[]',
        channel_creator : 'User',
        channel_id : 'string',
        channel_number_of_members : 'int',
        channel_socket_id : 'string'
    }
};

export const GroupSchema ={
    name : 'Group',
    primaryKey : 'group_socket_id',
    properties : {
        group_users : 'User[]',
        group_name : 'string',
        group_des : 'string?',
        group_number_of_members : 'int',
        group_socket_id : 'string',
    }
};

// Schema For Messages
export const MessageSchema = {
    name: 'Message',
    primaryKey : 'message_id',
    properties : {
        message_id : 'string',
        message_text : 'string',
        send_date_time : 'string',
        sender_username : 'string',
        sent_status : 'string', //can be SENT  , SEEN
        message_type : 'string', //can be text or photo or video or ...
        chat_socket_id : 'string'
    }
};