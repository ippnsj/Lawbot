import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as Font from "expo-font";
import { MyContext } from "../../context.js";
import Constants from "expo-constants";
import utils from "./Utils.js";

import colors from "../config/colors";
import Header from "./Header.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { documentDirectory } from "expo-file-system";
import { TextInput } from "react-native-gesture-handler";

export default class BoardDetail extends Component {
    state = {
        Content: {},
        replies: [], 
        favSelected: false,
        search: "",
    };

    async _loadFonts() {
        await Font.loadAsync({
            SCDream8: require("../assets/fonts/SCDream8.otf"),
            KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
            KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
            KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
            KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
            KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf"),
            KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
        });
        this.setState({ fontsLoaded: true });
    }

    isFocused = () => {
        this.setState({Content : this.props.route.params.post})
        this.setState({search: ""})
        this.getReplies();
        this.checkFav();
    }
    async checkFav(){
        const ctx = this.context;
        let body = {};
        body.Board_ID = this.props.route.params.post.ID;
        await fetch(`${ctx.API_URL}/user/favpost/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": ctx.token
            },
            body: JSON.stringify(body)
        }).then((res) => {
            return res.json();
        }).then((res) => {
            this.setState({ favSelected: res.success });
        });
    }
    favSelected() {
        const ctx = this.context;
        let body = {};
        body.Board_ID = this.props.route.params.post.ID;

        if(this.state.favSelected) {
            fetch(`${ctx.API_URL}/user/favpost`,{
                method: "DELETE",
                headers: {
                    "token": ctx.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
            .then((res)=>{
                return res.json();
            })
            .then((json)=>{
            })
            .catch((error) => {
                console.error(error);
            });
        }else {
            fetch(`${ctx.API_URL}/user/favpost`,{
                method: "POST",
                headers: {
                    "token": ctx.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
            .then((res)=>{
                return res.json();
            })
            .then((json)=>{
            })
            .catch((error) => {
                console.error(error);
            });
        }
        this.setState({ favSelected: !this.state.favSelected });
    }
    
    async componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }
    componentDidUpdate() {
    }


    async getReplies() {
        const ctx = this.context;

        fetch(`${ctx.API_URL}/reply/${this.props.route.params.post.ID}`, {
            method: "GET",
            headers: {
                'token': ctx.token,
            },
        }).then((data) => {
            return data.json();
        }).then((res) => {
            this.setState({replies : res});
        });
    }

    async writeReply() {
        const ctx = this.context;
        let body ={};
        body.content = this.state.search;
        body.Post_ID = this.state.Content.ID;

        if (body.content == ""){
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
            return;
        }

        fetch(`${ctx.API_URL}/reply/write`,{
            method: "POST",
            headers: {
                "token": ctx.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then((res)=>{
            return res.json();
        }).then((res) => {
            ToastAndroid.show("댓글을 등록하였습니다.", ToastAndroid.SHORT);
            this.setState({search:""});
            this.getReplies();
        }).catch((error) => {
            ToastAndroid.show("댓글 등록에 실패하였습니다...", ToastAndroid.SHORT);
            console.error(error);
        })
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
        }
      
        return (
            <View  style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <Header {...this.props} style={{flex:1}} />
                <View style={styles.bigBody}>
                    <View style={{flex:3}}>
                        <ScrollView>
                            <View style={styles.body}>
                                <View style={styles.writerInfo}>
                                    <View style={styles.writerProfile}>
                                        <Image source={{ uri: this.state.Content.User.photo} } style={styles.writerImage} />
                                    </View>
                                    <View style={styles.writerInfoDetail}>
                                        <Text style={styles.writerID}> {this.state.Content.User.userID} </Text>
                                        <Text style={styles.writtenDate}> {utils.dateAgo(this.state.Content.writtenDate)} </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.underLine} />
                            <View style={styles.body}>
                                <View style={styles.content}>
                                    <Text style={styles.contentTitle}>{this.state.Content.title}</Text>
                                    <Text style={styles.contentBody}>{this.state.Content.content}</Text>
                                </View>
                                <View style={styles.contentInfo}>
                                    <View style={styles.leftContentInfo}>
                                        <Text style={styles.replyNum}>댓글 {this.state.replies.length} </Text>
                                        <Text style={styles.views}>조회수 {this.state.Content.views}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.rightContentInfo} onPress={()=>this.favSelected()}>
                                        {
                                        this.state.favSelected ?
                                        <Image source={require("../assets/yellowStar.png")} style={styles.favImg} /> :
                                        <Image source={require("../assets/graystar.png")} style={styles.favImg} />
                                        }
                                        <Text style={styles.fav}>스크랩</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.underLine} />
                            <View style={styles.body}>
                                <View style={{marginTop: 30}}>
                                    {this.state.replies.map((reply, idx) => {
                                        return(
                                            <View style={styles.reply} key={idx}>
                                                <Text style={styles.replyID}> {utils.nameHide(reply.User.userID)} </Text>
                                                <Text style={styles.replybody}> {reply.content} </Text>
                                                <View style={styles.underLine} />
                                            </View>
                                        ); 
                                    })}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={[styles.writeReplyBox]} >
                        <KeyboardAvoidingView>
                            <TextInput style={styles.writeReply}
                                placeholder="댓글"
                                value={this.state.search}
                                onChangeText={(search) => this.setState({ search })}
                                returnKeyType="search"
                                multiline={true}
                            >
                            </TextInput>
                        </KeyboardAvoidingView>
                        <TouchableOpacity style={styles.button} onPress={()=>this.writeReply()} >                       
                            <Text style={styles.submitText}>댓글 달기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
BoardDetail.contextType = MyContext;

const styles=StyleSheet.create({
    bigBody: {
        flexDirection: "column",
        bottom: 0,
        flex:1,
        justifyContent : "space-between",
    },
    body: {
        paddingLeft:"5%",
        paddingRight:"5%",
    },
    container: {
        flex:1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    writerInfo: {
        flexDirection:"row",
        marginBottom: 20,
        marginTop: 20,
        alignItems: "center",
    },
    writerProfile: {
        // top: "25%",
        // left: "5%",
        width: 50,
        height: 50,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    writerImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    writerInfoDetail: {
        justifyContent: "space-between"
    },
    writerID: {
        fontSize: 20,
        fontFamily: "KPWDBold",
        flex:2,
        justifyContent: "center",
    },
    writtenDate: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
        flex:1,
        justifyContent: "center",
    },
    content: {
        marginTop: 30,
        marginBottom: 20,
    },
    contentTitle: {
        fontFamily: "KPWDBold",
        fontSize: 20,
    },
    contentBody: {
        fontSize: 15,
        fontFamily: "KPWDMedium",
        color: "#1d1d1d",
        marginTop: "5%",
    },
    contentInfo: {
        flexDirection:"row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    leftContentInfo: {
        flexDirection:"row",
        alignItems: "center",
    },
    rightContentInfo: {
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    replyNum: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    views: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
        left: 10,
    },
    favImg: {
        right:5,
        width:12,
        height:12,
        alignItems: "center",
        paddingRight: 10,
    },
    fav: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    replies: {
        marginTop: 20,
        paddingRight: "3%",
        paddingLeft: "3%",
        overflow: "scroll",
        // backgroundColor: "black",
    },
    reply: {
        marginBottom: 10,
    },
    replyID: {
        color: "#DBDBDB",
       marginBottom: 10,
    },
    replybody: {
        marginBottom: 20,
        fontFamily: "KPWDMedium",
        fontSize: 16,
    },
    replyIDText: {
        fontFamily: "KPWDBold",
        fontSize: 22,
    },
    replybodyText: {
        fontFamily: "KPWDMedium",
        fontSize: 16,
    },
    underLine: {
        right: 0,
        left: 0,
        height: 1,
        backgroundColor: "#E7E7E7",
        marginLeft: 10,
        marginTop: -7,
        borderRadius: 30
    },
    scroll: {
        overflow:"hidden",
    },
    writeReplyBox: {
        // backgroundColor: "#EEEEEE",
        marginTop:20,
        flex:1,
        justifyContent: "space-between",
    },
    writeReply: {
        paddingLeft: "7%",
        paddingRight: "7%",
        // backgroundColor: "red",
        height: 40,
    },
    writeReplyText: {
        fontFamily: "KPWDLight",
        fontSize: 25,

    },
    button: {
        bottom: "5%",
        borderColor: colors.primary,
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 60,
        alignSelf: "center",
    }, 
    submitText: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    }
});