import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert,
    ScrollView
  } from "react-native";
import {Picker} from '@react-native-community/picker';
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../context.js';

import colors from "../config/colors";


export default class QaList extends Component {
    state = {
        fontsLoaded: false,
        listExist: false,
        qna: "",
        qnaKind: "키워드",
        posts: {},
        userids: [],
        categories: {},
        writtenDate: [],
    };
  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf")
      });
      this.setState({ fontsLoaded: true });
    }
  
    async componentDidMount() {
        this._loadFonts();
        this.props.route.params.posts.length <= 0 ? this.setState({listExist: false}) : this.setState({listExist: true, posts: this.props.route.params.posts});
        const ctx = this.context;
        var userList = [];
        var date = [];

        this.setState({categories: this.props.route.params.categories});

        for(var i = 0; i < this.props.route.params.posts.length; i++) {
            date.push(this.timeForToday(this.props.route.params.posts[i].writtenDate));

            await fetch(`${ctx.API_URL}/user/name/${this.props.route.params.posts[i].User_ID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": ctx.token
                },
            }).then((res) => {
                return res.json();
            }).then((res) => {
                var id = res.userID.substring(0,4);
                
                for(var j = 4; j < res.userID.length; j++) {
                    id += "*";
                }
                userList.push(id);
            });
        }
        this.setState({writtenDate: date});
        this.setState({userids: userList});
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

    async searchQNA() {
        if(this.state.qna == "") {
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
        }else {
            const ctx = this.context;
            var body = {};
            body.kind = this.state.qnaKind;
            body.content = this.state.qna;

            await fetch(`${ctx.API_URL}/qna/question/search`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "token": ctx.token
                },
                body: JSON.stringify(body),
            })
            .then((res) => {
                return res.json();
            }).then((res) => {
                this.searchAgain(res.posts);
            })
        }
    }

    async searchAgain(posts) {
        posts.length <= 0 ? this.setState({listExist: false}) : this.setState({listExist: true, posts: posts});
        const ctx = this.context;
        var userList = [];
        var date = [];

        for(var i = 0; i < posts.length; i++) {
            date.push(this.timeForToday(posts[i].writtenDate));

            await fetch(`${ctx.API_URL}/user/name/${posts[i].User_ID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": ctx.token
                },
            }).then((res) => {
                return res.json();
            }).then((res) => {
                var id = res.userID.substring(0,4);
                
                for(var j = 4; j < res.userID.length; j++) {
                    id += "*";
                }
                userList.push(id);
            });
        }
        this.setState({writtenDate: date});
        this.setState({userids: userList});
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
                        <ScrollView style={styles.yeslist}>
                            {this.state.posts.map((post, idx) => {
                                return (
                                    <TouchableOpacity key={idx} style={styles.post} onPress={() => this.props.navigation.navigate("QaView", {post: post, categories: this.state.categories, date: this.state.writtenDate[idx]})}>
                                        <View style={styles.tagContainer}>
                                            {
                                                post.tags.map((tag, idx)=> {
                                                    return(
                                                        <Text style={styles.tag} key={idx}>{this.state.categories[tag.Category_ID].name}</Text>
                                                    )
                                                })
                                            }
                                        </View>
                                        <Text style={styles.postTitle}>{post.title}</Text>
                                        <Text style={styles.postContent} numberOfLines={4}>{post.content}</Text>
                                        <View style={styles.postInfo}>
                                            <Text style={styles.postDate}>{this.state.writtenDate[idx]}</Text>
                                            <Text style={styles.postUser}>{this.state.userids[idx]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })

                            }
                        </ScrollView>
                    }
                  </KeyboardAvoidingView>
                  <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('QaWrite')}  >                       
                        <Image style={styles.writebuttonimg} source={require("../assets/writeButton.png")} />
                  </TouchableOpacity>
            </View>
          )
    };
}
QaList.contextType = MyContext;

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
        backgroundColor: "#fff",
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
        marginLeft: 10,
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

    nolist: {
        marginTop: 250,
        justifyContent: "center",
        alignItems: "center"
    },
    yeslist: {
        paddingTop: 10,
    },
    post: {
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E7E7E7",
        paddingBottom: 10,
    },
    tagContainer: {
        flexDirection: "row",
    },
    tag: {
        marginRight: 10,
        fontSize: 12,
        fontFamily: "KPWDBold",
        color: "#B1B1B1"
    },
    postTitle: {
        fontSize: 15,
        fontFamily: "KPWDBold",
    },
    postContent: {
        fontSize: 12,
        fontFamily: "KPWDLight",
        color: "#737373",
        marginVertical: 3,
    },
    postInfo: {
        flexDirection: "row",
    },
    postDate: {
        fontSize: 10,
        fontFamily: "KPWDLight",
        color: "#C3C3C3"
    },
    postUser: {
        marginLeft: 10,
        fontSize: 10,
        fontFamily: "KPWDLight",
        color: "#C3C3C3"
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
});