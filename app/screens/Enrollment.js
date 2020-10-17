import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";

import colors from "../config/colors";

export default class Enrollment extends Component {
  state = {
    fontsLoaded: false,
    id: "",
    password: "",
    name: "",
    birth: "",
    lawyer: false,
    phone: "",
    confirmPhone: "",
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      NotoSansBold: require("../assets/fonts/NotoSans-Bold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
  }

  confirmID() {
    var body = {};
    body.userID = this.state.id;
    fetch("http://52.78.171.102:8080/register/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    .then((response) => {
      return response.json();
    }).then((json) => {
      if (json.success === true) {
        Keyboard.dismiss();
        
        Alert.alert(
            "아이디 중복확인",
            "사용가능한 아이디입니다."
        );
      } else {
        Alert.alert(
          "아이디 중복확인",
          "이미 존재하는 아이디입니다."
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoTitle}>LAWBOT</Text>
            </View>
            <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === "ios" ? "padding" : null}>
                <Text style={styles.guideText}>회원가입란을 작성해주세요.</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>아이디</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder="아이디를 입력해주세요."
                            style={styles.textInputForId}
                            onChangeText={(id) => this.setState({ id })}
                            value={this.state.id}
                            maxLength={45}
                        />
                        <TouchableOpacity style={styles.idconfirmButton} onPress={() => this.confirmID()} >
                            <Text style={styles.idconfirmButtonText}>중복확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>비밀번호</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder="비밀번호를 입력해주세요."
                            style={styles.textInput}
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                            maxLength={45}
                        />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>이름</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder="이름을 입력해주세요."
                            style={styles.textInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            maxLength={45}
                        />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>생년월일</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder="예) 19970812"
                            style={styles.textInput}
                            onChangeText={(birth) => this.setState({ birth })}
                            value={this.state.birth}
                        />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>자격</Text>
                    <View style={styles.textInputContainer}>
                        <TouchableOpacity style={this.state.lawyer ? styles2.normalButton : styles.normalButton} onPress={()=>{ this.setState({ lawyer: false }) }}>
                            <Text style={styles.normalButtonText}>일반회원</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.lawyer ? styles.lawyerButton : styles2.lawyerButton} onPress={()=>{ this.setState({ lawyer: true }) }}>
                            <Text style={styles.lawyerButtonText}>변호사</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>전화번호</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder="010-XXXX-XXXX"
                            style={styles.textInputForId}
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}
                            maxLength={45}
                        />
                        <TouchableOpacity style={styles.idconfirmButton}>
                            <Text style={styles.idconfirmButtonText}>인증</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formText}>인증번호</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder="인증번호를 입력해주세요."
                            style={styles.textInputForId}
                            onChangeText={(confirmPhone) => this.setState({ confirmPhone })}
                            value={this.state.confirmPhone}
                        />
                        <TouchableOpacity style={styles.idconfirmButton}>
                            <Text style={styles.idconfirmButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.enrollButtonContainer}>
                    <TouchableOpacity style={styles.enrollButton}>
                        <Text style={styles.enrollButtonText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <View style={{ flex: 1 }} />
                <SafeAreaView style={styles.innerContainer}>
                <Text style={styles.logoTitle}>LAWBOT</Text>
                <Image
                    style={styles.logoImage}
                    source={require("../assets/logo.png")}
                />
                <TextInput
                    placeholder="아이디"
                    style={styles.textInput}
                    onChangeText={(id) => this.setState({ id })}
                    value={this.state.id}
                />
                <TextInput
                    placeholder="비밀번호"
                    style={styles.textInput}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                />
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => this.loginEvent()}
                >
                    <Text style={styles.loginButtonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.enrollButton}>
                    <Text style={styles.enrollButtonText}>회원가입</Text>
                </TouchableOpacity>
                </SafeAreaView>
                <View style={{ flex: 1 }} />
            </KeyboardAvoidingView> */}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  enrollButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "77%",
  },
  enrollButtonContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  enrollButtonText: {
    color: "#fff",
    fontFamily: "NotoSansBold",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
    marginLeft: 25,
  },
  formText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: "NotoSansBold",
    paddingLeft: 20,
    width: "20%",
  },
  guideText: {
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "NotoSansBold",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  idconfirmButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    width: "25%",
    marginLeft: 15,
  },
  idconfirmButtonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "NotoSansBold",
  },
  lawyerButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    width: "38%",
    marginLeft: 15,
  },
  lawyerButtonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "NotoSansBold",
  },
  logoTitle: {
    fontSize: 20,
    fontFamily: "SCDream8",
  },
  normalButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    width: "38%",
  },
  normalButtonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "NotoSansBold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    height: 40,
    width: "80%",
    textAlign: "center",
  },
  textInputContainer: {
    flexDirection: "row",
    width: "80%",
    height: 40,
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  textInputForId: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    height: 40,
    width: "50%",
    textAlign: "center",
  },
});

const styles2 = StyleSheet.create({
    lawyerButton: {
        alignItems: "center",
        backgroundColor: "#ABA6A6",
        padding: 10,
        borderRadius: 5,
        width: "38%",
        marginLeft: 15,
    },
    normalButton: {
        alignItems: "center",
        backgroundColor: "#ABA6A6",
        padding: 10,
        borderRadius: 5,
        width: "38%",
    },
});