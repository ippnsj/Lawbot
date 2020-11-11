import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
  Keyboard
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";

import colors from "../config/colors";
import { MyContext } from '../../context.js';
import Header from "./Header.js";

let errMessage = "";

export default class ProfileMod extends Component {
  state = {
    fontsLoaded: false,
    user: {},
    prevPassword: "",
    newPassword: "",
    passwordAgain: "",
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
      KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
      KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
      KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf"),
      NotoSansBold: require("../assets/fonts/NotoSans-Bold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  isFocused = () => {
    errMessage = "";
    this.setState({ user: this.props.route.params.user, prevPassword: "", newPassword: "", passwordAgain: "" });
  }

  async componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  }

  defaultPasswordCheck() {
    if(this.state.prevPassword === "") {
        errMessage = "기존 비밀번호를 입력해주세요.";
        return false;
    }else {
        return true;
    }
  }

  checkPW(){
    let regEx = /^[A-Za-z0-9_-~!@#$%&*()-_+={}`[\];'"<,>\.?\/|]*$/gm;
    let isInRange = (this.state.newPassword.length >= 8) && (this.state.newPassword.length <= 16);
    return regEx.test(this.state.newPassword) && isInRange;
  }

  newPasswordCheck() {
    if(this.state.newPassword === "") {
        errMessage = "새 비밀번호를 입력해주세요.";
        return false;
    }else if(!this.checkPW()) {
        errMessage = "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
        return false;
    }else if(this.state.passwordAgain === "") {
        errMessage = "새 비밀번호를 다시 입력해주세요.";
        return false;
    }else if(this.state.newPassword !== this.state.passwordAgain) {
        errMessage = "새 비밀번호가 일치하지 않습니다.";
        return false;
    }else {
        return true;
    }
  }

  modifyPassword() {
    Keyboard.dismiss();
    const defaultCheck = this.defaultPasswordCheck();

    if(!defaultCheck) {
        Alert.alert(
            "기존 비밀번호 확인",
            errMessage
        );
    }else {
        const newCheck = this.newPasswordCheck();

        if(!newCheck) {
            Alert.alert(
                "새 비밀번호 확인",
                errMessage
            );
        }else {
            const ctx = this.context;
            const body = {
                "prevPassword": "",
                "newPassword": []
            };

            body.prevPassword = this.state.prevPassword;
            body.newPassword[0] = this.state.newPassword;
            body.newPassword[1] = this.state.passwordAgain;

            fetch(`${ctx.API_URL}/user/profile/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": ctx.token
                },
                body: JSON.stringify(body)
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if(res.success) {
                    ToastAndroid.show("비밀번호 변경에 성공하였습니다!", ToastAndroid.SHORT);
        
                    this.props.navigation.goBack();
                }else {
                    Alert.alert(
                        "비밀번호 변경 실패",
                        res.msg
                    );
                }
            });
        }
    }
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <Header {...this.props}/>
        <KeyboardAvoidingView style={styles.profileModCont} behavior={Platform.OS === "ios" ? "padding" : null}>
            <Text style={styles.title}>비밀번호 변경</Text>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>아이디</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInputNotActive}
                        value={this.state.user.userID}
                        editable={false}
                    />
                </View>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>이름</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInputNotActive}
                        value={this.state.user.name}
                        editable={false}
                    />
                </View>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>생년월일</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInputNotActive}
                        value={this.state.user.birth}
                        editable={false}
                    />
                </View>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>기존 비밀번호</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder="기존 비밀번호를 입력해주세요."
                        style={styles.textInput}
                        onChangeText={(prevPassword) => {this.setState({ prevPassword }); }}
                        value={this.state.prevPassword}
                        maxLength={45}
                    />
                </View>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>새 비밀번호</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder="새 비밀번호를 입력해주세요."
                        style={styles.textInput}
                        onChangeText={(newPassword) => {this.setState({ newPassword }); }}
                        value={this.state.newPassword}
                        maxLength={45}
                    />
                </View>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>비밀번호 확인</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder="비밀번호를 다시 입력해주세요."
                        style={styles.textInput}
                        onChangeText={(passwordAgain) => {this.setState({ passwordAgain }); }}
                        value={this.state.passwordAgain}
                        maxLength={45}
                    />
                </View>
            </View>
            <View style={styles.buttonsCont}>
                <View style={styles.modButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress = {()=>{this.modifyPassword()}}>
                        <Text style={styles.buttonText}>수정</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cancelButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress = {()=>{ this.props.navigation.goBack() }}>
                        <Text style={styles.buttonText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    </View>
    );
  }
}
ProfileMod.contextType = MyContext;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 1 : Constants.statusBarHeight,
      backgroundColor: "#fff",
    },

    bar: {
        width: "100%",
        height: 8,
        backgroundColor: "#ECECEC"
    },

    userContainer: {
        height: "17%",
        position: "relative",
    },
    userUpper: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    leftArrowCont: {
        marginTop: 20,
        marginLeft: 20,
    },
    leftArrowImage: {
        width: 30,
        height: 30,
    },
    userNameCont: {
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
        left : "35%",
    },
    userName: {
        color: "#fff",
        fontFamily: "KPWDBold",
        alignSelf: "flex-end",
        fontSize: 28,
    },
    userNameWel: {
        fontFamily: "KPWDBold",
        fontSize: 15,
        alignSelf: "center",
        marginLeft: 10,
        color: "#fff"
    },

    userImageCont: {
        position: "absolute",
        top: "53%",
        left: "5%",
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center"
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    profileModCont: {
        flex: 1,
        alignItems: "center",
        overflow: "scroll",
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    title: {
        alignSelf: "center",
        fontSize: 18,
        fontFamily: "NotoSansBold",
        marginBottom: 15,
    },

    buttonsCont: {
        flexDirection: "row",
    },
    button: {
        alignItems: "center",
        backgroundColor: colors.primary,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    modButtonContainer: {
        alignItems: "center",
        marginTop: 15,
        marginRight: 10,
    },
    cancelButtonContainer: {
        alignItems: "center",
        marginTop: 15,
        marginLeft: 10,
    },
    buttonText: {
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
        textAlign: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 5,
        height: 40,
        width: "80%",
        textAlign: "center",
    },
    textInputNotActive: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 5,
        height: 40,
        width: "80%",
        textAlign: "center",
        backgroundColor: "#f2f2f2",
        color: "#8f8f8f"
    },
    textInputContainer: {
        flexDirection: "row",
        width: "80%",
        height: 40,
        justifyContent: "flex-start",
        marginLeft: 10,
    },
});
