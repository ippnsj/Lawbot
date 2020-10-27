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
import {Picker} from '@react-native-community/picker';
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import { MyContext } from '../../context.js';

import colors from "../config/colors";

const question =  {

    field: ["자동차", "산업재해", "폭행"],
    title: "음주운전 처벌수위와 대처",
    content: "우선 과거 2016년도 음주운전 취소(수치 0.158)된적이 있고, 2017년 무면허 전과가있습니다.2018년에 면허를다시 취득후 교동법규 위반없이 잘지내오다 전날 집근처에서 밤11시 까지 술을마시고 집근처에서 집앞으로 약50~100미터 차를이동시킨뒤 밖이추워 차에 좀만더 있다가들어가야지 하다가잠이들어 새벽4시경 경찰관들이 신고받고 오셨습니다. 수치는 0.059 나왔고, 다음날이나 언제 연락이갈거라며 그때 진술서쓰러오면 된다고하시고 가셨습니다. 현재상황은 여기까지입니다.\n1. 앞서 저는 과거 음주1회, 무면허1회 전과가있는데 이번일로인해저는 처벌이 어떻게되는지 예를들면 벌금형이라던가 재판까지 가는것인가 아님 징역인지.\n2. 0.059는 정지수치이나 과거 경험으로 취소가되는지, 결격기간은 어떻게되는지\n3. 지금으로써 제가 어떻게 해야하며 대처를 어떻게해야하는지\n4. 운전자보험으로 해결할수 있는부분이있는지 궁금합니다.",
    
   
    date: "2020.08.24",
    views: 75,
}


const answers = [
    {
        name: "박지수",
        url: require("../assets/lawyer1.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "1. 법무법인 경력 변호사로서, 다수의 교통사고범죄 소송 사건을 수행한 경험에 의하면,\n합의금은 피해정도, 치료비용, 치료기간, 수입 등을 종합적으로 고려하셔서 결정하시면 됩니다."
    },
    {
        name: "박지수",
        url: require("../assets/lawyer2.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "1. 법무법인 경력 변호사로서, 다수의 교통사고범죄 소송 사건을 수행한 경험에 의하면,\n합의금은 피해정도, 치료비용, 치료기간, 수입 등을 종합적으로 고려하셔서 결정하시면 됩니다."
    },
    {
        name: "박지수",
        url: require("../assets/lawyer3.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "1. 법무법인 경력 변호사로서, 다수의 교통사고범죄 소송 사건을 수행한 경험에 의하면,\n합의금은 피해정도, 치료비용, 치료기간, 수입 등을 종합적으로 고려하셔서 결정하시면 됩니다."
    },
    {
        name: "박지수",
        url: require("../assets/lawyer1.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        content: "1. 법무법인 경력 변호사로서, 다수의 교통사고범죄 소송 사건을 수행한 경험에 의하면,\n합의금은 피해정도, 치료비용, 치료기간, 수입 등을 종합적으로 고려하셔서 결정하시면 됩니다."
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
                        <View style={styles.header}>
                            <Image source={require("../assets/menu.png")} style={styles.menu} />
                            <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate('Home')}} >LAWBOT</Text>
                            <Image
                                source={require("../assets/profile.png")}
                                style={styles.profile}
                            />
                        </View>

                        
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
                                    <Text style={{color:"white", marginVertical: "3%", alignSelf:"center", fontSize: 16, fontFamily: "KPBLight"}}>변호사 답변 4개</Text>
                                </View>
                                
                                {answers.map((ans, idx)=>{
                                    return(
                                        <View style={styles.answer}>
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
        minHeight: 50,
        backgroundColor: "#fff"
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
