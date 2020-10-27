import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";

import * as Font from "expo-font";
import Constants from "expo-constants";
import colors from "../config/colors";

export default class SimilarCaseAnalysis extends Component {
  state = {
      fontsLoaded: false,
      ids: [],
      similarities: [],
      keywords: "",
      caseURL: "",
  };

  async _loadFonts(){
    await Font.loadAsync({
        SCDream8: require("../assets/fonts/SCDream8.otf"),
        KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
        KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
        KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
    var keywords = this.props.route.params.keywords;
    var keytags = "";
    for(var idx in keywords) {
      keytags += "#" + keywords[idx] + "   ";
    }
    this.setState({ 
      ids: this.props.route.params.ids, 
      similarities: this.props.route.params.similarities,
      keywords: keytags
    });
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

  render(){
    if (!this.state.fontsLoaded) {
        return <View />;
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require("../assets/menu.png")} style={styles.menu} />
            <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate("Home")}}>LAWBOT</Text>
            <Image
                source={require("../assets/profile.png")}
                style={styles.profile}
            />
          </View>
          <View style = {styles.body}>
            <View style={styles.titleContainer}>
              <Text style = {styles.title}>유사 판례 분석</Text>
              <View style={styles.underbar} />
            </View>
            <View style = {styles.keywordContainer}>
              <Text style={styles.subtitle}>내 소장 키워드</Text>
              <View style={styles.keywordBox}>
                <Text style = {styles.keywordGuideline}>
                  내 소장 분석에서 비중 있게 분석 된 키워드입니다.
                </Text>
                <Text style = {styles.keywordsText}>{this.state.keywords}</Text>
              </View>
            </View>
            <View style = {styles.casesContainer}>
              <View style={styles.caseTitleContainer}>
                <Text style={styles.subtitle}>유사 판례</Text>
                <Text style={styles.caseExText}>유사도가 높은 판례 Top10을 보여줍니다.</Text>
              </View>
              <ScrollView style={styles.cases} scrollEnabled alwaysBounceHorizontal horizontal>
                <View style={styles.caseBound}>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[0]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[0]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[0]}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[5]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[5]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[5]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.caseBound}>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[1]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[1]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[1]}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[6]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[6]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[6]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.caseBound}>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[2]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[2]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[2]}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[7]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[7]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[7]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.caseBound}>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[3]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[3]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[3]}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[8]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[8]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[8]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.caseBound}>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[4]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[4]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[4]}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.case}>
                    <Text style={styles.similarityText}>{this.state.similarities[9]}</Text>
                    <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[9]) }}>
                      <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[9]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.submit}>
                <Text style={styles.submitText}>다른 사례 분석하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submit}>
                <Text style={styles.submitText}>관련 변호사 추천 받기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );

  }
}

const styles = StyleSheet.create({
    body: {
      flex: 12,
      overflow: "scroll",
    },
    case: {
      marginVertical: 10,
    },
    caseBound: {
      margin: 10,
      marginTop: 0,
    },
    caseContainer: {
      backgroundColor: "#E7E7E7",
      borderRadius: 10,
      padding: 20,
    },
    caseExText: {
      fontSize: 12,
      fontFamily: "KPWDBold",
      color: "#959595",
      marginLeft: 20,
      alignSelf: "center"
    },
    caseID: {
      fontFamily: "KPWDMedium",
      color: "#7B7B7B"
    },
    cases: {
      width: "85%",
      marginBottom: 8,
    },
    caseTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignSelf: "flex-start"
    },
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 1 : Constants.statusBarHeight,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "5%",
      paddingRight: "5%",
      minHeight: 50,
      backgroundColor: "#fff",
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
    casesContainer:{
      paddingTop:"5%",
      alignItems: "center",
    },
    keywordGuideline:{
      fontSize: 12,
      fontFamily: "KPWDBold",
      color: "#9A9A9A",
      alignSelf:"flex-start",
    },
    keywordsText: {
      fontFamily: "KPWDMedium",
      fontSize: 12,
      paddingTop: "1%"
    },
    similarityText: {
      fontSize: 13,
      fontFamily: "KPWDMedium",
      alignSelf:"center",
    },
    submit: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 5,
      width: "80%",
      marginVertical: "2%",
      alignItems: "center",
      paddingVertical: "0.5%",
    },
    submitText: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: "KPWDBold",
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
});
  