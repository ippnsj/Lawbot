import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import WebView from "react-native-webview";

import { parse } from 'node-html-parser';

import colors from "../config/colors";
import Header from "./Header.js";

export default class CaseView extends Component {
  state = {
    fontsLoaded: false,
    word: "",
    explanation: `법률용어의 의미를 알려드립니다.`
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
  }

  async NaverAPI() {
    Keyboard.dismiss();
    let data = encodeURIComponent(this.state.word);
    new Promise((resolve, reject)=> {
        let url = "https://openapi.naver.com/v1/search/encyc?query=" + data +"&display=3&sort=count";
        fetch(url, {
            method: "GET",
            headers: {
            "X-Naver-Client-Id" : "Akn5Y7uO9AQNtb21Xm6c",
            "X-Naver-Client-Secret" : "JnMgYfLhJE"
            }
        })
        .then(res=>{
            if(res.status !== 200)
                return {};

            return res.json();
        }).then(json =>{
            const DICTIONARIES = {
              "법률용어사전": "cid=42131",
              "두산백과": "cid=40942",
            };
            let idx = -1;
            let dict = "";

            for(let [key, val] of Object.entries(DICTIONARIES)) {
              for(let i = 0; i < json.items.length; i++) {
                if(json.items[i].link.indexOf(val) != -1) {
                  idx = i;
                  dict = key;
                  break;
                }
              }

              if(idx != -1)
                  break;
            }

            if(idx == -1) {
                this.setState({explanation: "검색 결과가 없습니다."});
                return;
              }

            fetch(json.items[idx].link, {
                method: 'get',
            }).then(res => {
              return res.text();
            }).then(res => {
                const root = parse(res);
                const summary = root.querySelector('.summary_area');
                const descriptions = root.querySelectorAll('.txt');
                let description = '';
                for(let k of descriptions) {
                    description += k.text;
                }

                let ret = dict + '\n';
                if(summary) {
                  ret += summary.text + '\n';
                }

                if(description) {
                  ret += description;
                }
                this.setState({explanation: ret});
            });
        });
    });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <Header {...this.props}/>
        <View style={styles.webViewContainer}>
          <WebView 
          source={{ uri: this.props.route.params.caseURL }}
          style={styles.webView}
          scalesPageToFit={false}
          scrollEnabled={true}
          />
        </View>
        <KeyboardAvoidingView style={styles.body}>
          <View style={styles.wordContainer}>
            <TextInput 
            style={styles.word}
            placeholder={"법률용어를 입력해주세요."}
            onChangeText={(word) => this.setState({ word })}
            value={this.state.word}
            onSubmitEditing={() => this.NaverAPI()}
            returnKeyType="search" />
            <TouchableOpacity style={styles.terminologyButton} onPress={() => this.NaverAPI()}>
              <Text style={styles.terminologyButtonText}>검색</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.explanationContainer}>
          <ScrollView style={styles.explanation}>
              <Text style={styles.explanationText}>{this.state.explanation}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  body: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    minHeight: Dimensions.get("window").height * 0.04,
  },
  explanation: {
    backgroundColor: "#F6F6F6",
    width: "90%",
    borderRadius: 8,
    marginBottom: Dimensions.get("window").height * 0.02,
  },
  explanationContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  explanationText: {
    fontSize: 15,
    textAlign: "center",
    padding: 10,
  },
  terminologyButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    width: "20%",
    marginHorizontal: 10,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  terminologyButtonText: {
    color: colors.primary,
    fontFamily: "KPWDBold",
  },
  webView: {
    resizeMode: 'cover', 
    flex: 1,
  },
  webViewContainer: {
    flex: 4,
    marginTop: -40,
  },
  word: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: "3%",
    marginHorizontal: 10,
    alignSelf: "center",
    width: "60%",
    minHeight: 30,
  },
  wordContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      zIndex: -1,
  }
});