import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert
  } from "react-native";
import {Picker} from '@react-native-community/picker';
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../context.js';

import colors from "../config/colors";


export default class Home extends Component {
    state = {
        fontsLoaded: false,
        listExist: false,
        qna: "",
        qnaKind: "키워드"
    };
  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf")
      });
      this.setState({ fontsLoaded: true });
    }
  
    componentDidMount() {
        this._loadFonts();
        this.props.route.params.list.length <= 0 ? this.setState({listExist: false}) : this.setState({listExist: true});
    }

    searchQNA() {
        if(this.state.qna == "") {
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
        }else {
            const ctx = this.context;
            var body = {};
            body.kind = this.state.qnaKind;
            body.content = this.state.qna;

            fetch(`${ctx.API_URL}/qna/question/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": ctx.token
                },
                body: JSON.stringify(body),
            })
            .then((res) => {
                return res.json();
            }).then((res) => {
                console.log(res);
            })
        }
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
              <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={require("../assets/menu.png")} style={styles.menu} />
                        <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate("Home")}} >LAWBOT</Text>
                        <Image
                            source={require("../assets/profile.png")}
                            style={styles.profile}
                        />
                    </View>
                  {/* QA bar */}
                  <KeyboardAvoidingView style={styles.body}>
                    <Text style={styles.title}>법률 QNA</Text>
                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Picker
                                selectedValue={this.state.qnaKind}
                                style={{ width: 110 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({qnaKind: itemValue})}
                            >
                                <Picker.Item label="키워드" value="키워드" />
                                <Picker.Item label="제목" value="제목" />
                                <Picker.Item label="내용" value="내용" />
                            </Picker>
                            <TextInput 
                                placeholder="법률 Q&A를 검색해주세요"
                                style={styles.textInput}
                                value={this.state.qna}
                                onChangeText={(qna) => this.setState({ qna })}
                                onSubmitEditing={() => {this.searchQNA()}}
                                returnKeyType="search"
                            />
                            <TouchableOpacity onPress={() => {this.searchQNA()}}>
                                <Image source={require("../assets/search.png")} style={styles.search} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.underline}></View>
                    </View>
                    {!this.state.listExist ? <View style={styles.nolist}><Text>관련 QNA를 찾을 수 없습니다...</Text></View> :
                        <View style={styles.yeslist}>
                        {/* {questions.map((q, idx)=> {
                                                    return(
                                                        <View key={idx}>
                                                            <View style={styles.interestQ_content_question_field}>
                                                            {q.field.map((f, idx)=> {
                                                                return(
                                                                    <Text style={styles.interestQ_content_question_field_text} key={idx}>{f}</Text>
                                                                    )
                                                                })}
                                                            </View>
    
                                                            <Text style={styles.interestQ_content_question_title}>{q.title}</Text>
                                                            <Text style={styles.interestQ_content_question_content}>{q.content}</Text>
                                                            <TouchableOpacity  onPress={() => this.handleButtons(idx) }>
                                                                <Text style={styles.interestQ_content_question_answer}>답변하기</Text>
                                                            </TouchableOpacity>
                                                            
                                                        </View>
                                                    )
                                                })} */}
                        </View>
                    }
                  </KeyboardAvoidingView>
            </View>
          )
    };
}
Home.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%"
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
        minHeight: 50,
        backgroundColor: "#fff"
    },
    searchSection:{
        alignItems:"center"
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 50,
    },
    search : {
        width:30,
        height:30,
        marginBottom: 5
    },
    title:{
        fontFamily: "KPWDBold",
        fontSize: 18,
        marginLeft: "5%",
        marginTop: 20,
    },
    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "400",
        color: "#8D8D8D",
        width: 200,
    },
    underline : {
        width: 360,
        height: 5,
        backgroundColor: "#E7E7E7",
        marginLeft: 10,
        marginTop: -7
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
    yeslist: {

    }
});