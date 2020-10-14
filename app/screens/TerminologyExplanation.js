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
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import PDFReader from 'rn-pdf-reader-js';

import colors from "../config/colors";

export default class TerminologyExplanation extends Component {
  state = {
    fontsLoaded: false,
    file: null,
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
      let url = "https://openapi.naver.com/v1/search/encyc?query=" + data +"&display=3&sort=count";
      fetch(url, {
        method: "GET",
        headers: {
          "X-Naver-Client-Id" : "Akn5Y7uO9AQNtb21Xm6c",
          "X-Naver-Client-Secret" : "JnMgYfLhJE"
        }
      })
      .then(res=>{
        if(res.status==200){
          return res.json();
        }}).then(json =>{
          //console.log("json",json.items[0].description)
          //this.setState({explanation : json.items[0].description})
          var array = [1,2,3];
          var target1 = "cid=42131&";
          var target2 = "cid=40942&";
          var found1 = false;
          var found2 = false;
          // var result = "";
          //var reg = "[^<]";
          for (var i in array) {
            if (json.items[i].link.indexOf(target1) != -1){ 
              //this.setState({explanation : "법률용어사전\n\n" + json.items[i].description});
              //var end = json.items[i].link.indexOf('.');
              var sol1 = json.items[i].description.replace(/<\/b>/g, "");
              var sol2 = sol1.replace(/<b>/g, "");
              var first = sol2.split(".");
              this.setState({explanation : "법률용어사전\n\n" + first[0]});
              found1 = true;
              break;
            }            
            else if (json.items[i].link.indexOf(target2) != -1){
              var sol1 = json.items[i].description.replace(/<\/b>/g, "");
              var sol2 = sol1.replace(/<b>/g, "");
              var first = sol2.split(".");
              this.setState({explanation : "두산백과\n\n" + first[0]});
              found2 = true;
              break;
            }
          }

          // if(found1==false){
          //   for (var t in array){
          //     if (json.items[t].link.indexOf(target2) != -1){
          //       //this.setState({explanation : json.items[i].description});
          //       var sol1 = json.items[i].description.replaceAll("</b>", "");
          //       var sol2 = sol1.replaceAll("<b>", "");
          //       this.setState({explanation : "법률용어사전\n\n" + sol2});
          //       found2 = true;
          //       break;
          //     }
          //   }
          // }

          if(found1==false && found2==false){
            this.setState({explanation : "Not found"});
          }
        });
    });
  }

  componentDidMount() {
    this._loadFonts();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require("../assets/menu.png")} style={styles.menu} />
            <Text style={styles.logoTitle}>LAWBOT</Text>
            <Image
              source={require("../assets/profile.png")}
              style={styles.profile}
            />
          </View>
          <KeyboardAvoidingView style={styles.body}>
              <PDFReader source={{ uri: this.props.route.params.file.uri }} style={ styles.fileImage } />
              <View style={styles.wordContainer}>
                  <TextInput 
                  style={styles.word}
                  placeholder={"법률용어를 입력해주세요."}
                  onChangeText={(word) => this.setState({ word })}
                  value={this.state.word} />
                  <TouchableOpacity
                  style={styles.terminologyButton}

                  onPress={() => this.NaverAPI()}

                  >
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
    maxHeight: "90%",
    padding: 10,
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
    textAlign: "center"
  },
  fileImage: {
    flex: 6,
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "5%",
    paddingRight: "5%",
    minHeight: 50,
  },
  logoTitle: {
    fontSize: 20,
    fontFamily: "SCDream8",
  },
  menu: {
    width: 20,
    height: 20,
  },
  profile: {
    width: 20,
    height: 20,
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
      minHeight: 10,
  }
});
