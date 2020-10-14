import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import * as DocumentPicker from 'expo-document-picker';

import colors from "../config/colors";

export default class TerminologyButton extends Component {
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

  async terminologyExplanation() {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    this.setState({ file: result });
    this.props.navigation.navigate('TerminologyExplanation', {
        file: this.state.file,
    });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={styles.terminologyButton}
            onPress={() => this.terminologyExplanation()}
            >
            <Text style={styles.terminologyButtonText}>법률 용어 의미분석</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  terminologyButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    width: "80%",
  },
  terminologyButtonText: {
    color: "#fff",
    fontFamily: "KPWDBold",
  }
});
