import {Left, ListItem} from "native-base";
import Message from "./Message";
import WS from "react-native-websocket";

<WS
    ref={ref => {
        this.ws = ref
    }}
    url="ws://192.168.43.162:8000/ws/chats/"
    onOpen={() => {
        console.log('Open!');
        this.ws.send(JSON.stringify({
            type: "register",
            token: this.state.token
        }))
    }}
    onMessage={(message) => {

        let text = JSON.parse(message.data);
        console.log(this.state.username);
        if(text.sender_username !== this.state.username) {
            const prevMessages = this.state.messages;
            this.setState({
                messages: [...prevMessages,
                    <ListItem thumbnail noIndent style={styles.listReceivedItemView}>
                        <Left>
                            <Message received content={text.text_message}/>
                        </Left>
                    </ListItem>]
            });
        }

    }}
    onError={(error) => {

    }}
    onClose={() => {
        console.log('closed');
    }}

/>