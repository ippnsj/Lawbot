import React, { Component, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Modal,
  } from "react-native";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';

import colors from "../config/colors";
import Header from "./Header.js";

const questions = [
    {
        field: ["교통사고/범죄", "명예훼손/모욕", "폭행/협박"],
        title: "운전 중 언어폭행 및 협박을 받았습니다.",
        content: "제가 운전 중이었는데 어쩌고 저쩌고 샬라샬라 해외파견 프로그램 안내 ~~@!@!#!@#"
    },
    {
        field: ["교통사고/범죄",  "폭행/협박", "사기/갈취"],
        title: "사장님이 제 월급을 안줘요ㅠㅠ",
        content: "제가 운전 중이었는데 어쩌고 저쩌고 샬라샬라 해외파견 프로그램 안내 ~~@!@!#!@#"
    },
    {
        field: ["교통사고/범죄", "명예훼손/모욕", "폭행/협박"],
        title: "해외 파견 프로그램 안내",
        content: "제가 운전 중이었는데 어쩌고 저쩌고 샬라샬라 해외파견 프로그램 안내 ~~@!@!#!@#"
    },
    
]

export default class QaLawyer extends Component {
    state = {
        fontsLoaded: false,
        file: null,
         interests: [
            {
                name: "#관심분야 전체",
                selected: true
            },
            {
                name: "#자동차",
                selected: false
            },
            {
                name: "#의료",
                selected: false
            },
            {
                name: "#건물/건축",
                selected: false
            },
            {
                name: "#언론",
                selected: false
            },
            {
                name: "#기타",
                selected: false
            },
        ]
    };

  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf"),

        KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
        KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf")

      });
      this.setState({ fontsLoaded: true });
    }
  
    componentDidMount() {
        this._loadFonts();
    };

    async handleButtons(idx) {
        let newInt=[...this.state.interests];
        newInt.map((item)=> {
            item.selected=false;
        });
        // let newInt=[this.state.interests.selected ? ...this.state.interests : ...newInt]
        newInt[idx] = {...newInt[idx], selected: true};
        
        this.setState({interests: newInt});
    }
    
    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
              <View style={styles.container}>
                    <Header {...this.props}/>
                
                {/* body */}
                <ScrollView >
                    <View style={styles.body}>
                        {/* QA bar */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Image source={require("../assets/search.png")} style={styles.search} />
                            <TextInput 
                                placeholder="궁금한 법령이나 키워드를 압력해 보세요!"
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.underline}></View>
                    </View>


                    {/* my news */}
                    <View style={styles.myNews}>
                        <View style={styles.myNews_header}>
                            <Text style={styles.myNews_header_title}>내 소식</Text>
                            <Text style={styles.myNews_header_noticeNum}>1</Text>
                            <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                <Text style={styles.myNews_header_text}>전체 보기</Text>
                            </TouchableOpacity>
                            <Image style={styles.more} source={require("../assets/more.png")} />
                        </View>

                        <View style={styles.myNews_content}>
                            <Text style={styles.myNews_content_icon}>A.</Text>
                            <View style={styles.myNews_content_main}>
                                <View style={styles.myNews_content_main_subtitle}>
                                    <Text style={styles.myNews_content_main_subtitle_red}>내가 쓴 답변</Text>
                                    <Text style={styles.myNews_content_main_subtitle_black}>이 채택되었습니다.</Text>
                                </View>
                                <Text style={styles.myNews_content_main_question}>편의점 폐기음식 먹은 것 손해배상 해야하나요?</Text>
                            </View>
                        </View>
                    </View>

                    {/* interest */}
                    <View style={{backgroundColor: "#EBEBEB", marginHorizontal: -20, marginTop: "5%" }}>
                        <View style={styles.interest}>

                            {/* interest question */}
                            <View style={styles.interestQ}>
                                <View style={styles.interestQ_header}>
                                    <Text style={styles.interestQ_header_title}>관심분야 질문</Text>
                                    
                                    <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                        <Text style={styles.interestQ_header_text}>전체 보기</Text>
                                    </TouchableOpacity>
                                    <Image style={styles.more} source={require("../assets/more.png")} />
                                </View>
                                <View style={{borderBottomColor: '#ebebeb', borderBottomWidth: 1, marginTop: 10}}/>
                                
                                <View style={styles.interestQ_content}>
                                   
                                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.interestQ_content_tags}>
                                            {/* {this.state.interests.map((interest) => (
                                                <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                                    <Text style={styles.interestQ_content_tags_tag}>{interest.name}</Text>
                                                </TouchableOpacity>
                                            ))}; */}

                                            {this.state.interests.map((inter, idx)=> {
                                                return(
                                                    <TouchableOpacity  onPress={() => this.handleButtons(idx) } key={idx}>
                                                        <Text style={inter.selected ? styles.interestQ_content_tags_tag_clicked : styles.interestQ_content_tags_tag}>{inter.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                            
                                            
                                        </ScrollView>
                                        
                                        {/* {this.state.interests.map((inter) => {
                                            return(
                                                <View>

                                                    <Text>{inter.name}</Text>
                                                    <Text>{inter.selected ? "맞다" : "아니다"}</Text>
                                                </View>
                                            )
                                        })} */}

                                        {/* 찐 질문 */}
                                        <View>
                                            {questions.map((q, idx)=> {
                                                return(
                                                    <View key={idx}>
                                                        <View style={styles.interestQ_content_question_field}>
                                                        {q.field.map((f, idx)=> {
                                                            return(
                                                                <Text style={styles.interestQ_content_question_field_text} key={idx}>{f}</Text>
                                                                )
                                                            })}
                                                        </View>

                                                        <Text style={styles.interestQ_content_question_title}>{q.title}</Text>
                                                        <Text style={styles.interestQ_content_question_content}>{q.content}</Text>
                                                        <TouchableOpacity  onPress={() => this.handleButtons(idx) }>
                                                            <Text style={styles.interestQ_content_question_answer}>답변하기</Text>
                                                        </TouchableOpacity>
                                                        
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        <TouchableOpacity style={styles.interestQ_button}  onPress={() => this.terminologyExplanation()}>
                                            <Text style={styles.interestQ_buttonText}>내 관심분야 재설정 하기</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                 
                    </View>
                </ScrollView>

                    
            </View>
          )
        
    }
}


const styles=StyleSheet.create({
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%",
        // backgroundColor: "#c0c0c0"
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },

    searchSection:{
        alignItems:"center",
        marginTop: 5
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
        minHeight: 50,
    },
    search : {
        width:30,
        height:30,
        marginRight: 15,
        marginBottom: 5
    },

    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "400",
        color: "#E7E7E7"
    },

    underline : {
        width: 340,
        height: 5,
        backgroundColor: "#E7E7E7",
        marginLeft: 10,
        marginTop: -7,
        borderRadius: 30
    },

// News
    myNews: {
        justifyContent: "space-evenly",
        marginTop: "10%",
        marginHorizontal: "5%"
    },
    myNews_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    myNews_header_title: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 1,
        alignSelf: "center"
    },
    myNews_header_noticeNum: {
        fontSize: 13,
        flex:3,
        alignSelf: "auto",
        fontFamily: "KPWDBold",
        color: colors.primary,

    },
    myNews_header_text: {
        color: "#c0c0c0",
        alignSelf: "flex-end",
        fontFamily: "KPWDBold",
        fontSize: 11,
        // flex:1,
        // marginRight: -3,
        marginTop: 5
    },
    more: {
        // alignItems: "center",
        width: 20,
        height: 20,
        marginRight: -10,
        marginTop: 3,

        // flex: 0.5,
        // width: null,
        // height: null,
        // resizeMode: 'contain',
    },

    myNews_content: {
        flexDirection: "row",
        marginTop: "5%"
    },

    myNews_content_icon: {
        fontFamily: "KPBBold",
        fontSize: 22,
        marginLeft: '5%',
        alignSelf: "center"
    },
    myNews_content_main: {
        marginLeft: "5%"
    },
    myNews_content_main_subtitle: {
        flexDirection: "row"
    },

    myNews_content_main_subtitle_red: {
        color: colors.primary,
        fontFamily: "KPWDMedium",
        fontSize: 15
    },
    myNews_content_main_subtitle_black: {
        color: "black",
        fontFamily: "KPWDMedium",
        fontSize: 15
    },
    myNews_content_main_question: {
        color: "#c0c0c0",
        fontFamily: "KPWDMedium",
        fontSize: 12,
        marginTop: 2
    },



    interest: {
        backgroundColor: "white",
        marginTop: "5%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },

    interestQ: {
        justifyContent: "space-evenly",
        marginTop: "6%",
        marginHorizontal: "8%"
    },
    interestQ_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    interestQ_header_title: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 1,
        alignSelf: "center"
    },

    interestQ_header_text: {
        color: "#c0c0c0",
        alignSelf: "flex-end",
        fontFamily: "KPWDBold",
        fontSize: 11,
        // flex:1,
        // marginRight: -3,
        marginTop: 5
    },



    interestQ_content_tags: {
        flexDirection: "row",
        overflow: "hidden",
        marginTop: "5%"

    },

    interestQ_content_tags_tag: {
        marginRight: "5%",
        color: "lightgray"
    },
    interestQ_content_tags_tag_clicked: {
        marginRight: "5%",
        fontFamily: "KPWDBold",
        color: "black"
    },


    interestQ_content_question_field: {
        flexDirection: "row",
        // backgroundColor: "red", 
        marginTop: "5%"
    },

    interestQ_content_question_field_text: {
        color: "lightgray",
        marginRight: "5%",
        fontSize: 10,
    },

    interestQ_content_question_title: {
        fontSize: 15,
        fontFamily: "KPWDBold"
    },
    interestQ_content_question_content: {
        fontSize: 13,
        color: "#1d1d1d",

    },

    interestQ_content_question_answer: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        alignSelf: "flex-end",
        color: colors.primary,
        marginBottom: "5%"
    },
    interestQ_button: {
        marginVertical: "5%",
        borderColor: "#c00202",
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 10,
        height: 30,
        width: 300,
        alignSelf: "center"
    },
    interestQ_buttonText: {
        color: "#c00202",
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    },
});
