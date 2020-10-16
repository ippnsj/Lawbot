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
import * as DocumentPicker from 'expo-document-picker';
import colors from "../config/colors";
import PDFReader from 'rn-pdf-reader-js';
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";

export default class QnA extends Component {
  state = {
    fontsLoaded: false,
    word: "",
    content:"",
    section: "",
    file: null,
    field: "손해배상(자)",
    purpose: "",
    cause: "",
    cameraPermission: false,
    cameraRollPermission: false,
    filename: "",
    fieldSelectVisible: false,

  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
  }

  async selectfile() {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    this.setState({ file: result });
    this.setState({filename: result.name});
    console.log(this.state.filename)
  }


  componentDidMount() {
    this._loadFonts();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }



  register(){
    Keyboard.dismiss();
    console.log(this.state.word);
  }

  section(){

  }

  overlayClose() {
    this.setState({fieldSelectVisible: false});
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
            </View>
            <KeyboardAvoidingView style={styles.body}>
              <View style={styles.wordContainer}>
                  <TextInput 
                  style={styles.word}
                  placeholder={"제목을 입력해주세요."}
                  onChangeText={(word) => this.setState({ word })}
                  value={this.state.word} 
                  />

              </View>
            </KeyboardAvoidingView>
            <View style={styles.contentContainer}>
                <ScrollView style={styles.content}>
                <TextInput
                placeholder={"내용을 입력해주세요."}
                onChangeText={(content) => this.setState({ content })}
                value={this.state.content}/>
                </ScrollView>
            </View> 
            
            <View style={styles.QnAButtonContainer}>

                  <TouchableOpacity style={styles.QnAButton} onPress={() => this.setState({fieldSelectVisible: true})}>
                  <Text style={styles.QnAButtonText}>분야 설정</Text>
                  </TouchableOpacity>
        
      

                  <View style={styles.fieldContatiner}>
                    <Text style={styles.field}>{this.state.field}</Text>
                      <View style={styles.underbar} />
                  </View>
                  



            </View>
            <View style={styles.QnAButtonContainer}>
                  <TouchableOpacity
                  style={styles.QnAButton}
                  onPress={() => this.selectfile()}
                  >
                  <Text style={styles.QnAButtonText}>파일 첨부</Text>
                  </TouchableOpacity>

                  <View style={styles.fieldContatiner}>
                    <Text style={styles.field}>{this.state.filename}</Text>
                      <View style={styles.underbar} />
                  </View>




                  
            </View>
            <View style={styles.registerButtonContainer}>
                  <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => this.register()}
                  >
                  <Text style={styles.registerButtonText}>질문 등록하기</Text>
                  </TouchableOpacity>
            </View>
        <Modal visible={this.state.fieldSelectVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
          <View style={styles.fieldSelectModal}>
            <View style={styles.fieldSelectContainer}>
              <View style={styles.fieldSelectHeader}>
                <Text style={styles.fieldModalText}>분야선택</Text>
                <TouchableOpacity style={styles.fieldExcButton} onPress={() => {this.setState({field: "손해배상(기)"}); this.overlayClose();}}>
                  <Text style={styles.fieldExcText}>기타 분야</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldRow}>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(자)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/carAccident.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>자동차</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(산)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/industrialAccident.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>산업재해</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(환)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/environment.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>환경</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(언)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/press.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>언론보도</Text>
                </View>
              </View>
              <View style={styles.fieldRow}>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(지)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/intellectualProperty.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>지식재산권</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(의)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/medical.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>의료</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(건)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/construction.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>건설</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(국)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/government.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>국가</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.fieldSelectCancel} onPress={() => this.overlayClose()}>
              <Text style={styles.fieldSelectCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </Modal>          
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
  header: {
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

  QnAButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    marginBottom: 20,
    width: "20%",
    borderColor: colors.primary,
    borderWidth: 2,
    minHeight: 5,
    marginHorizontal:20,
    marginLeft:50
  },
  QnAButtonText: {
    color: colors.primary,
    fontFamily: "KPWDBold",
  },
  QnAButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  registerButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    marginBottom: 70,
    width: "77%",
    borderColor: colors.primary,
    borderWidth: 2,
    minHeight: 5
  },
  registerButtonText: {
    color: colors.primary,
    fontFamily: "KPWDBold",
  },
  registerButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },


  word: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: "3%",
    marginHorizontal: 10,
    alignSelf: "center",
    width: "80%",
    minHeight: 50,
  },
  wordContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 10,
      padding: 5,
      marginVertical:30
  },
  content: {
    backgroundColor: "#F6F6F6",
    width: "90%",
    borderRadius: 8,
    marginBottom: 5,
    maxHeight: "100%",
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    padding: 30,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentText: {
    fontSize: 15,
    textAlign: "center"
  },


  field: {
    fontFamily: "KPWDBold",
    fontSize: 14,
    marginLeft: "5%",
  },
  fieldButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E7E7E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  fieldButtonContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  fieldContatiner: {
    backgroundColor: "#F6F6F6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "3%",
    height:"80",
    width: "40",
    marginRight:50,
        borderRadius: 8,

  },
  fieldExcButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: "25%",
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary
  },
  fieldExcText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold"
  },
  fieldRow: {
    flex: 5,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  fieldImage: {
    width: "60%",
    height: "60%"
  },
  fieldSelectCancel: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "6%",
    alignSelf: "center"
  },
  fieldSelectCancelText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold",
  },
  fieldSelectContainer: {
    height: "35%",
    width: "80%",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: "2%",
    paddingVertical: "3%"
  },
  fieldSelectHeader:
  {
    flex: 2,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },
  fieldSelectModal: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: "center",
  },
  fieldModalText: {
    fontSize: 20,
    fontFamily: "KPWDBold",
  },
  fieldText: {
    fontSize: 15,
    fontFamily: "KPWDBold",
    marginTop: 8
  },
  fileUpload: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    margin: "4%",
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  fileUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileUploadGuide: {
    margin: "5%",
    fontSize: 12,
    color: "#959595",
    margin: "4%",
  },
  fileUploadText: {
    color: "#fff",
    fontSize: 10,
  },

});