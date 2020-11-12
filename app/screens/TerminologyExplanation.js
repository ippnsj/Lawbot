import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  Keyboard,
  Image,
  Platform,
  Modal
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import PDFReader from 'rn-pdf-reader-js';
import { parse } from 'node-html-parser';

import colors from "../config/colors";
import Header from "./Header.js";
import { color } from "react-native-reanimated";

export default class TerminologyExplanation extends Component {
  state = {
    fontsLoaded: false,
    selectVisible:false,
    file: null,
    caseURL:"",
    field:"검색 조건을 선택해주세요.",
    word: "",
    explanation: `검색결과를 알려드립니다.`
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }
  
  async getCameraPermission(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ cameraPermission: true });
      this.getCameraRollPermission();
    } else {
      this.setState({ cameraPermission: false });
      alert("카메라 접근권한을 주어야 사진업로드가 가능합니다.");
    }
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
              var main = {
                'OC': 'ICTPoolC',
                'target': 'law',
                'MST': '188036',
                'type': 'XML',
                'JO': this.state.word
              };
  
              if(this.state.word.length>=3){
                main.JO = '0'+this.state.word.concat("00");
              }
              else if(this.state.word.length==2){
                main.JO = '00'+this.state.word.concat("00");
              }
              else if(this.state.word.length==1){
                main.JO = '000'+this.state.word.concat("00");
              }
  
              var url = 'http://www.law.go.kr/DRF/lawService.do?OC='+ main.OC+'&target='
              +main.target+'&type='+main.type+'&MST='+main.MST+'&JO='+main.JO;
              
              fetch(url, {
                method: "GET",
                headers: {
                // "Content-Type": "application/json",
                },
              }).then(res => {
                return res.text();
              }).then(res => {
              
                //console.log(res);
        
                var st = res.indexOf("<조문내용>");
                var mid = res.indexOf(")");
                var end = res.indexOf("</조문내용>");
                var tit = res.substring(st+15,mid+1);
                //console.log(tit);
                var sub = res.substring(mid+1,end-3);
                
  
                if(sub.length==0){
                  var cnt = 0;
                  var ref = res;
                  while(cnt<5){
                      var h1 = ref.indexOf("<항내용>");
                      var h2 = ref.indexOf("</항내용>");
                      if(h1 != -1){
                        sub += ref.substring(h1+15,h2-3)+"\n";
                        ref = ref.substring(h2+3); 
                        cnt = cnt + 1;  
                      }
                      else{
                        break;
                      }    
                    }
                }
                //console.log(sub);
  
                this.setState({explanation: "민법 "+tit + "\n\n"+sub});
              }).catch((error) => {
                console.error(error);
              });
            }else{
              this.setState({explanation: "유효한 검색어가 아닙니다. 숫자로만 검색이 가능합니다.\n예시) (민법 102조의 경우) 102"});
            }
            
          }
        })
   }

  // async NaverAPI() {
  //   Keyboard.dismiss();

  //   let data = encodeURIComponent(this.state.word);
  //   new Promise((resolve, reject)=> {
  //     let url = "https://openapi.naver.com/v1/search/encyc?query=" + data +"&display=3&sort=count";
  //     fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "X-Naver-Client-Id" : "Akn5Y7uO9AQNtb21Xm6c",
  //         "X-Naver-Client-Secret" : "JnMgYfLhJE"
  //       }
  //     })
  //     .then(res=>{
  //       if(res.status==200){
  //         return res.json();
  //       }}).then(json =>{
  //         var array = [1,2,3];
  //         var target1 = "cid=42131&";
  //         var target2 = "cid=40942&";
  //         var found1 = false;
  //         var found2 = false;
  //         console.log(json.items);
  //         for (var i in array) {
  //           if (json.items[i].link.indexOf(target1) != -1){ 
  //             var sol1 = json.items[i].description.replace(/<\/b>/g, "");
  //             var sol2 = sol1.replace(/<b>/g, "");
  //             var first = sol2.split(".");
  //             this.setState({explanation : "법률용어사전\n\n" + first[0]});
  //             found1 = true;
  //             break;
  //           }            
  //           else if (json.items[i].link.indexOf(target2) != -1){
  //             var sol1 = json.items[i].description.replace(/<\/b>/g, "");
  //             var sol2 = sol1.replace(/<b>/g, "");
  //             var first = sol2.split(".");
  //             this.setState({explanation : "두산백과\n\n" + first[0]});
  //             found2 = true;
  //             break;
  //           }
  //         }

  //         if(found1==false && found2==false){
  //           this.setState({explanation : "Not found"});
  //         }
  //       });
  //   });
  // }

  componentDidMount() {
    this._loadFonts();
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
          <KeyboardAvoidingView style={styles.body}>
            <PDFReader source={{ uri: this.props.route.params.file.uri }} style={ styles.fileImage } />
            <View style={styles.wordContainer}>
              <TouchableOpacity style={styles.terminologyButton} onPress={() => this.setState({selectVisible: true, word: "", explanation:""})}>
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
          <Modal visible={this.state.selectVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <View style={styles.fieldSelectHeader}>
                            <Text style={styles.fieldModalText}>조건설정</Text>
                        </View>
                    
                      <View style={styles.fieldRow}>
                        <View style={styles.fieldButtonContainer}>
                          <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "법률용어", explanation: "궁금한 법률 용어를 검색하세요."}); this.overlayClose();}}>
                          <Text style={styles.fieldText}>법률용어</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.fieldButtonContainer}>
                          <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "관련조항", explanation: "궁금한 민법 조문을 검색하세요.(숫자)"}); this.overlayClose();}}>
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

const styles = StyleSheet.create({
  body: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    minHeight: Dimensions.get("window").height * 0.52,
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
  },
  explanation: {
    backgroundColor: "#F6F6F6",
    width: "90%",
    borderRadius: 8,
    marginBottom: 20,
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
  fileImage: {
    flex: 6,
    width: "100%",
    height: "100%",
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
  word: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: "3%",
    marginHorizontal: 3,
    alignSelf: "center",
    width: "50%",
    minHeight: 30,
  },
  wordContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 10,
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
    // paddingVertical: "3%",
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
    justifyContent: "center",
    marginTop: "0%",
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
    color:"#fff",
    fontFamily: "KPWDBold",
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
});