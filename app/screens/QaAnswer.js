import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Alert
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";

import colors from "../config/colors";
import Header from "./Header.js";

const question =  {
    field: ["교통사고/범죄", "명예훼손/모욕", "폭행/협박"],
    title: "운전 중 언어폭행 및 협박을 받았습니다.",
    date: "2020.08.24",
    views: 75,
    content: "제가 운전 중이었는데 어쩌고 저쩌고 갑자기 저보고 개새끼야라고 욕을 했는데 저도 같이 욕을 했습니다. 에바밥바밥ㅂ라리릴리리ㅣ 안녕 클레오파트라. 세상에서 제일가는 포테이토 칩.    그래서 제가 물을 마셨어요. 근데 물이 맛이 없어. 물이름은 평창수. 내 자취방 물도 맛이 없어ㅠㅠ 맛있는 물 먹고싶어"
}

const answers = [
    {
        name: "박지수",
        url: require("../assets/lawyer1.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "님 저한테 연락주세요 사건 해결에 도움을 드리겠습니다. \n연락 조라조 \n추가 문의 사항이 있을 경우 나에게 전화하도록하십시오.\n법무법인 풀씨 대표변호사 박지수"
    },
    {
        name: "박지수",
        url: require("../assets/lawyer2.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "님 저한테 연락주세요 사건 해결에 도움을 드리겠습니다. \n 연락 조라조 \n 추가 문의 사항이 있을 경우 나에게 전화하도록하십시오.\n 법무법인 풀씨 대표변호사 박지수"
    },
    {
        name: "박지수",
        url: require("../assets/lawyer3.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "님 저한테 연락주세요 사건 해결에 도움을 드리겠습니다. \n 연락 조라조 \n 추가 문의 사항이 있을 경우 나에게 전화하도록하십시오.\n 법무법인 풀씨 대표변호사 박지수"
    },
    {
        name: "박지수",
        url: require("../assets/lawyer1.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "님 저한테 연락주세요 사건 해결에 도움을 드리겠습니다. \n 연락 조라조 \n 추가 문의 사항이 있을 경우 나에게 전화하도록하십시오.\n 법무법인 풀씨 대표변호사 박지수"
    },
]

export default class QaAnswer extends Component {

    state = {
        fontsLoaded: false,
        file: null,
    };
  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
          KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
            KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf")
      });
      this.setState({ fontsLoaded: true });
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
                        <Header {...this.props}/>
                        
                        <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('QaWrite')}  >                       
                            <Image style={styles.writebuttonimg} source={require("../assets/writeButton.png")} />
                        </TouchableOpacity>
              
               
                    {/* body */}
                    <ScrollView >
                        <View style={styles.body}>

                            <View style={styles.question}>
                                <View style={styles.question_field}>
                                    {question.field.map((f, idx)=> {
                                        return(
                                            <Text style={styles.question_field_text} key={idx}>{f}</Text>
                                        )
                                    })}
                                </View>

                                <View >
                                    <Text style={styles.question_title}>Q. {question.title}</Text>
                                    <Text style={styles.question_content}>{question.content}</Text>
                                    <View style={styles.question_footer}>
                                        <Text style={styles.question_footer_date}>{question.date}</Text>
                                        <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                        <Text style={styles.question_footer_views} >{question.views}</Text>
                                    </View>
                                </View>

                            </View>


                            <View style={styles.answers}>
                                <View style={{backgroundColor: 'black', marginHorizontal: "-6%", marginTop: '5%'}}>
                                    <Text style={{color:"white", marginVertical: "3%", alignSelf:"center", fontSize: 16, fontFamily: "KPBLight"}}>변호사 답변 3개</Text>
                                </View>
                                
                                {answers.map((ans, idx)=>{
                                    return(
                                        <View style={styles.answer} key={idx}>
                                            <View style={styles.answer_lawyer}>
                                                <Image style={styles.answer_lawyer_pic} source={ans.url} />
                                                <View style={{justifyContent: "center"}}>
                                                    <Text style={styles.answer_lawyer_name}>{ans.name}</Text>
                                                    <Text style={styles.answer_lawyer_team}>{ans.team}</Text>
                                                </View>

                                                
                                            </View>
                                            <Text style={styles.answer_content}>{ans.content}</Text>
                                            <View style={styles.answer_footer}>
                                                <Text style={styles.answer_footer_date}>{question.date}</Text>
                                                <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                                <Text style={styles.answer_footer_views} >{question.views}</Text>
                                            </View>
                                        </View>
                                    )
                                })}

                            </View>
                        
                                
                        </View>
                        {/* body end */}
                        
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
    
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 36,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },

    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        // backgroundColor: "yellow",
    }, 
    writebuttonimg: {
        width: 100,
        height: 100,
    },

    question: {
        marginHorizontal: "5%"
    },


    question_field: {
        flexDirection: "row",
        marginTop: "5%"
    },

    question_field_text: {
        color: "lightgray",
        marginRight: "5%",
        fontSize: 12,
        fontFamily: "KPWDBold"
    },

    question_title: {
        fontSize: 20,
        fontFamily: "KPBBold",
        marginTop: "5%",
        lineHeight: 30
    },

    question_content: {
        fontSize: 13,
        color: "#1d1d1d",
        marginTop: "5%",
        margin: "5%"
    },

    question_footer : {
        flexDirection: "row",
        marginHorizontal: "5%"
    },
    question_footer_date: {
        marginRight: 10,
        color: "lightgray"
    },
    question_footer_views: {
        marginRight: 10,
        color: "lightgray"
    },

    boardContentBullet: {
        fontSize: 4,
        alignSelf:"center",
        marginRight: 10,
        color: "lightgray"
    },
    

    answer: {
        padding: "5%",
        borderWidth: 0.5,
        borderColor: "lightgray",
        marginVertical: "5%"
    },

    answer_lawyer: {
        flexDirection: "row",
        marginRight: 15,
        marginBottom: "5%",
       
    },
    answer_lawyer_pic: {
        borderRadius: 100,
        width: 40,
        height: 40,
        marginRight: 10
    },
    answer_lawyer_name : {
        fontSize: 14,
        fontFamily: "KPWDMedium"
    },
    answer_lawyer_team : {
        fontSize: 12,
        fontFamily: 'KPBLight',
        color: "lightgray"
    },


    
    answer_content: {
        fontSize: 13,
        color: "#1d1d1d",
        marginTop: "5%",
        margin: "5%",
        fontFamily: "KPWDMedium"
    },

    answer_footer : {
        flexDirection: "row",
        marginHorizontal: "5%"
    },
    answer_footer_date: {
        marginRight: 10,
        color: "lightgray"
    },
    answer_footer_views: {
        marginRight: 10,
        color: "lightgray"
    },

    boardContentBullet: {
        fontSize: 4,
        alignSelf:"center",
        marginRight: 10,
        color: "lightgray"
    },


})
