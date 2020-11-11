import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Modal
} from "react-native";

import * as Font from "expo-font";
import Constants from "expo-constants";

import colors from "../config/colors";
import Header from "./Header.js";
import { MyContext } from "../../context";


const answers = [
    {
        name: "박지수",
        url: require("../assets/lawyer1.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        introduction: "이혼 위자료 소송 한 해 승소 사건 수 1위",
        tags: ["자동차", "이혼"]
    },
    {
        name: "박지수",
        url: require("../assets/lawyer2.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        introduction: "4년 연속 대한민국 소비자만족도 법률서비스 건축부문 1위",
        tags: ["자동차", "이혼"]


    },
    {
        name: "박지수",
        url: require("../assets/lawyer3.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        introduction: "2년 연속 인권변호사 평점 5점",
        tags: ["자동차", "이혼"]


    },
    {
        name: "박지수",
        url: require("../assets/lawyer1.jpg"),
        team: "법무법인 풀씨",
        date: "2020.08.24",
        introduction: "이혼 위자료 소송 한 해 승소 사건 수 1위",
        tags: ["자동차", "이혼"]

    },
]

const tags={
  "자동차":0,  "산업재해":1,  "환경":2, "언론보도":3, "지식재산권":4, "의료":5, "건설":6, "국가":7, "기타":8, "가족/가정":9, "이혼":10, "폭행":11, "사기":12, "성범죄":13, "명예훼손":14, "모욕":15, "협박":16, "교통사고":17, "계약":18, "개인정보":19, "상속":20, "재산범죄":21, "매매":22, "노동":23, "채권추심":24, "회생/파산":25, "마약/대마":26, "소비자":27, "국방":28, "병역":29, "주거침입":30, "도급/용역":31, "건설/부동산":32, "위증":33, "무고죄":34, "아동/소년범죄":35, "임대차":36, "대여금":37, "온라인범죄":38, "음주운전":39
}

const categories=[
  "자동차",  "산업재해",  "환경", "언론보도", "지식재산권", "의료", "건설", "국가", "기타", "가족/가정", "이혼", "폭행", "사기", "성범죄", "명예훼손", "모욕", "협박", "교통사고", "계약", "개인정보", "상속", "재산범죄", "매매", "노동", "채권추심", "회생/파산", "마약/대마", "소비자", "국방", "병역", "주거침입", "도급/용역", "건설/부동산", "위증", "무고죄", "아동/소년범죄", "임대차", "대여금", "온라인범죄","음주운전"   
]

export default class LawyerRecommendation extends Component {
  state = {
      fontsLoaded: false,
      ids: [],
      similarities: [],
      keywords: "",
      list:[],
      caseURL: "",
      fields: "",
      category:[],
      tagSelectVisible:false,
      field:[],
  };


  async _loadFonts(){
    await Font.loadAsync({
        SCDream8: require("../assets/fonts/SCDream8.otf"),
        KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
        KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
        KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
        KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
      KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),

    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
    this.setState({list: this.props.route.params.list});

    // var keywords = this.props.route.params.keywords;
    // var keytags = "";
    // for(var idx in keywords) {
    //   keytags += "#" + keywords[idx] + "   ";
    // }
    // this.setState({ 
    //   ids: this.props.route.params.ids, 
    //   similarities: this.props.route.params.similarities,
    //   keywords: keytags
    // });
  }




  categorySelect(cat) {
    // console.log(cat)
    this.setState(prevState => ({
        field: [...prevState.field, cat]
    }));
    //console.log(this.state.field);
}


  getHTML(caseID){
    var main = {
        'OC': 'ICTPoolC',
        'target': 'prec',
        'ID': caseID,
        'type': 'HTML',
        'mobileYn':'Y'
    };
    var url = 'http://www.law.go.kr/DRF/lawService.do?OC='+ main.OC+'&target='+main.target+
        '&ID='+main.ID+'&type='+main.type+'&mobileYn='+main.mobileYn;
    
    fetch(url, {
        method: "GET",
        headers: {
        // "Content-Type": "application/json",
        },
    }).then((response) => {
        this.state.caseURL = response.url;
        this.props.navigation.navigate('CaseView', {
            caseURL: this.state.caseURL,
        });
    }).catch((error) => {
        console.error(error);
    });
}

    /*
    이제 여기에 getHTML 같은 함수 제작
    */
  getLawyer(category){
    // console.log(category);
  }

  async moveDetailPage(id){
    // console.log("hi");
    const ctx = this.context;
    var newLawyer;
    var newAnswers;
    await fetch(`${ctx.API_URL}/lawyer/${id}`, {
        method: "GET",
        headers: {
            'token': ctx.token,
        },
      }
      ).then((result) => {
        return result.json();
      }).then((result) => {
          // console.log("999999999999999");
          // console.log(result);
            newLawyer=result[0];
            // console.log(newLawyer);
    });

   await fetch(`${ctx.API_URL}/lawyer/answer/${id}`, {
    method: "GET",
    headers: {
        'token': ctx.token,
    },
    }).then((result) => {
        return result.json();
    }).then((result) => {
        // console.log(result);
        newAnswers=result;
        // this.setState({ token: ctx.token, user: result });
    });
    // console.log("this is recommend");
    // console.log(newLawyer);
    // console.log(newAnswers);
    this.props.navigation.navigate('Lawyer', {id: id, lawyer:newLawyer, answers: newAnswers});
  }


  render(){
    if (!this.state.fontsLoaded) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            <Header {...this.props}/>
            <ScrollView style = {styles.body}>
                <View style={styles.titleContainer}>
                    <Text style = {styles.title}>변호사 추천</Text>
                <View style={styles.underbar} />
                </View>

                <View style={{margin: "5%"}}>
                    
                    {this.state.list.map((ans, idx)=>{
                        return(
                            <TouchableOpacity key = {idx}onPress={()=>this.moveDetailPage(ans.User.ID)}>
                                <View style={styles.answer}>
                                    <View style={styles.answer_lawyer}>
                                        <Image style={styles.answer_lawyer_pic} source={{ uri: `${ans.User.photo}?random=${new Date()}` }} />
                                        <View style={{margin:"5%", width:"40%", justifyContent: "center"}}>
                                            <Text style={styles.answer_lawyer_name}>{ans.User.name}</Text>
                                            <Text style={styles.answer_lawyer_team}>{ans.companyName}</Text>
                                            <Text style={styles.lawyer_intro}>{ans.introduction}</Text>
                                            <View style={{flexDirection:"row"}}>
                                                {ans.LawyerFields.map((t, id)=>{
                                                    return(
                                                        <Text key = {id} style={{fontFamily:"KPWDBold", fontSize:11, color: colors.primary, marginRight:10}}>#{categories[t.Category_ID]}</Text>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.thinUnderline}/>

                                </View>
                            </TouchableOpacity>

                        )
                    })}
                </View>

            </ScrollView> 
        </View>
    );

  }
}
LawyerRecommendation.contextType=MyContext;

const styles = StyleSheet.create({
    body: {
      flex: 12,
      overflow: "scroll",
    },
  
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 1 : Constants.statusBarHeight,
      backgroundColor: "#fff",
    },
    title:{
      fontFamily: "KPWDBold",
      fontSize: 18,
      marginLeft: "5%",
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingBottom: "3%",
      paddingTop : "2%",
      marginTop: "5%",
    },
    keywordContainer:{
      paddingTop: "5%",
      alignItems: "center",
      marginBottom: "3%",
    },
    keywordBox:{
      width: "80%"
    },
   
    subtitle:{
      fontSize: 16,
      fontFamily: "KPWDBold",
      alignSelf: "flex-start",
      marginLeft: "5%",
    },
    underbar: {
      position: "absolute",
      width: "80%",
      height: 3,
      backgroundColor: "#E7E7E7",
      marginTop : "0%",
      marginLeft: "10%",
    },
    thinUnderline : {
        width: 300,
        height: 1,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
        // marginVertical: "8%"
    },


    answer_lawyer: {
        flexDirection: "row",
        marginRight: 15,
        marginVertical: "5%",
        justifyContent: "center",
        alignItems: "center"
       
    },
    answer_lawyer_pic: {
        borderRadius: 100,
        width: 100,
        height: 100,
        marginRight: 10
    },
    answer_lawyer_name : {
        fontSize: 16,
        fontFamily: "KPWDBold"
    },
    answer_lawyer_team : {
        fontSize: 12,
        fontFamily: 'KPBRegular',
        color: "lightgray"
    },
    lawyer_intro: {
        fontFamily: "KPWDMedium",
        fontSize: 13
    }
});
