import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    ToastAndroid,
    TouchableOpacity,
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import {Picker} from '@react-native-community/picker';
import { MyContext } from '../../context.js';

import colors from "../config/colors";
import Header from "./Header.js";

export default class BoardWrite extends Component {
    state = {
        fontsLoaded: false,
        BoardCategory:3,
        User: {},
    };

    // BoardCategory
    // 1 : 앱 이용 후기
    // 2 : 재판 후기
    // 3 : 자유
  
    isFocused = () => {
        this.setState({ title: "", content: "" });
        this.setState({BoardCategory: this.props.route.params.category});
    }

    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
          KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
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

    overlayClose() {
        this.setState({categoryVisible: false});
    }

    async createArticle() {
      const ctx = this.context;
      let body = {};
      body.title = this.state.title;
      body.content = this.state.content;
      body.boardCategory = this.state.BoardCategory;


      await fetch(`${ctx.API_URL}/boards/write`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "token": ctx.token
        },
        body: JSON.stringify(body),
      }).then((res) => {
        return res.json();
      }).then((res) => {
        if(res.success) {
          ToastAndroid.show("답변 등록에 성공하였습니다!", ToastAndroid.SHORT);
          this.props.navigation.navigate("Board");
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

            <KeyboardAvoidingView style={styles.body}>
                <View style={{margin: "5%"}}>
                    <View style={{margin: "3%", flex: 2}}>
                        <TextInput 
                            placeholder="제목을 입력하세요."
                            style={styles.title}
                            value={this.state.title}
                            onChangeText={(title)=>this.setState({title})}
                            maxLength={45}
                        />
                    </View>
                    <View style={{height: 0.5, backgroundColor: "lightgray"}}></View>

                    <View style={{margin: "3%", flex: 3, height: 400}}>
                        <TextInput 
                            placeholder="내용을 입력해주세요"
                            style={styles.content}
                            value={this.state.content}
                            onChangeText={(content)=>this.setState({content})}
                        />
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: "gray", marginHorizontal: "-10%"}}></View>
                <View>
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.BoardCategory}
                        style={{ width: 150 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({BoardCategory: itemValue})}>
                        <Picker.Item label="앱 이용 후기" value={1} />
                        <Picker.Item label="재판 후기" value={2} />
                        <Picker.Item label="자유 게시판" value={3} />
                    </Picker>
                </View>
                    <TouchableOpacity style={styles.Button}  onPress={() => {console.log(this.state.BoardCategory); this.createArticle()}}>
                        <Text style={styles.ButtonText}>글 등록하기</Text>
                    </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
        )
    }
}
BoardWrite.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%"
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 18,
        fontFamily: "KPWDLight",
        color: "black"
    },
    content: {
        fontSize: 20,
        fontFamily: "KPWDLight",
        color: "black"
    },
    category: {
        fontSize: 16,
        fontFamily: "KPWDMedium",
        color: "#505050",
        margin: "3%"
    },
    attach: {
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
        marginTop: "5%",
        borderColor: colors.primary,
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 60,
        alignSelf: "center"
    },
    ButtonText: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    },



})