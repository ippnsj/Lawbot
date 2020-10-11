import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import * as Font from "expo-font";
import colors from "../config/colors";

export default class SimilarCaseAnalysis extends Component {
  state = {
      fontsLoaded: false,
  };

  async _loadFonts(){
    await Font.loadAsync({
        SCDream8: require("../assets/fonts/SCDream8.otf"),
        KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
  }

  render(){
    if (!this.state.fontsLoaded) {
        return <View />;
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require("../assets/menu.png")} style={styles.menu} />
            <Text style={styles.logoTitle}>LAWBOT</Text>
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
                  {/* hash tag keywords needed */}
              </View>
            </View>
            <View style = {styles.CasesContainer}>
              <Text style={styles.subtitle}>유사 판례</Text>
              {/* 유사판례 해당 내용  */}
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
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 1 : Expo.Constants.statusBarHeight,
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
    title:{
      fontFamily: "KPWDBold",
      fontSize: 20,
      marginLeft: "5%",
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingBottom: "1%",
      paddingTop : "2%",
    },
    keywordContainer:{
      flex: 2,
      paddingTop: "5%",
      alignItems: "center",
    },
    keywordBox:{
      flex: 1,
      alignItems: "center",
    },
    CasesContainer:{
      flex: 8,
      paddingTop:"5%",
      alignItems: "center",
    },
    keywordGuideline:{
      fontSize: 12,
      color: "#959595",
      alignSelf:"flex-start",
      marginTop: "1%",
      marginRight: "18%",
    },
    submit: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 5,
      width: "80%",
      marginVertical: "5%",
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
      marginLeft: "8%",
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
  
