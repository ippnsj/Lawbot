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
  Modal
} from "react-native";
import * as Font from "expo-font";
import WebView from "react-native-webview";

import { parse } from 'node-html-parser';

import colors from "../config/colors";
import Header from "./Header.js";
import { MyContext } from '../../context.js';

export default class CaseView extends Component {
  state = {
    fontsLoaded: false,
    word: "",
    field:"검색 조건을 선택해주세요.",
    explanation: `검색결과를 알려드립니다.`,
    favSelected: false,
    caseID: "",
    selectVisible:false
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  isFocused = () => {
    const ctx = this.context;
    let body = {};
    body.Precedent_ID = this.props.route.params.caseID;
    this.setState({ caseID: this.props.route.params.caseID, word: "", explanation: `검색결과를 알려드립니다.`, field:"검색 조건을 선택해주세요." });

    fetch(`${ctx.API_URL}/user/judgement/check`, {
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
    body.Precedent_ID = this.state.caseID;

    if(this.state.favSelected) {
      fetch(`${ctx.API_URL}/user/judgement`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": ctx.token
      },
      body: JSON.stringify(body)
      }).then((res) => {
        return res.json();
      }).then((res) => {
      });
    }else {
      fetch(`${ctx.API_URL}/user/judgement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": ctx.token
        },
        body: JSON.stringify(body)
        }).then((res) => {
          return res.json();
        }).then((res) => {
        });
    }

    this.setState({ favSelected: !this.state.favSelected });
  }

  componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  }

  async NaverAPI() {
    Keyboard.dismiss();
    let data = encodeURIComponent(this.state.word);
    new Promise((resolve, reject)=> {
        if(this.state.field=="법률용어"){
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
          }
          else if(this.state.field=="관련조항"){
            let str = this.state.word;
            let regex = /^[0-9]*$/gm;
            if (regex.test(str)){
              const ctx = this.context;
              let a = {};
              a.word = this.state.word;
              fetch(`${ctx.API_URL}/law`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "token": ctx.token
                },
                body: JSON.stringify(a)
              }).then((res) => {
                return res.json();
              }).then((res) => {
                this.setState({explanation: res.explanation});
              });
            }else{
              this.setState({explanation: "유효한 검색어가 아닙니다. 숫자로만 검색이 가능합니다.\n예시) (민법 102조의 경우) 102"});
            }
          }
        })
   }

   overlayClose() {
    this.setState({selectVisible: false});
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
            <TouchableOpacity style={styles.terminologyButton} onPress={() => this.setState({selectVisible: true,word:"",explanation:""})}>
              <Text style={styles.terminologyButtonText}>선택</Text>
            </TouchableOpacity>
            <TextInput 
            style={styles.word}
            placeholder={this.state.field}
            onChangeText={(word) => this.setState({ word })}
            value={this.state.word}
            //onSubmitEditing={() => this.NaverAPI()}
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
        <TouchableOpacity style={styles.favCont} onPress={() => this.favSelected()}>
            {this.state.favSelected ? <Image source={require("../assets/star.png")}  style={styles.favStar} /> :
            <Image source={require("../assets/starEmpty.png")} style={styles.favStar} />}
        </TouchableOpacity>
        <Modal visible={this.state.selectVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <View style={styles.fieldSelectHeader}>
                            <Text style={styles.fieldModalText}>조건설정</Text>
                        </View>
                    
                      <View style={styles.fieldRow}>
                        <View style={styles.fieldButtonContainer}>
                          <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "법률용어",explanation:"궁금한 법률 용어를 검색하세요."}); this.overlayClose();}}>
                          <Text style={styles.fieldText}>법률용어</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.fieldButtonContainer}>
                          <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "관련조항", explanation:"궁금한 민법 조문을 검색하세요.(숫자)"}); this.overlayClose();}}>
                          <Text style={styles.fieldText}>관련조항</Text>
                          </TouchableOpacity>
                        </View>
                      </View>



                    </View>
                    
                </View>
          </Modal>
      </View>
    );
  }
}
CaseView.contextType = MyContext;

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
    width: "15%",
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
    width: "50%",
    minHeight: 30,
  },
  wordContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      zIndex: -1,
  },

  favCont: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 30,
    top: 60,
    backgroundColor: "#fff"
  },
  favStar: {
      width: 20,
      height: 20,
  },
  fieldSelectModal: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: "center",
  },
  fieldSelectContainer: {
    height: "30%",
    width: "60%",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: "2%",
    // paddingVertical: "3%"
  },
  fieldSelectCancel: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "6%",
    alignSelf: "center"
  },
  fieldSelectCancelText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold",
  },
  fieldModalText: {
    fontSize: 20,
    fontFamily: "KPWDBold",
    color:"#fff",
  },
  fieldRow: {
    flex: 5,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  fieldButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E7E7E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldSelectHeader:
  {
    flex: 2,
    backgroundColor: colors.primary,
    flexDirection: "row",
    width: "107%",
    alignSelf:"center",
    alignItems:"center",
    height: "30%",
    justifyContent: "center"
  },
});