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
import { MyContext } from '../../context.js';

import colors from "../config/colors";

export default class WelcomeScreen extends Component {
  state = {
    fontsLoaded: false,
    id: '',
    password: '',
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

  loginEvent() {
    const ctx = this.context;
    var a = {};
    a.userID = this.state.id;
    a.userPW = this.state.password;
    fetch(`${ctx.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(a),
    })
    .then((response) => {
      return response.json();
    }).then((json) => {
      if (json.success === true) {
        ToastAndroid.show("로그인 되었습니다.", ToastAndroid.SHORT);
        ctx.updateToken(json.token);
        AsyncStorage.setItem('auth.accessToken', json.token).then(res => {
          this.props.navigation.navigate('Home');
        })
      } else {
        Alert.alert(
          "Login Failure",
          "아이디가 존재하지 않거나 패스워드가 일치하지 않습니다."
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={{ flex: 1 }} />
        <SafeAreaView style={styles.innerContainer}>
          <Text style={styles.logoTitle}>LAWBOT</Text>
          <Image
            style={styles.logoImage}
            source={require("../assets/logo4.png")}
          />
          <TextInput
            placeholder="아이디"
            style={styles.textInput}
            onChangeText={(id) => this.setState({ id })}
            value={this.state.id}
            onSubmitEditing={() =>  this.secondTextInput.focus()}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <TextInput
            placeholder="비밀번호"
            style={styles.textInput}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            ref={(input) => { this.secondTextInput = input; }}
            onSubmitEditing={() => this.loginEvent()}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.loginEvent()}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enrollButton} onPress={() => { this.props.navigation.navigate('Enrollment') }}>
            <Text style={styles.enrollButtonText}>회원가입</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={{ flex: 1 }} />
      </KeyboardAvoidingView>
    );
  }
}
WelcomeScreen.contextType = MyContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  enrollButton: {
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
  },
  enrollButtonText: {
    color: "#868686",
    fontFamily: "KPWDBold",
  },
  innerContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 4,
    width: "100%",
  },
  logoTitle: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "SCDream8",
  },
  logoImage: {
    height: 250,
    width: 250,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: "80%",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "KPWDBold",
  },
  textInput: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    height: 40,
    width: "80%",
    paddingLeft: 10,
    marginTop: 15,
  },
});
