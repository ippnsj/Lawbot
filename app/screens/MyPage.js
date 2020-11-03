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

export default class MyPage extends Component {
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

    
    
});
