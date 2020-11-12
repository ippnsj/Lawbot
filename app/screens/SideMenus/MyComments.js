import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Image,
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../../context.js';
import colors from "../../config/colors";
import Header from "../Header.js";

export default class MyComments extends Component{
    state = {
        fontsLoaded: false,
        listExist: false,
        postList:{},
        token: '',
        postCategory:[],
        refreshing: false,
    }

    async _loadFonts() {
        await Font.loadAsync({
            SCDream8: require("../../assets/fonts/SCDream8.otf"),
            KPWDBold: require("../../assets/fonts/KPWDBold.ttf"),
            KPWDMedium: require("../../assets/fonts/KPWDMedium.ttf"),
            KPWDLight: require("../../assets/fonts/KPWDLight.ttf")
        });
        this.setState({ fontsLoaded: true });
    }
    isFocused = () => {
        this.read();
    }

    componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
        const ctx = this.context;
        fetch(`${ctx.API_URL}/user/posts/reply`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{ 
            let postListInst = [];
            let exist = false;
            let postCategoryList = [];       
            for (let i=0; i<res.length; i++){
                postListInst.push(res[i]);
                if (res[i].boardCategory === 1){
                    postCategoryList.push("Lawbot 후기 게시판");
                }else if (res[i].boardCategory === 2){
                    postCategoryList.push("재판 후기 게시판");
                }else if (res[i].boardCategory === 3){
                    postCategoryList.push("자유 게시판");
                }
            }
            if (res.length != 0){
                exist = true;
            }
            this.setState({postList: postListInst, listExist: exist, token: ctx.token, postCategory: postCategoryList});
        })
        .catch((error) => {
            console.error(error);
        });
    }
    componentDidUpdate(){
        const ctx = this.context;
        if((this.state.token != ctx.token && ctx.token != '')) {
            fetch(`${ctx.API_URL}/user/posts/reply`, {
                method: "GET",
                headers: {
                    "token": ctx.token
                },
            })
            .then((res) => {
                return res.json();
            })
            .then((res) =>{   
                let postListInst = [];
                let exist = false;
                let postCategoryList = [];         
                for (let i=0; i<res.length; i++){
                    postListInst.push(res[i]);
                    if (res[i].boardCategory === 1){
                        postCategoryList.push("Lawbot 후기 게시판");
                    }else if (res[i].boardCategory === 2){
                        postCategoryList.push("재판 후기 게시판");
                    }else if (res[i].boardCategory === 3){
                        postCategoryList.push("자유 게시판");
                    }
                }
                if (res.length != 0){
                    exist = true;
                }
                this.setState({postList: postListInst, listExist: exist, token: ctx.token, postCategory: postCategoryList});
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }
    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }
    _onRefresh = ()=>{
        this.setState({refreshing: true}, ()=>this.read());
    }
    read(){
        const ctx = this.context;
        fetch(`${ctx.API_URL}/user/posts/reply`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{   
            let postListInst = [];
            let exist = false;
            let postCategoryList = [];         
            for (let i=0; i<res.length; i++){
                postListInst.push(res[i]);
                if (res[i].boardCategory === 1){
                    postCategoryList.push("Lawbot 후기 게시판");
                }else if (res[i].boardCategory === 2){
                    postCategoryList.push("재판 후기 게시판");
                }else if (res[i].boardCategory === 3){
                    postCategoryList.push("자유 게시판");
                }
            }
            if (res.length != 0){
                exist = true;
            }
            if (this.state.refreshing){
                this.setState({postList: postListInst, listExist: exist, token: ctx.token, postCategory: postCategoryList, refreshing: false});
            }else{
                this.setState({postList: postListInst, listExist: exist, token: ctx.token, postCategory: postCategoryList});
            } 
        })
        .catch((error) => {
            console.error(error);
        });
    }
    goToDetailPage(post){
        this.props.navigation.navigate('BoardDetail', {post: post});
    }
    render(){
        if (!this.state.fontsLoaded) {
            return <View />;
        }
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <View style = {styles.body}>
                    <View style={styles.titleContainer}>
                        <Text style = {styles.title}>댓글 단 글</Text>
                        <View style={styles.underbar} />
                    </View>
                    {!this.state.listExist ? <ScrollView style={styles.nolist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }><Text style={styles.nolistText}>내가 쓴 댓글이 없습니다...</Text></ScrollView> :
                        <ScrollView style={styles.yeslist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }>
                            {this.state.postList.map((post, idx)=>{
                                return (
                                    <TouchableOpacity key={idx} style = {styles.caseContainer} onPress={() => this.goToDetailPage(post)}>
                                        <Text style= {styles.boardCategory}>{this.state.postCategory[idx]}</Text>
                                        <Text style= {styles.caseID}>{post.title}</Text>
                                        {post.content.length>20 ?<Text style= {styles.caseName}>{post.content.slice(0, 20)+"..."}</Text>
                                        :<Text style= {styles.caseName}>{post.content.slice(0, 20)}</Text>}
                                        <View style= {styles.commentContainer}>
                                            <Text style= {styles.date}>{post.writtenDate.slice(0, 10)+" "+post.writtenDate.slice(11,16)}</Text>
                                            {/* <Image source={require("../../assets/speech-bubble.png")} style={styles.lawyerImage} />
                                            <Text style= {styles.commentCount}>{(post.Replies.length)}</Text> */}
                                            <Image source={require("../../assets/view.png")} style={styles.lawyerImage} />
                                            <Text style= {styles.commentCount}>{(post.views)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    }
                </View>
            </View>
        );
    }
}
MyComments.contextType = MyContext;
const styles = StyleSheet.create({
    body: {
      flex: 12,
      overflow: "scroll",
      backgroundColor: "#fff",
    },
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
    },
    title:{
        fontFamily: "KPWDBold",
        fontSize: 18,
        marginLeft: "5%",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: "3%",
        paddingTop : "2%",
        marginTop: "5%",
    },
    underbar: {
        position: "absolute",
        width: "80%",
        height: 3,
        backgroundColor: "#E7E7E7",
        marginTop : "0%",
        marginLeft: "10%",
    },
    nolist: {
        alignSelf: "center",
        width: "100%", 
        height: "100%",
    },
    nolistText:{
        fontSize:20,
        alignSelf : "center",
        marginTop: "60%"
    },
    yeslist: {
        paddingTop: 10,
        width: "100%", 
        height: "100%",
        alignSelf: "center",
    },
    caseContainer: {
        borderTopColor:"#DDDDDD",
        borderTopWidth: 1,
        padding: 20,
    },
    caseID: {
        fontFamily: "KPWDMedium",
        color: "#000000",
        fontSize: 16,
    },
    caseName:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#8D8D8D",
    },
    lawyerImage: {
        width: 15,
        height: 15,
        margin: 5,
        marginLeft: "2%",
        alignSelf: "center",
        marginBottom:"1%",
        marginTop:"0.5%",
    },
    confirm:{
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 5,
        width: "15%",
        // marginVertical: "2%",
        alignItems: "center",
        paddingVertical: "0.5%",
        marginRight : "4%",
        marginTop: "4%",
        marginBottom: "1%",
        marginLeft:"80%"
    },
    submitText: {
        fontSize: 15,
        color: colors.primary,
        fontFamily: "KPWDBold",
    },
    commentContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
    },
    commentCount:{
        fontFamily: "KPWDLight",
        fontSize: 13,
        color: "#000000",
    },
    date:{
        fontFamily: "KPWDLight",
        fontSize: 13,
        color: "#000000",
    },
    boardCategory:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: colors.primary,
    },
});