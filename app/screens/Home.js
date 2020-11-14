import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    BackHandler,
    Alert
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import { MyContext } from '../../context.js'; 

import colors from "../config/colors";
import Header from "./Header.js";
import { ScrollView } from 'react-native-gesture-handler';
import Unorderedlist from 'react-native-unordered-list';


export default class Home extends Component {
    state = {
        fontsLoaded: false,
        file: null,
        qna: "",
        qnaKind: "키워드",
        boardAContents: [],
        boardBContents: [],
        boardCContents: [],
        boardLoaded: false,
        favCheck: [],
    };
  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf")
      });
      this.setState({ fontsLoaded: true });
    }

    handleBackButton = () => {
        if(this.props.navigation.isFocused()) {
            Alert.alert(
            '로우봇 종료',
            '로우봇을 종료하시겠습니까...?', [{
                text: '아니요',
            }, {
                text: '네',
                onPress: () => BackHandler.exitApp()
            }, ], {
                cancelable: false
            }
            )

            return true;
        }else {
            return false;
        }
    }
  
    componentDidMount() {
        this._loadFonts();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.addListener('focus', this.isFocused);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.removeListener('focus', this.isFocused);
    }

    isFocused = () => {
        this.getBoardContents();
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
        this.props.navigation.navigate('WritePettition', {
            fieldChanged: true,
            field: field,
            pageRerender: true,
        });
    }

    async getBoardContents() {
        const ctx = this.context;
        
        fetch(`${ctx.API_URL}/boards/posts`, {
            method: "GET",
            headers: {
                'token': ctx.token,
            },
        }).then((data) => {
            return data.json();
        }).then((result) => {
            let join1 = [];
            let join2 = [];
            let join3 = [];
            result.map((content) => {
                if (content.boardCategory == 1){
                    join1 = join1.concat(content);
                } else if (content.boardCategory == 2){
                    join2 = join2.concat(content);
                } else if (content.boardCategory == 3) {
                    join3 = join3.concat(content);
                }
            })
            this.setState({boardAContents: join1})
            this.setState({boardBContents: join2})
            this.setState({boardCContents: join3})
        }).then(()=>this.setState({boardLoaded:true}, this.getFavPost))
    }

    async getFavPost () {
        const ctx = this.context;
        
        fetch(`${ctx.API_URL}/user/favpost`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        }).then((res) =>{
            if (res.length == 0){
                console.error("no favorite Post");
                return;
            }
            let resList = [];
            for (let i = 0 ; i < res.length; i++){
                resList.push(res[i].Board_ID);
            }
            let checkList=[];
            if (resList.includes(this.state.boardAContents[0].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardAContents[1].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardAContents[2].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardBContents[0].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardBContents[1].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardBContents[2].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardCContents[0].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardCContents[1].ID)){checkList.push(true)} else{checkList.push(false)}
            if (resList.includes(this.state.boardCContents[2].ID)){checkList.push(true)} else{checkList.push(false)}
            this.setState({favCheck:checkList})
        })
    }


    async boardDetail(content, idx) {
        this.props.navigation.navigate("BoardDetail", {post: content, fav:this.state.favCheck[idx]});
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
              <View style={styles.container}>
                    <Header {...this.props}/>
                  {/* QA bar */}
                  <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

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
                                <TouchableOpacity style={styles.fieldButton} onPress={() => {this.writePettition("손해배상(자)"); }}>
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


                    {/* 법률문서해석 */}
                    <View style={styles.termSection}>
                        <View style={styles.termHeader}>
                            <Text style={styles.termSubtitle}>법률 문서 해석</Text>
                        </View>
                        <TouchableOpacity style={styles.termButton}  onPress={() => this.terminologyExplanation()}>
                            <Text style={styles.termButtonText}>법률 문서 보면서 용어 및 법령 검색하기</Text>
                        </TouchableOpacity>
                    </View>


                    {/* 게시판 */}
                    <View style={styles.boardSection}>
                        <View style={styles.boardHeader}>
                            <Text style={styles.boardSubTitle}>법률 게시판</Text>
                            <TouchableOpacity  onPress={() => this.props.navigation.navigate("Board", {BoardCategory:0})}>
                                <Text style={styles.boardHeaderText}>전체 보기</Text>
                            </TouchableOpacity>
                            <Image style={styles.more} source={require("../assets/more.png")} />
                            
                        </View>
                        <ScrollView style={styles.boardContents}>
                            <View style={styles.boardContent}>
                                <TouchableOpacity onPress={() => {this.props.navigation.navigate("Board", {BoardCategory:1})}}>
                                    <Text style={styles.boardContentSubtitle}>어플 이용 후기 게시판</Text>
                                </TouchableOpacity>
                                { this.state.boardLoaded &&
                                <View style={styles.boardContentRows}>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardAContents[0], 0)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardAContents[0].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardAContents[1], 1)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardAContents[1].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardAContents[2], 2)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardAContents[2].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                </View>
                                }
                                <TouchableOpacity onPress={() => {this.props.navigation.navigate("Board", {BoardCategory:2})}}>
                                    <Text style={styles.boardContentSubtitle}>재판 후기 게시판</Text>
                                </TouchableOpacity>
                                { this.state.boardLoaded &&
                                <View style={styles.boardContentRows}>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardBContents[0], 3)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardBContents[0].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardBContents[1], 4)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardBContents[1].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardBContents[2], 5)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardBContents[2].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                </View>
                                }
                                <TouchableOpacity onPress={() => {this.props.navigation.navigate("Board", {BoardCategory:3})}}>
                                    <Text style={styles.boardContentSubtitle}>자유 게시판</Text>
                                </TouchableOpacity>
                                { this.state.boardLoaded &&
                                <View style={styles.boardContentRows}>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardCContents[0], 6)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardCContents[0].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardCContents[1], 7)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardCContents[1].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boardcontentRow} onPress={()=>{this.boardDetail(this.state.boardCContents[2], 8)}}>
                                        <Unorderedlist><Text numberOfLines={1} style={styles.boardContentText}>{this.state.boardCContents[2].title}</Text></Unorderedlist>
                                    </TouchableOpacity>
                                </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
                  </ScrollView>
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
        paddingRight:"5%",
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

    boardContents: {
        overflow: "scroll"
    },
    boardContent: {
        marginTop: "5%",
    },

    boardContentSubtitle: {
        fontFamily: "KPWDBold",
        fontSize: 16,
        marginLeft: 15,
    },

    boardContentText: {
        fontFamily: "KPWDMedium",
        fontSize: 13,
        marginLeft: 10,
        width: 200,
    },
    boardContentRows: {
        marginLeft: "15%",
        marginTop: 4,
        marginBottom: 10,
    },
    boardcontentRow: {
        marginBottom: 5,
    },
    boardContentBullet: {
        fontSize: 6,
        alignSelf:"center",
    }
    
});