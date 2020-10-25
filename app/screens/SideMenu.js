import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ToastAndroid,
  Platform,
  AsyncStorage,
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";

import colors from "../config/colors";

export default class SideMenu extends Component {
  state = {
    fontsLoaded: false,
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
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
          <Image></Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 1 : Constants.statusBarHeight,
        backgroundColor: "#fff",
      },
});
