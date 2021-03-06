import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from "../../context.js";

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
    idValid : false,
    pwValid : false,
    nameValid : false,
    birthValid : false,
    phoneValid: false,
    phoneValidDone: false,
    idRedundantDone : false,
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

  async confirmID() {
    const ctx = this.context;

    await this.checkID();
    if (this.state.idValid){
      let body = {};
      body.userID = this.state.id;
      
      await fetch(`${ctx.API_URL}/register/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": ctx.token,
        },
        body: JSON.stringify(body),
      })
      .then((response) => {
        return response.json();
      }).then((json) => {
        if (json.success === true) {
          Keyboard.dismiss();
          this.setState({idRedundantDone: true});
          Alert.alert(
              "아이디 중복확인",
              "사용가능한 아이디입니다."
          );
          
        } else {
          this.setState({idRedundantDone: false});
          Alert.alert(
            "아이디 중복확인",
            "이미 존재하는 아이디입니다."
          );
          
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      Alert.alert(
          "아이디 확인",
          "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다."
      );
      this.setState({idRedundantDone: false});
    }
  }
  confirmEnroll(){
    // this.checkID();
    this.checkPW();
    this.checkName();
    this.checkBirth();
    this.checkPhone();

    if (!this.state.idRedundantDone){
      Alert.alert(
          "아이디 중복 확인",
          "아이디 중복 확인이 필요합니다."
      );
    }else if (!this.state.pwValid){
      Alert.alert(
        "패스워드 확인", 
        "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요."
      );
    }else if (!this.state.nameValid){
      Alert.alert(
        "이름 확인", 
        "한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)"
      );
    }else if (!this.state.birthValid){
      Alert.alert(
        "생년월일 확인", 
        "19970812와 같은 형식인지 확인하세요. (공백 사용 불가)"
      );
    }else if (!this.state.phoneValid){
      Alert.alert(
        "전화번호 확인", 
        "010-0000-0000와 같은 형식인지 확인하세요. (공백 사용 불가)"
      );
    }else if (!this.state.phoneValidDone){
      Alert.alert(
        "인증번호 확인", 
        "전화번호 인증을 해주세요."
      );
    }else{
      const ctx = this.context;
      var a = {};
      a.userID = this.state.id;
      a.userPW = this.state.password;
      a.name = this.state.name;
      a.birth = this.state.birth;
      a.phone = this.state.phone;
      a.Lawyer = this.state.lawyer;
      fetch(`${ctx.API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "token": ctx.token,
        },
        body: JSON.stringify(a),
      })
      .then((response) => {
        return response.json();
      }).then((json) => {
        if (json.success === true) {
          this.props.navigation.navigate('WelcomeScreen');
          ToastAndroid.show("회원가입이 성공적으로 완료되었습니다.", ToastAndroid.SHORT);
        } else {
          Alert.alert(
            "회원가입 실패",
            "다시 회원정보를 입력해주시길 바랍니다."
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }

  }
  checkID(){
    let regEx = /^[A-Za-z0-9_-]*$/gm;
    let idInRange = (this.state.id.length >= 5) && (this.state.id.length <= 20);
    let valid = regEx.test(this.state.id) && idInRange;
    this.setState({idValid:valid});
  }
  checkPW(){
    let regEx = /^[A-Za-z0-9_-~!@#$%&*()-_+={}`[\];'"<,>\.?\/|]*$/gm;
    let isInRange = (this.state.password.length >= 8) && (this.state.password.length <= 16);
    this.state.pwValid = regEx.test(this.state.password) && isInRange;
  }
  checkName(){
    let regEx = /^[가-힣a-zA-Z]+$/gmu;
    this.state.nameValid = regEx.test(this.state.name);
    let regExEng = /^[a-zA-Z]+$/gm;
    let regExKor = /^[가-힣]+$/gmu;
    if (regExEng.test(this.state.name)){
      this.state.nameValid = (this.state.name.length<= 9);
    }else if (regExKor.test(this.state.name)){
      this.state.nameValid = (this.state.name.length<= 5);
    }else{
      this.state.nameValid = false;
    }
  }
  checkBirth(){
    let regEx = /^[0-9]+$/gm;
    let lenCheck = this.state.birth.length == 8;
    this.state.birthValid = regEx.test(this.state.birth) && (lenCheck);
  }
  checkPhone(){
    let regEx = /^[0-9-]+$/gm;
    let lenCheck = this.state.phone.length == 13;
    this.state.phoneValid = regEx.test(this.state.phone) && lenCheck;
  }

  confirmThisPhone(){
    this.checkPhone();
    if(this.state.phoneValid) {
      const ctx = this.context;
      let body = {};
      body.phone = this.state.phone;

      fetch(`${ctx.API_URL}/register/phone-validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "token": ctx.token,
        },
        body: JSON.stringify(body),
      }).then((result) => {
        return result.json();
      }).then((result) => {
        if(result.success) {
          Alert.alert(
            "인증번호 발송완료", 
            "인증번호가 발송되었습니다."
          );
        }else if (result.msg === "이미 있는 휴대폰 번호입니다"){
          Alert.alert(
            "인증번호 발송실패", 
            "이미 등록된 전화번호 입니다. 다른 번호를 등록해주시기 바랍니다."
          );
        }else{
          Alert.alert(
            "인증실패", 
            "인증에 실패하였습니다. 다시 인증해주세요."
          );
        }
      });
    }else {
      Alert.alert(
        "전화번호 확인", 
        "010-0000-0000와 같은 형식인지 확인하세요. (공백 사용 불가)"
      );
    }
  }

  confirmPhoneValidateNum() {
    Keyboard.dismiss();
    const ctx = this.context;
    let body = {};
    body.phone = this.state.phone;
    body.validateNum = parseInt(this.state.confirmPhone);

    fetch(`${ctx.API_URL}/register/phone-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "token": ctx.token,
      },
      body: JSON.stringify(body),
    }).then((result) => {
      return result.json();
    }).then((result) => {
      if(result.success) {
        Alert.alert(
          "인증완료", 
          "인증에 성공하였습니다."
        );
        this.setState({ phoneValidDone: true });
      }else {
        Alert.alert(
          "인증실패", 
          "인증에 실패하였습니다. 다시 인증해주세요."
        );
      }
    });
  }
  handleID(event) {
    this.setState({id: event.target.value});
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
                            onChangeText = {(id) => {this.setState({id});}}
                            value = {this.state.id}
                            maxLength={45}
                            editable={!this.state.idRedundantDone}
                        />
                        <TouchableOpacity 
                        style = {!this.state.idRedundantDone ? styles.idconfirmButton : styles2.idconfirmButton}
                        onPress={() => this.confirmID()}
                        disabled={this.state.idRedundantDone} >
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
                            onChangeText={(password) => {this.setState({ password }); }}
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
                            onChangeText={(name) => {this.setState({ name }); }}
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
                            onChangeText={(birth) => {this.setState({ birth }); }}
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
                            onChangeText={(phone) => {this.setState({ phone }); }}
                            value={this.state.phone}
                            maxLength={45}
                            editable={!this.state.phoneValidDone}
                        />
                        <TouchableOpacity 
                            style={!this.state.phoneValidDone ? styles.idconfirmButton : styles2.idconfirmButton}
                            onPress = {()=> {this.confirmThisPhone();}}
                            disabled={this.state.phoneValidDone}
                        >
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
                            editable={!this.state.phoneValidDone}
                        />
                        <TouchableOpacity style={!this.state.phoneValidDone ? styles.idconfirmButton : styles2.idconfirmButton} onPress = {()=> {this.confirmPhoneValidateNum();}} disabled={this.state.phoneValidDone}>
                            <Text style={styles.idconfirmButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.enrollButtonContainer}>
                    <TouchableOpacity style={styles.enrollButton} onPress = {()=>this.confirmEnroll()}>
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
Enrollment.contextType = MyContext;

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
    idconfirmButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
      width: "25%",
      marginLeft: 15,
      opacity: 0.6
    },
});
