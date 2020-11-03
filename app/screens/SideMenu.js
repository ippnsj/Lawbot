import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  AsyncStorage
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";

import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import { MyContext } from '../../context.js';

export default class SideMenu extends Component {
  state = {
    fontsLoaded: false,
    token: '',
    user: {},
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPWDMedium: require("../assets/fonts/KPWDMedium.ttf")
    });
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    this._loadFonts();

    const ctx = this.context;
    await fetch(`${ctx.API_URL}/user`, {
      method: "GET",
      headers: {
          // 'Content-Type': 'multipart/form-data',
          // 'Accept': 'application/json',
          'token': ctx.token,
      },
    }).then((result) => {
      return result.json();
    }).then((result) => {
      this.setState({ token: ctx.token, user: result });
    });
  }

  async componentDidUpdate() {
    const ctx = this.context;
    if(this.state.token != ctx.token && ctx.token != '') {
      await fetch(`${ctx.API_URL}/user`, {
        method: "GET",
        headers: {
            // 'Content-Type': 'multipart/form-data',
            // 'Accept': 'application/json',
            'token': ctx.token,
        },
      }).then((result) => {
        return result.json();
      }).then((result) => {
        this.setState({ token: ctx.token, user: result });
      });
    }
  }

  async logout() {
    await AsyncStorage.clear();
    const ctx = this.context;
    ctx.updateToken("");
    this.props.navigation.navigate("WelcomeScreen");
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()}>
            <Image source={require("../assets/close.png")} style={styles.close} />
          </TouchableOpacity>
          <View style={styles.user}>
            <Image source={require("../assets/logo4.png")} style={styles.userImage} />
            <View style={styles.userProfile}>
              <Text style={styles.userName}>{this.state.user.name}</Text>
              <View style={styles.userProfileCont}>
                {this.state.user.lawyer == 0 ? <Text style={styles.userCert}>일반회원</Text> : <Text style={styles.userCert}>변호사</Text>}
                <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                  <Text style={styles.logoutButtonText}>로그아웃</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.favoriteContainer}>
            <Text style={styles.title}>즐겨찾기</Text>
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/caseFav.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>판례 즐겨찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/lawyerFav.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>변호사 즐겨찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/qnaFav2.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>Q&A 즐겨찾기</Text>
            </TouchableOpacity>
            <View style={styles.bar} />
          </View>
          <View style={styles.boardContainer}>
            <Text style={styles.title}>게시판 관리</Text>
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/myPost.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>내가 쓴 글</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/myComment.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>댓글 단 글</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/scrap.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>스크랩</Text>
            </TouchableOpacity>
            <View style={styles.bar} />
          </View>
          <View style={styles.boardContainer}>
            <Text style={styles.title}>Q&A 관리</Text>
            {this.state.user.lawyer == 0 ?
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/qEmpty.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>내가 업로드한 질문</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={styles.naviContainer} onPress={() => this.props.navigation.navigate("Home")}>
              <Image source={require("../assets/aEmpty.png")} style={styles.favImage}/>
              <Text style={styles.subTitle}>내가 답변한 질문</Text>
            </TouchableOpacity>
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
SideMenu.contextType = MyContext;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 1 : Constants.statusBarHeight,
      backgroundColor: "#fff",
    },

    userContainer: {
      height: "20%",
      backgroundColor: "#F6F6F6",
      padding: 20
    },
    close: {
      width: 20,
      height: 20,
    },
    user: {
      // paddingHorizontal: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    userImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    userProfile: {
      marginLeft: 20,
    },
    userName: {
      fontSize: 25,
      fontFamily: "KPWDBold",
    },
    userProfileCont: {
      flexDirection: "row",
    },
    userCert: {
      fontSize: 12,
      fontFamily: "KPWDMedium",
      color: "#8D8D8D",
    },
    boardContentBullet: {
      fontSize: 4,
      alignSelf:"center",
      marginHorizontal: 10,
      color: "#8D8D8D"
    },
    logoutButton: {
      backgroundColor: colors.primary,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 15,
    },
    logoutButtonText: {
      fontSize: 10,
      fontFamily: "KPWDMedium",
      color: "#fff"
    },

    title: {
      fontFamily: "KPWDBold",
      fontSize: 16,
    },
    subTitle: {
      fontFamily: "KPWDBold",
      fontSize: 14,
      marginLeft: 20,
    },
    favImage: {
      width: 20,
      height: 20,
    },
    bar: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: "#ECECEC",
      width: "98%",
      alignSelf: "center"
    },
    naviContainer: {
      marginTop: 10,
      marginLeft: 30,
      flexDirection: "row",
    },
    contentContainer: {
    },
    favoriteContainer: {
      padding: 30,
      paddingBottom: 0,
    },

    boardContainer: {
      padding: 30,
      paddingBottom: 0,
    }
    
});
