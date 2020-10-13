import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView
} from "react-native";
import * as Font from "expo-font";
import PDFReader from 'rn-pdf-reader-js';

import colors from "../config/colors";

export default class TerminologyExplanation extends Component {
  state = {
    fontsLoaded: false,
    file: null,
    word: "",
    explanation: `용어의 의미를 알려드립니다.
    dfadf
    dfsafdaf
    
    fdsafadfadsf
    
    fdsafddfaafsdfa
    
    
    ddddddddddddddddddddddd`,
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    // styles.body.minHeight = height * 0.8;
    this._loadFonts();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.body}>
                <PDFReader source={{ uri: this.props.route.params.file.uri }} style={ styles.fileImage } />
                <View style={styles.wordContainer}>
                    <TextInput 
                    style={styles.word}
                    placeholder={"법률용어를 입력해주세요."}
                    onChangeText={(word) => this.setState({ word })}
                    value={this.state.word} />
                    <TouchableOpacity
                    style={styles.terminologyButton}
                    onPress={() => {}}
                    >
                    <Text style={styles.terminologyButtonText}>검색</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <View style={styles.explanationContainer}>
                <ScrollView style={styles.explanation}>
                    <Text style={styles.explanationText}>{this.state.explanation}</Text>
                </ScrollView>
            </View> 
        </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    marginTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight,
    overflow: "hidden",
    height: "80%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    //minHeight: 465,
    minHeight: Dimensions.get("window").height * 0.58,
  },
  container: {
    flex: 1,
  },
  explanation: {
    backgroundColor: "#F6F6F6",
    width: "90%",
    height: "70%",
    borderRadius: 8,
    marginBottom: 30,
    maxHeight: "90%",
  },
  explanationContainer: {
    height: "20%",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  explanationText: {
    fontSize: 15,
    textAlign: "center"
  },
  fileImage: {
    flex: 8,
    width: "100%",
    height: "100%",
  },
  terminologyButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    width: "20%",
    marginHorizontal: 10,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  terminologyButtonText: {
    color: colors.primary,
    fontFamily: "KPWDBold",
  },
  word: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: "3%",
    marginHorizontal: 10,
    alignSelf: "center",
    width: "60%",
    minHeight: 30,
  },
  wordContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 10,
  }
});
