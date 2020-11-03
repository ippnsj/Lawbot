import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import { MyContext } from '../../context.js';

import colors from "../config/colors";
import Header from "./Header.js";

export default class Home extends Component {
    state = {
        fontsLoaded: false,
        file: null,
        qna: "",
        qnaKind: "키워드"
    };
  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf")
      });
      this.setState({ fontsLoaded: true });
    }
  
    componentDidMount() {
        this._loadFonts();
    }

    async terminologyExplanation() {
        let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
        if(result.type === "success") {
            this.setState({ file: result });
            this.props.navigation.navigate('TerminologyExplanation', {
                file: this.state.file,
            });
        }
    }

    async writePettition(field) {
        // console.log(field);
        // this.setState({field: word});
        // console.log(this.state.field);
        this.props.navigation.navigate('WritePettition', {
            field: field,
        });
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
              <View style={styles.container}>
                    <Header {...this.props}/>
                  {/* QA bar */}
                  <KeyboardAvoidingView style={styles.body}>

                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Image source={require("../assets/search.png")} style={styles.search} />
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('QaUser')}>
                                <Text style={styles.textInput}>궁금한 법률 내용 검색! 법률 Q&A</Text> 
                            </TouchableOpacity>
                        </View>
                        <View style={styles.underline}></View>
                    </View>
        
                    {/* 분석 */}
                    <View style={styles.selectSection}>
                        <View style={styles.selectHeader}>
                            <Text style={styles.selectSubtitle}>유사 판례 분석</Text>
                            <TouchableOpacity style={styles.selectEtc} onPress={() => this.writePettition("손해배상(기)")}>
                                <Text style={styles.selectEtcText}>기타 분야</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.selectContent}> 
                            <View style={styles.fieldRow}>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.props.navigation.navigate('WritePettition',{field: "손해배상(자)"}); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/carAccident.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>자동차</Text>
                                </View>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(산)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/industrialAccident.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>산업재해</Text>
                                </View>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(환)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/environment.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>환경</Text>
                                </View>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(언)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/press.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>언론보도</Text>
                                </View>
                            </View>

                            <View style={styles.fieldRow}>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(지)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/intellectualProperty.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>지식재산권</Text>
                                </View>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(의)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/medical.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>의료</Text>
                                </View>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(건)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/construction.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>건설</Text>
                                </View>
                                <View style={styles.fieldButtonContainer}>
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(국)"); }}>
                                    <Image style={styles.fieldImage} source={require("../assets/government.png")} />
                                </TouchableOpacity>
                                <Text style={styles.fieldText}>국가</Text>
                                </View>
                            </View>
                        </View>
                    </View>


                    {/* 법률용어해석 */}
                    <View style={styles.termSection}>
                        <View style={styles.termHeader}>
                            <Text style={styles.termSubtitle}>법률 용어 해석</Text>
                        </View>
                        <TouchableOpacity style={styles.termButton}  onPress={() => this.terminologyExplanation()}>
                            <Text style={styles.termButtonText}>법률 문서 올리고 쉬운 해석 받아보기</Text>
                        </TouchableOpacity>
                    </View>


                    {/* 게시판 */}
                    <View style={styles.boardSection}>
                        <View style={styles.boardHeader}>
                            <Text style={styles.boardSubTitle}>법률 게시판</Text>
                            <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                <Text style={styles.boardHeaderText}>전체 보기</Text>
                            </TouchableOpacity>
                            <Image style={styles.more} source={require("../assets/more.png")} />
                            
                        </View>
                        <View style={styles.boardContent}>
                            <Text style={styles.boardContentSubtitle}>재판 후기 게시판</Text>
                                <View style={styles.boardContentRow}>
                                    <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                    <Text style={styles.boardContentText}>폭력 남편과 2년 공방 끝에 이혼했습니다.</Text>
                                </View>
                                <View style={styles.boardContentRow}>
                                    <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                    <Text style={styles.boardContentText}>음주운전 살인미수범 공판 후기</Text>
                                </View>
                                <View style={styles.boardContentRow}>
                                    <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                    <Text style={styles.boardContentText}>성추행 현행범으로 체포되었다가 풀려났네요...</Text>
                                </View>
                                <Text></Text>
                                
                            <Text style={styles.boardContentSubtitle}>어플 이용 후기 게시판</Text>
                                {/* <View style={styles.boardContentRow}>
                                    <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                    <Text style={styles.boardContentText}>와! 로봇 최고다!</Text>
                                </View> */}
                        </View>
                    </View>

                  </KeyboardAvoidingView>
            </View>
          )
    };
}
Home.contextType = MyContext;

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
    searchSection:{
        alignItems:"center"
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 50,
    },
    search : {
        width:30,
        height:30,
        marginBottom: 5,
        marginRight: 10
    },
    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "700",
        color: "#BCBCBC"
    },
    underline : {
        width: 300,
        height: 5,
        backgroundColor: "#E7E7E7",
        marginLeft: 10,
        marginTop: -7
    },
    selectSection: {
        justifyContent: "space-evenly",
        marginTop: "10%",
    },
    selectSubtitle: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 2,
    },
    selectHeader: {
        flexDirection: "row",
    },
    selectEtc: {
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignSelf: "center",
        paddingVertical: 3,
        paddingHorizontal: 10,
    },
    selectEtcText: {
        color: "white",
        fontFamily: "KPWDBold",
        fontSize: 12,
    },
    selectContent: {
        marginTop: "5%"
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
        backgroundColor: "#f6f6f6",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
      },
      fieldButtonContainer: {
        justifyContent: "center",
        alignItems: "center"
      },

      fieldText: {
        fontSize: 15,
        fontFamily: "KPWDBold",
        marginTop: 8
      },
      fieldImage: {
        width: "60%",
        height: "60%"
      },


    termSection: {
        justifyContent: "space-evenly",
        marginTop: "10%",
    },
    termSubtitle: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 2,
    },
    termHeader: {
        flexDirection: "row",
    },
    termButton: {
        marginTop: "5%",
        borderColor: colors.primary,
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 30,
        alignSelf: "center"
    },
    termButtonText: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    },



    boardSection: {
        justifyContent: "space-evenly",
        marginTop: "10%",
    },

    boardSubTitle: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 5,
    },
    boardHeader: {
        flexDirection: "row",
    },
    boardHeaderText: {
        color: "#c0c0c0",
        alignSelf: "flex-end",
        fontFamily: "KPWDBold",
        fontSize: 11,
        flex:1,
        marginRight: -10,
        marginTop: 5
    },
    more: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'       ,
        marginVertical: 5 
    },

    boardContent: {
        marginTop: "5%",
    },

    boardContentSubtitle: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        marginLeft: 15,
    },

    boardContentText: {
        fontFamily: "KPWDMedium",
        fontSize: 13,
        marginLeft: 10
    },
    boardContentRow: {
        flexDirection:"row",
        marginLeft: "15%",
        marginTop: 4
    },
    boardContentBullet: {
        fontSize: 6,
        alignSelf:"center",
    }
    
});