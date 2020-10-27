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
import { ScrollView } from 'react-native-gesture-handler';

const categories=[
    "자동차",  "산업재해",  "환경", "언론보도", "지식재산권", "의료", "건설", "국가", "기타", "가족/가정", "이혼", "폭행", "사기", "성범죄", "명예훼손", "모욕", "협박", "교통사고", "계약", "개인정보", "상속", "재산범죄", "매매", "노동", "채권추심", "회생/파산", "마약/대마", "소비자", "국방", "병역", "주거침입", "도급/용역", "건설/부동산", "위증", "무고죄", "아동/소년범죄", "임대차", "대여금", "온라인범죄"   
]


export default class QaWrite extends Component {
    state = {
        fontsLoaded: false,
        title: "",
        content:"",
        categoryVisible: false,
        field: []
    };
  
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
    }

    categorySelect(cat) {
        // console.log(cat)
        this.setState(prevState => ({
            field: [...prevState.field, cat]
        }));
        console.log(this.state.field)
    }

    overlayClose() {
        this.setState({categoryVisible: false});
    }

    createArticle() {
        var article={
            title: this.state.title,
            content: this.state.content,
            field: this.state.field,
        }
        this.props.navigation.navigate('QaUser', {article: article} )
        // console.log(article)
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

            <KeyboardAvoidingView style={styles.body}>
                <View style={{margin: "5%"}}>
                    <View style={{margin: "3%", flex: 2}}>
                        <TextInput 
                            placeholder="제목을 입력하세요."
                            style={styles.title}
                            value={this.state.title}
                            onChangeText={(title)=>this.setState({title})}
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

                    <View style={{height: 0.5, backgroundColor: "lightgray"}}></View>
                    
                    <TouchableOpacity >
                        <View style={{flexDirection: "row"}}>
                            <Image style={styles.icon} source={require("../assets/attachIcon.png")} />
                            <Text style={styles.attach}>첨부파일 등록</Text>
                        </View>
                    </TouchableOpacity>
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
                            {categories.map((cat)=>{
                                return(
                                    <TouchableOpacity onPress={()=>this.categorySelect(cat)} >
                                        <Text style={ this.state.field.indexOf(cat)>-1 ? styles.categoryText_selected : styles.categoryText_unselect
                                        }>{cat}</Text>
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
