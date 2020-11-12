import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
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
        replies: [{text:0}, {text:2}, {text:0}, {text:2}],
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
        this.getReplies();
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

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
        }
      
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <View style={styles.body}>
                    <View style={styles.writerInfo}>
                        <View style={styles.writerProfile}>
                            {/* <Image source={{ uri: this.state.Content.User.photo} } style={styles.writerImage} /> */}
                        </View>
                        <View style={styles.writerInfoDetail}>
                            {/* <Text style={styles.writerID}> {this.state.Content.User.userID} </Text> */}
                            {/* <Text style={styles.writtenDate}> {utils.dateAgo(this.state.Content.writtenDate)} </Text> */}
                        </View>
                    </View>
                </View>
                <View style={styles.underLine} />
                <View style={styles.body}>
                    <View style={styles.content}>
                        {/* <Text style={styles.contentTitle}>{this.state.Content.title}</Text> */}
                        {/* <Text style={styles.contentBody}>{this.state.Content.content}</Text> */}
                    </View>
                    <View style={styles.contentInfo}>
                        <View style={styles.leftContentInfo}>
                            <Text style={styles.replyNum}>댓글 {this.state.replies.length} </Text>
                            <Text style={styles.views}>조회수 {this.state.Content.views}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {utils.onAddFav(this.state.Content.ID)}}>
                            <View style={styles.rightContentInfo}>
                                    <Image source={require("../assets/scrap.png")} style={styles.favImg}/>
                                    <Text style={styles.fav}>스크랩</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.underLine]} />
                <View style={styles.body}>
                    <ScrollView showsVerticalScrollIndicator={true} style={styles.replies}>
                        {this.state.replies.map((reply, idx) => {
                            return(
                                <View style={styles.reply} key={idx}>
                                    <View style={styles.replyID}>
                                        <Text style={styles.replyID}>{reply.User_ID}</Text>

                                    </View>
                                    <View style={styles.replybody}>
                                        <Text style={styles.replybody}>{reply.content}</Text>

                                    </View>
                                    <View style={styles.underLine}></View>
                                </View>
                            )
                        })
                        }
                    </ScrollView>
                    <TextInput style={styles.writeReply}

                    >
                    </TextInput>
                </View>
            </View>
        );
    }
}
BoardDetail.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        paddingLeft:"5%",
        paddingRight:"5%",
      },
    container: {
        flex: 1,
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
    },
    reply: {
        marginTop: 10,
        marginBottom: 10,
    },
    replyID: {
       marginTop: 10,
       marginBottom: 10,
    },
    replybody: {
        marginBottom: 20,
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
    writeReply: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
    },
});