
import React from 'react';
import {Router , Tabs , Scene  ,Drawer } from "react-native-router-flux";
import {DrawerLayoutAndroid , StatusBar} from 'react-native';
//Components

import Login from "./source/Entry/Login";
import Register from "./source/Entry/Register";
import Splash from "./source/Entry/Splash";
import TabBar from "./source/Entry/TabBar";
import ChatsPage from "./source/Main/ChatsPage";
import MessagesPage from './source/Main/MessagesPage';
import DrawerLayout from './source/Main/DrawerLayout';
import Verification from './source/Entry/Verification';
import SetProfile from './source/Main/SetProfile';
import MagicMoveProvider from "react-native-magic-move/src/Provider";
import ShowProfile from "./source/Main/ShowProfile";
import StartChatPage from "./source/Main/StartChatPage";
import CreateGroupChannelPage from "./source/Main/CreateGroupChannelPage"
import ChannelGroupInfo from "./source/Main/ChannelGroupInfo";
import GroupMessagesPage from "./source/Main/GroupMessagesPage";
import ChannelMessagesPage from "./source/Main/ChannelMessagesPage";


export default class App extends React.Component{
    componentDidMount(): void {
        StatusBar.setHidden(false,'fade');
    }

    render(){
    return(

        <Router>

          <Scene key="root" hideNavBar>
            <Scene component={Splash} key="splash" hideNavBar initial />
            <Tabs tabBarComponent={TabBar} key="first" hideNavBar>
              <Scene component={Login} hideNavBar key="login" title="ورود"/>
              <Scene component={Register} hideNavBar key="register" title="عضویت"/>
            </Tabs>
              <Scene component={Verification} hideNavBar key="verification"/>
              <Scene component={SetProfile} hideNavBar key="setprofile" />
              <Drawer key="drawer"
                      contentComponent={DrawerLayout}
                      drawerPosition='right' >
              <Scene direction="left" component={ChatsPage} hideNavBar key="chats" title="پیام ها">

              </Scene>

              </Drawer>
              <Scene key="search" component={StartChatPage} hideNavBar title="جست و جو"/>
              <Scene key="group_chat" component={GroupMessagesPage} hidenavbar title="گروه"/>
              <Scene key="channel_chat" component={ChannelMessagesPage} hidenavbar title="کانال" />
              <Scene key="create_group_chat" component={CreateGroupChannelPage} hidenavbar title="ایجاد گروه جدید"  />
              <Scene key="group_info" component={ChannelGroupInfo} hidenavbar title="اطلاعات" />
              <Scene key="messages" component={MessagesPage} hideNavBar title="پیام ها" />
              <Scene key="showprofile" component={ShowProfile} hideNavBar title="پروفایل"/>

          </Scene>
        </Router>

    )
  }
}
