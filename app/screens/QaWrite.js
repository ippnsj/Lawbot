import React, {Component}from 'react';
import {
    Text,
    View,
    Modal,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    
    TouchableOpacity,
    Alert
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import { MyContext } from '../../context.js';

import colors from "../config/colors";
import Header from "./Header.js";
import { ScrollView } from 'react-native-gesture-handler';

export default class QaWrite extends Component {
    state = {
        fontsLoaded: false,
        title: "",
        content:"",
        field: [],
        categoryVisible: false,
        categories: {}
    };
  
    isFocused = () => {
        this.setState({ title: "", content: "" });

        this.fieldReset();
    }

    fieldReset() {
      const field = [];
      for(var i = 0; i < this.props.route.params.categories.length; i++) {
        field[i] = -1;
      }
      this.setState({ field });
    }

    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf"),

      });
      this.setState({ fontsLoaded: true });
    }
  
    componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);

        this.setState({categories: this.props.route.params.categories});
        
        this.fieldReset();
    }

    componentWillUnmount() {
      this.props.navigation.removeListener('focus', this.isFocused);
    }

    categorySelect(idx) {
      const { field } = this.state; 
      field[idx] = -field[idx];
      this.setState({ field });
    }

    overlayClose() {
        this.setState({categoryVisible: false});
    }

    async createArticle() {
      const ctx = this.context;
      let body = {
        question: {},
        category: [],
      };
      body.question.title = this.state.title;
      body.question.content = this.state.content;
      for(var i = 0; i < this.state.field.length; i++) {
        if(this.state.field[i] === 1) {
          body.category.push(this.state.categories[i].ID);
        }
      }

      await fetch(`${ctx.API_URL}/qna/question`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "token": ctx.token
        },
        body: JSON.stringify(body),
      }).then((result) => {
      });

      this.props.navigation.navigate("QaUser");
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
            <View style={styles.container}>
            <Header {...this.props}/>

            <KeyboardAvoidingView style={styles.body}>
                <View style={{margin: "5%"}}>
                    <View style={{margin: "3%", flex: 2}}>
                        <TextInput 
                            placeholder="제목을 입력하세요."
                            style={styles.title}
                            value={this.state.title}
                            onChangeText={(title)=>this.setState({title})}
                            maxLength={45}
                        />
                    </View>
                    <View style={{height: 0.5, backgroundColor: "lightgray"}}></View>

                    <View style={{margin: "3%", flex: 3, height: 400}}>
                        <TextInput 
                            placeholder="무엇이 궁금한가요?"
                            style={styles.content}
                            value={this.state.content}
                            onChangeText={(content)=>this.setState({content})}
                        />
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: "gray", marginHorizontal: "-10%"}}></View>
                <View>
                    <TouchableOpacity onPress={() => this.setState({categoryVisible: true})}  >
                        <View style={{flexDirection: "row" }} >
                            <Image style={styles.icon} source={require("../assets/categoryIcon.png")} />
                            <Text style={styles.category}>분야설정</Text>
                        </View>
                    </TouchableOpacity>

                    {/* <View style={{height: 0.5, backgroundColor: "lightgray"}}></View> */}
                    
                    {/* <TouchableOpacity >
                        <View style={{flexDirection: "row"}}>
                            <Image style={styles.icon} source={require("../assets/attachIcon.png")} />
                            <Text style={styles.attach}>첨부파일 등록</Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
                    <TouchableOpacity style={styles.Button}  onPress={() => this.createArticle()}>
                            <Text style={styles.ButtonText}>질문 등록하기</Text>
                        </TouchableOpacity>
            </KeyboardAvoidingView>

            <Modal visible={this.state.categoryVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <View style={styles.fieldSelectHeader}>
                            <Text style={styles.fieldModalText}>분야설정</Text>
                        </View>
                        <ScrollView>
                            {this.state.categories.map((cat, idx)=>{
                                return(
                                    <TouchableOpacity onPress={()=>this.categorySelect(idx)} key={idx}>
                                        <Text style={ this.state.field[idx] === 1 ? styles.categoryText_selected : styles.categoryText_unselect
                                        }>{cat.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    
                    </View>
                    <TouchableOpacity style={styles.fieldSelectCancel} onPress={() => this.overlayClose()}>
                        <Text style={styles.fieldSelectCancelText}>확인</Text>
                    </TouchableOpacity>
                </View>
        </Modal>
         
    </View>
          )
    }
}
QaWrite.contextType = MyContext;

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

    title: {
        fontSize: 18,
        fontFamily: "KPWDLight",
        color: "black"
    },
    content: {
        fontSize: 20,
        fontFamily: "KPWDLight",
        color: "black"
    },
    category: {
        fontSize: 16,
        fontFamily: "KPWDMedium",
        color: "#505050",
        margin: "3%"
    },
    attach: {
        fontSize: 16,
        fontFamily: "KPWDMedium",
        color: "#505050",
        margin: "3%"
    },
    icon: {
        width: 20,
        height: 20,
        alignSelf: "center",
    },
     Button: {
        marginTop: "5%",
        borderColor: colors.primary,
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 60,
        alignSelf: "center"
    },
     ButtonText: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    },



  fieldSelectModal: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: "center",
  },
  fieldModalText: {
    fontSize: 20,
    fontFamily: "KPWDBold",
  },
  fieldText: {
    fontSize: 15,
    fontFamily: "KPWDBold",
    marginTop: 8
  },
  fileUpload: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    margin: "4%",
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  fileUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileUploadGuide: {
    fontSize: 12,
    fontFamily: "KPWDBold",
    color: "#959595",
    margin: "4%",
  },
  fileUploadText: {
    color: "#fff",
    fontSize: 10,
  },
  field: {
    fontFamily: "KPWDBold",
    fontSize: 18,
    marginLeft: "5%",
  },
  fieldButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E7E7E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  fieldButtonContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  fieldContatiner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: "3%",
  },
  fieldExcButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: "25%",
    height: "45%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary
  },
  fieldExcText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold"
  },
  fieldRow: {
    flex: 5,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  fieldImage: {
    width: "60%",
    height: "60%"
  },
  fieldSelectCancel: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "6%",
    alignSelf: "center"
  },
  fieldSelectCancelText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold",
  },
  fieldSelectContainer: {
    height: "35%",
    width: "80%",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: "2%",
    paddingVertical: "3%"
  },

  categoryText_unselect: {
    marginVertical: 5,
    color: "#939393",
    fontSize: 18,
    fontFamily: "KPWDMedium"
  },

  categoryText_selected: {
    marginVertical: 5,
    color: colors.primary,
    fontSize: 18,
    fontFamily: "KPWDMedium"
  },
})