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
      categories: {},
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

  isFocused = () => {
    this.setState({list: this.props.route.params.list, categories: this.props.route.params.categories});
  };

  componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  };

  categorySelect(cat) {
    this.setState(prevState => ({
        field: [...prevState.field, cat]
    }));
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

  async moveDetailPage(id){
    this.props.navigation.navigate('Lawyer', {id: id});
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

                <View>
                    
                    {this.state.list.map((ans, idx)=>{
                        return(
                            <TouchableOpacity key = {idx} onPress={()=>this.moveDetailPage(ans.User.ID)}>
                                <View style={styles.answer}>
                                    <View style={styles.answer_lawyer}>
                                        <Image style={styles.answer_lawyer_pic} source={{ uri: `${ans.User.photo}?random=${new Date()}` }} />
                                        <View style={{marginLeft:"5%", width:"50%", justifyContent: "center"}}>
                                            <Text style={styles.answer_lawyer_name}>{ans.User.name}</Text>
                                            <Text style={styles.answer_lawyer_team}>{ans.companyName}</Text>
                                            <Text style={styles.lawyer_intro}>{ans.introduction}</Text>
                                            <View style={{flexDirection:"row", flexWrap: "wrap"}}>
                                                {ans.LawyerFields.map((t, id)=>{
                                                    return(
                                                        <Text key = {id} style={{fontFamily:"KPWDBold", fontSize:11, color: colors.primary, marginRight:10}}>#{this.state.categories[t.Category_ID].name}</Text>
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
        width: 320,
        height: 1,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
        // marginVertical: "8%"
    },


    answer_lawyer: {
        flexDirection: "row",
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
