import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native";
import * as Font from "expo-font";

import WebView from "react-native-webview";

export default class CaseView extends Component {
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
            <View style={styles.header}>
                <Image source={require("../assets/menu.png")} style={styles.menu} />
                <Text style={styles.logoTitle}>LAWBOT</Text>
                <Image
                    source={require("../assets/profile.png")}
                    style={styles.profile}
                />
            </View>
            <WebView 
            source={{ uri: this.props.route.params.caseURL }}
            style={{ height: 150, resizeMode: 'cover', flex: 1 }}
            scalesPageToFit={false}
            scrollEnabled={true}
            
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
    backgroundColor: "#fff",
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
});