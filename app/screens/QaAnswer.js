import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Modal,
    TouchableOpacity,
    ScrollView,
    ToastAndroid
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../context.js';

import colors from "../config/colors";
import Header from "./Header.js";

export default class QaWrite extends Component {
    state = {
        fontsLoaded: false,
        content:"",
        displayQuestion: false,
        post: {},
    };
  
    isFocused = () => {
        this.setState({ content: "", post: this.props.route.params.post });
    }

    overlayClose() {
        this.setState({displayQuestion: false});
    }

    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
          KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf")
      });
      this.setState({ fontsLoaded: true });
    }
  
    componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
    }

    componentWillUnmount() {
      this.props.navigation.removeListener('focus', this.isFocused);
    }

    writeAnswer() {
        const ctx = this.context;
        let body = {
            "content": this.state.content,
            "Question_ID": this.state.post.ID
        };

        fetch(`${ctx.API_URL}/qna/answer`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": ctx.token
            },
            body: JSON.stringify(body)
        }).then((res) => {
            return res.json();
        }).then((res) => {
            if(res.success) {
                ToastAndroid.show("답변 등록에 성공하였습니다!", ToastAndroid.SHORT);
                this.props.navigation.goBack();
            }else {
                ToastAndroid.show("답변 등록에 실패하였습니다...", ToastAndroid.SHORT);
            }
        });
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
            <View style={styles.container}>
                <Header {...this.props}/>

                <View style={{marginTop: "3%", flex: 1, marginBottom: "1%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: "10%"}}>
                    <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}><Image source={require("../assets/close.png")} style={styles.close} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({ displayQuestion: true })}}><Text style={styles.questionViewText}>Q. 질문보기</Text></TouchableOpacity>
                </View>
                <View style={{height: 0.5, backgroundColor: "lightgray", width: "80%", alignSelf:"center"}}></View>
                <KeyboardAvoidingView style={styles.body}>
                    <View style={{flex: 1, margin: "5%"}}>
                        {/* <View style={{margin: "3%", flex: 1, marginBottom: "1%", flexDirection: "row", justifyContent: "space-between"}}>
                            <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}><Image source={require("../assets/close.png")} style={styles.close} /></TouchableOpacity>
                            <TouchableOpacity><Text style={styles.questionViewText}>Q. 질문보기</Text></TouchableOpacity>
                        </View>
                        <View style={{height: 0.5, backgroundColor: "lightgray"}}></View> */}

                        <View style={{margin: "3%", flex: 20}}>
                            <TextInput 
                                placeholder="서비스 운영정책을 지켜 답변을 작성해주세요."
                                style={styles.content}
                                value={this.state.content}
                                onChangeText={(content)=>this.setState({content})}
                                multiline
                            />
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: "gray", marginHorizontal: "-10%"}}></View>
                    <TouchableOpacity style={styles.Button}  onPress={() => {this.writeAnswer()}}>
                        <Text style={styles.ButtonText}>답변 등록하기</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                <Modal visible={this.state.displayQuestion} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                    <View style={styles.questionViewModal}>
                        <View style={styles.questionViewContainer}>
                            <Text style={styles.question_title}>Q. {this.state.post.title}</Text>
                            <ScrollView>
                                <Text style={styles.question_content}>{this.state.post.content}</Text>
                            </ScrollView>
                        </View>
                        <TouchableOpacity style={styles.questionViewCancel} onPress={() => this.overlayClose()}>
                            <Text style={styles.questionViewCancelText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
          )
    }
}
QaWrite.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        flex: 20,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%"
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },

    close: {
        width: 15,
        height: 15
    },
    content: {
        fontSize: 16,
        fontFamily: "KPWDLight",
        color: "black",
        minHeight: "100%",
        textAlignVertical: "top"
    },
    category: {
        fontSize: 16,
        fontFamily: "KPWDMedium",
        color: "#505050",
        margin: "3%"
    },
    icon: {
        width: 20,
        height: 20,
        alignSelf: "center",
    },
     Button: {
        marginVertical: "8%",
        borderColor: colors.primary,
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 80,
        alignSelf: "center"
    },
     ButtonText: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    },
    questionViewText: {
        fontFamily: "KPBBold",
        fontSize: 16,
    },
    questionViewModal: {
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        justifyContent: "center",
    },
    questionViewContainer: {
        height: "50%",
        width: "80%",
        backgroundColor: "#fff",
        alignSelf: "center",
        paddingHorizontal: "2%",
        paddingVertical: "3%"
    },
    questionViewCancel: {
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: "6%",
        alignSelf: "center"
    },
    questionViewCancelText: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "KPWDBold",
    },
    question_title: {
        fontSize: 20,
        fontFamily: "KPBBold",
        marginTop: "5%",
        lineHeight: 30,
        textAlign: "center",
    },
    question_content: {
        fontSize: 15,
        fontFamily: "KPWDLight",
        color: "#1d1d1d",
        marginTop: "5%",
        margin: "5%"
    },
})