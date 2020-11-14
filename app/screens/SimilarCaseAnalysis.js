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
import { MyContext } from '../../context.js';

export default class SimilarCaseAnalysis extends Component {
  state = {
      fontsLoaded: false,
      ids: [],
      similarities: [],
      keywords: "",
      caseURL: "",
      fields: "",
      category:[],
      tagSelectVisible:false,
      field:[],
      categories: {},
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

  isFocused = () => {
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

    this.fieldReset();
  }

  fieldReset() {
    const field = [];
    for(var i = 0; i < this.props.route.params.categories.length; i++) {
      field[i] = -1;
    }
    this.setState({ field });
  }

  async componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
    this.setState({categories: this.props.route.params.categories});
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  }

  overlayClose() {
    this.setState({tagSelectVisible: false});

    const ctx = this.context;
    let body = {
      tags: [],
    };
    for(var i = 0; i < this.state.field.length; i++) {
      if(this.state.field[i] === 1) {
        body.tags.push(this.state.categories[i].ID);
      }
    }

    fetch(`${ctx.API_URL}/lawr`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'token': ctx.token,
      },
      body: JSON.stringify(body),
    }
    ).then((res) => {
      return res.json();
    }).then((res) => {
      this.props.navigation.navigate('LawyerRecommendation', { list: res, categories: this.state.categories })
    });
  }

  categorySelect(idx) {
    const { field } = this.state;
    field[idx] = -field[idx];
    this.setState({ field });
  }

  getHTML(caseID) {
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
            caseID: caseID,
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
    console.log(category);
  }

  render(){
    if (!this.state.fontsLoaded) {
        return <View />;
    }

    return (
        <View style={styles.container}>
          <Header {...this.props}/>
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
                  {this.state.similarities[0] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[0]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[0]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[0]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                  {this.state.similarities[5] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[5]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[5]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[5]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                </View>
                <View style={styles.caseBound}>
                  {this.state.similarities[1] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[1]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[1]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[1]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                  {this.state.similarities[6] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[6]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[6]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[6]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                </View>
                <View style={styles.caseBound}>
                  {this.state.similarities[2] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[2]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[2]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[2]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                  {this.state.similarities[7] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[7]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[7]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[7]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                </View>
                <View style={styles.caseBound}>
                  {this.state.similarities[3] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[3]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[3]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[3]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                  {this.state.similarities[8] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[8]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[8]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[8]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                </View>
                <View style={styles.caseBound}>
                  {this.state.similarities[4] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[4]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[4]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[4]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                  {this.state.similarities[9] !== undefined ?
                    <View style={styles.case}>
                      <Text style={styles.similarityText}>{this.state.similarities[9]}</Text>
                      <TouchableOpacity style={styles.caseContainer} onPress={() => { this.getHTML(this.state.ids[9]) }}>
                        <Text style={styles.caseID}>{"판례일련번호\n" + this.state.ids[9]}</Text>
                      </TouchableOpacity>
                    </View> :
                  null}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.submit} onPress={() => this.props.navigation.navigate("WritePettition")}>
                <Text style={styles.submitText}>다른 사례 분석하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submit} onPress={()=> this.setState({tagSelectVisible: true})}>
                <Text style={styles.submitText}>관련 변호사 추천 받기</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal visible={this.state.tagSelectVisible} onRequestClose={() => this.setState({ tagSelectVisible: false })} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <View style={styles.fieldSelectHeader}>
                            <Text style={styles.fieldModalText}>분야설정</Text>
                        </View>
                        <ScrollView>
                            {this.state.categories.map((cat, idx)=>{
                                return(
                                    <TouchableOpacity onPress={()=>this.categorySelect(idx)} key={idx}>
                                        <Text style={ this.state.field[idx] === 1 ? styles.categoryText_selected : styles.categoryText_unselect
                                        }>{cat.name}</Text>
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={styles.fieldSelectCancel} onPress={() => this.overlayClose()}>
                        <Text style={styles.fieldSelectCancelText}>완료</Text>
                    </TouchableOpacity>
                    
                </View>
          </Modal>
        </View>
    );

  }
}
SimilarCaseAnalysis.contextType = MyContext;

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

    fieldSelectModal: {
      flex: 1,
      backgroundColor: 'rgba(52, 52, 52, 0.8)',
      justifyContent: "center",
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
    fieldModalText: {
      fontSize: 20,
      fontFamily: "KPWDBold",
    },
    categoryText_unselect: {
      marginVertical: 5,
      color: "#939393",
      fontSize: 18,
      fontFamily: "KPWDMedium"
    },
  
    categoryText_selected: {
      marginVertical: 5,
      color: colors.primary,
      fontSize: 18,
      fontFamily: "KPWDMedium"
    },
});
