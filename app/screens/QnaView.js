import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Alert
  } from "react-native";
import {Picker} from '@react-native-community/picker';
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import { MyContext } from '../../context.js';

import colors from "../config/colors";
import Header from "./Header.js";

export default class QnaView extends Component {
    state = {
        fontsLoaded: false,
        categories: [],
        post: {},
        date: "",
        user: {},
        token: "",
        answers: {},
        favSelected: false,
    };
  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
          KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
          KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf")
      });
      this.setState({ fontsLoaded: true });
    }

    isFocused = () => {
        // if(this.props.route.params.post.ID !== this.state.post.ID) {
        this.setState({post: this.props.route.params.post, categories: this.props.route.params.categories, date: this.props.route.params.date});
        this.setState({ answers: {} });
        this.getAnswers();
        // }
    }

    async getAnswers() {
        const ctx = this.context;

        await fetch(`${ctx.API_URL}/qna/answer/${this.props.route.params.post.ID}`, {
            method: "GET",
            headers: {
                "token": ctx.token
            }
        }).then((res) => {
            return res.json();
        }).then((res) => {
            this.setState({ answers: res });
        });
    }
  
    async componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
        this.setState({post: this.props.route.params.post, categories: this.props.route.params.categories, date: this.props.route.params.date});

        const ctx = this.context;

        await fetch(`${ctx.API_URL}/user`, {
            method: "GET",
            headers: {
                'token': ctx.token,
            },
          }).then((result) => {
            return result.json();
          }).then((result) => {
            this.setState({ token: ctx.token, user: result });
          });
    }

    async componentDidUpdate() {
        const ctx = this.context;

        if(ctx.token != '') {
            if(this.state.token != ctx.token) {
                await fetch(`${ctx.API_URL}/user`, {
                    method: "GET",
                    headers: {
                        'token': ctx.token,
                    },
                }).then((result) => {
                    return result.json();
                }).then((result) => {
                    this.setState({ token: ctx.token, user: result });
                });
            }
        }
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }

    favSelected() {

    }

    timeForToday(value) {
        const today = new Date();
        const timeValue = new Date(value);

        const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
        if (betweenTime < 1) return '방금전';
        if (betweenTime < 60) {
            return `${betweenTime}분전`;
        }

        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간전`;
        }

        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay}일전`;
        }

        return `${Math.floor(betweenTimeDay / 365)}년전`;
    }

    render() {
            if (!this.state.fontsLoaded) {
                return <View />;
              }
              return (
                  <View style={styles.container}>
                        <Header {...this.props}/>              
               
                    {/* body */}
                    <ScrollView >
                        <View style={styles.body}>

                            <View style={styles.question}>
                                <View style={styles.question_field}>
                                    {this.state.post.tags.map((tag, idx)=> {
                                        return(
                                            <Text style={styles.question_field_text} key={idx}>{this.state.categories[tag.Category_ID].name}</Text>
                                        )
                                    })}
                                </View>

                                <View >
                                    <Text style={styles.question_title}>Q. {this.state.post.title}</Text>
                                    <Text style={styles.question_content}>{this.state.post.content}</Text>
                                    {this.state.user.lawyer === 1 ? 
                                        <TouchableOpacity style={styles.answerButton} onPress={() => this.props.navigation.navigate("QaAnswer", { post: this.state.post })}>
                                            <Text style={styles.answerButtonText}>A. 답변하기</Text>
                                        </TouchableOpacity> :
                                        null
                                    }
                                    <View style={styles.question_footer}>
                                        <Text style={styles.question_footer_date}>{this.state.date}</Text>
                                        <Text style={styles.boardContentBullet}>{'\u2B24'}</Text>
                                        <Text style={styles.question_footer_views} >조회수{' ' + this.state.post.views}</Text>
                                        <TouchableOpacity style={styles.favCont} onPress={() => this.setState({ favSelected: !this.state.favSelected })}>
                                            {this.state.favSelected ? <Image source={require("../assets/star.png")}  style={styles.favStar} /> :
                                            <Image source={require("../assets/starEmpty.png")} style={styles.favStar} />}
                                            <Text style={styles.favText}>즐겨찾기</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>


                            <View style={styles.answers}>
                                <View style={{backgroundColor: 'black', marginHorizontal: "-6%", marginTop: '5%'}}>
                                <Text style={{color:"white", marginVertical: "3%", alignSelf:"center", fontSize: 16, fontFamily: "KPBLight"}}>변호사 답변 {this.state.answers.length !== undefined ? this.state.answers.length : 0 }개</Text>
                                </View>
                                {this.state.answers.length !== undefined ? this.state.answers.map((ans, idx)=>{
                                    return(
                                        <View style={styles.answer} key={idx}>
                                            <View style={styles.answer_lawyer}>
                                                <Image style={styles.answer_lawyer_pic} source={{ uri: ans.Lawyer.User.photo }} />
                                                <View style={{justifyContent: "center"}}>
                                                    <Text style={styles.answer_lawyer_name}>{ans.Lawyer.User.name}</Text>
                                                    <Text style={styles.answer_lawyer_team}>{ans.Lawyer.companyName}</Text>
                                                </View>

                                                
                                            </View>
                                            <Text style={styles.answer_content}>{ans.content}</Text>
                                            <View style={styles.answer_footer}>
                                                <Text style={styles.answer_footer_date}>{this.timeForToday(ans.writtenDate)}</Text>
                                            </View>
                                        </View>
                                    ) 
                                }): null }

                            </View>
                        
                                
                        </View>
                        {/* body end */}
                        
                    </ScrollView>

                        
                </View>
              )
    }
}
QnaView.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%",
        // backgroundColor: "#c0c0c0"
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 36,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },

    button: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 1,
    }, 
    writebuttonimg: {
        width: 100,
        height: 100,
    },

    question: {
        marginHorizontal: "5%"
    },


    question_field: {
        flexDirection: "row",
        marginTop: "5%"
    },

    question_field_text: {
        color: "lightgray",
        marginRight: "5%",
        fontSize: 12,
        fontFamily: "KPWDBold"
    },

    question_title: {
        fontSize: 20,
        fontFamily: "KPBBold",
        marginTop: "5%",
        lineHeight: 30
    },

    question_content: {
        fontSize: 15,
        fontFamily: "KPWDLight",
        color: "#1d1d1d",
        marginTop: "5%",
        margin: "5%"
    },

    question_footer : {
        flexDirection: "row",
        marginHorizontal: "5%"
    },
    question_footer_date: {
        marginRight: 10,
        color: "lightgray",
        fontFamily: "KPWDLight",
        fontSize: 12
    },
    question_footer_views: {
        marginRight: 10,
        color: "lightgray",
        fontFamily: "KPWDLight",
        fontSize: 12
    },

    boardContentBullet: {
        fontSize: 4,
        alignSelf:"center",
        marginRight: 10,
        color: "lightgray"
    },
    

    answer: {
        padding: "5%",
        borderWidth: 0.5,
        borderColor: "lightgray",
        marginVertical: "5%"
    },

    answer_lawyer: {
        flexDirection: "row",
        marginRight: 15,
        marginBottom: "5%",
       
    },
    answer_lawyer_pic: {
        borderRadius: 100,
        width: 40,
        height: 40,
        marginRight: 10
    },
    answer_lawyer_name : {
        fontSize: 14,
        fontFamily: "KPWDMedium"
    },
    answer_lawyer_team : {
        fontSize: 12,
        fontFamily: 'KPBLight',
        color: "lightgray"
    },


    
    answer_content: {
        fontSize: 13,
        color: "#1d1d1d",
        marginTop: "5%",
        margin: "5%",
        fontFamily: "KPWDMedium"
    },

    answer_footer : {
        flexDirection: "row",
        marginHorizontal: "5%"
    },
    answer_footer_date: {
        marginRight: 10,
        color: "lightgray"
    },
    answer_footer_views: {
        marginRight: 10,
        color: "lightgray"
    },

    boardContentBullet: {
        fontSize: 4,
        alignSelf:"center",
        marginRight: 10,
        color: "lightgray"
    },

    answerButton: {
        backgroundColor: colors.primary,
        alignSelf: "center",
        paddingVertical: 15,
        paddingHorizontal: 35,
        marginBottom: 25,
    },
    answerButtonText: {
        color: "#fff",
        fontFamily: "KPBBold",
        fontSize: 15
    },

    favCont: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        right: 0,
    },
    favStar: {
        width: 12,
        height: 12,
    },
    favText: {
        fontFamily: "KPWDLight",
        fontSize: 12,
        marginLeft: 8,
    }
})
