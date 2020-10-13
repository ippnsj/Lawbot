import React, { Component } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import WebView  from "react-native-webview";
import * as Font from "expo-font";

export default class TerminologyExplanation extends Component {
  state = {
    fontsLoaded: false,
    file: null,
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
    console.log("here");
    console.log(this.props.route.params.file.uri);
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
        <View style={styles.container}>
            <WebView
            source={{ uri: this.props.route.params.file.uri }}
            style={styles.fileImage}
            allowFileAccess={true}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight,
    overflow: "hidden",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fileImage: {
    width: "100%",
    height: "100%",
  },
});
