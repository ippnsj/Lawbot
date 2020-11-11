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
import { withNavigation } from 'react-navigation';
import { color } from 'react-native-reanimated';

export default class FavPosts extends Component{
    state = {
        fontsLoaded: false,
        listExist: false,
        postList: [],
        postCategoryList:[],
        token: '',
        favCheck:[],
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
        this.setState({token: ctx.token});

        fetch(`${ctx.API_URL}/user/favpost`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            let postList = [];
            let postCategoryList = [];
            let favCheckList = [];
            for (let i=0; i<res.length; i++){
                postList.push(res[i]);
                favCheckList.push(true);
                if (res[i].Post.boardCategory === 1){
                    postCategoryList.push("Lawbot 후기 게시판");
                }else if (res[i].Post.boardCategory === 2){
                    postCategoryList.push("재판 후기 게시판");
                }else if (res[i].Post.boardCategory === 3){
                    postCategoryList.push("자유 게시판");
                }        
            }
            let exist = false;
            if (res.length!= 0){    
                exist = true;
            }
            this.setState({listExist: exist, postList:postList, postCategoryList:postCategoryList,favCheck:favCheckList});
        })
        .catch((error) => {
            console.error(error);
        });
    }
    componentDidUpdate(){
        const ctx = this.context;
        if(this.state.token != ctx.token && ctx.token != ''){
            fetch(`${ctx.API_URL}/user/favpost`, {
                method: "GET",
                headers: {
                    "token": ctx.token
                },
            })
            .then((res) => {
                return res.json();
            })
            .then((res) =>{
                let postList = [];
                let postCategoryList = [];
                let favCheckList = [];
                for (let i=0; i<res.length; i++){
                    postList.push(res[i]);
                    favCheckList.push(true);
                    if (res[i].Post.boardCategory === 1){
                        postCategoryList.push("Lawbot 후기 게시판");
                    }else if (res[i].Post.boardCategory === 2){
                        postCategoryList.push("재판 후기 게시판");
                    }else if (res[i].Post.boardCategory === 3){
                        postCategoryList.push("자유 게시판");
                    }        
                }
                let exist = false;
                if (res.length!= 0){    
                    exist = true;
                }
                this.setState({token: ctx.token,listExist: exist, postList:postList, postCategoryList:postCategoryList,favCheck:favCheckList});
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }
    changeFav(idx){
        let favCheckList = [];
        for (let j=0; j<this.state.favCheck.length; j++){
            if (j === idx){
                const ctx = this.context;
                if (this.state.favCheck[j]){
                    let a = {};
                    a.Board_ID = this.state.postList[j].Board_ID;
                    fetch(`${ctx.API_URL}/user/favpost`,{
                        method: "DELETE",
                        headers: {
                            "token": ctx.token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(a),
                    })
                    .then((res)=>{
                        return res.json();
                    })
                    .then((json)=>{
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }else{
                    let a = {};
                    a.Board_ID = this.state.postList[j].Board_ID;
                    fetch(`${ctx.API_URL}/user/favpost`,{
                        method: "POST",
                        headers: {
                            "token": ctx.token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(a),
                    })
                    .then((res)=>{
                        return res.json();
                    })
                    .then((json)=>{
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }
                this.state.favCheck[j] = !this.state.favCheck[j];
            }
            favCheckList.push(this.state.favCheck[j]);
        }
        this.setState({favCheck:favCheckList});
    }
    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }
    _onRefresh = ()=>{
        this.setState({refreshing: true}, ()=>this.read());
    }
    read(){
        const ctx = this.context;
        fetch(`${ctx.API_URL}/user/favpost`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            let postList = [];
            let postCategoryList = [];
            let favCheckList = [];
            for (let i=0; i<res.length; i++){
                postList.push(res[i]);
                favCheckList.push(true);
                if (res[i].Post.boardCategory === 1){
                    postCategoryList.push("Lawbot 후기 게시판");
                }else if (res[i].Post.boardCategory === 2){
                    postCategoryList.push("재판 후기 게시판");
                }else if (res[i].Post.boardCategory === 3){
                    postCategoryList.push("자유 게시판");
                }        
            }
            let exist = false;
            if (res.length!= 0){    
                exist = true;
            }
            if (this.state.refreshing){
                this.setState({token: ctx.token,listExist: exist, postList:postList, postCategoryList:postCategoryList,favCheck:favCheckList, refreshing:false});
            }else{
                this.setState({token: ctx.token,listExist: exist, postList:postList, postCategoryList:postCategoryList,favCheck:favCheckList});
            }
        })
        .catch((error) => {
            console.error(error);
        });
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
                        <Text style = {styles.title}>스크랩</Text>
                        <View style={styles.underbar} />
                    </View>
                    {!this.state.listExist ? <ScrollView style={styles.nolist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }><Text style={styles.nolistText}>스크랩한 게시물이 없습니다...</Text></ScrollView> :
                        <ScrollView style={styles.yeslist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }>
                            {this.state.postList.map((post, idx)=>{
                                return (
                                    <View key={idx} style = {styles.caseTopContainer}>
                                        <TouchableOpacity style = {styles.indivContainer} 
                                        onPress={() => this.props.navigation.navigate("Home", {
                                            
                                        })}>
                                            <View style = {styles.caseContainer}>
                                                <Text style= {styles.boardCategory}>{this.state.postCategoryList[idx]}</Text>
                                                <Text style= {styles.caseID}>{post.Post.title}</Text>
                                                {post.Post.content.length>20 ?<Text style= {styles.caseName}>{post.Post.content.slice(0, 20)+"..."}</Text>
                                                :<Text style= {styles.caseName}>{post.Post.content.slice(0, 20)}</Text>}
                                                <View style= {styles.commentContainer}>
                                                    <Text style= {styles.date}>{post.Post.writtenDate.slice(0, 10)+" "+post.Post.writtenDate.slice(11,16)}</Text>
                                                    <Image source={require("../../assets/view.png")} style={styles.lawyerImage} />
                                                    <Text style= {styles.commentCount}>{(post.Post.views)}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            !this.state.favCheck[idx] ? 
                                            <TouchableOpacity  onPress={()=>this.changeFav(idx)}>
                                                <Image source={require("../../assets/graystar.png")} style={styles.starImage} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity onPress={()=>this.changeFav(idx)}>
                                                <Image source={require("../../assets/yellowStar.png")} style={styles.starImage} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                );
                            })}
                        </ScrollView>
                    }
                </View>
            </View>
        );
    }
}
FavPosts.contextType = MyContext;
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
        width: "92%",
        height: "40%",
        padding: "2%",
        paddingLeft: "1%",
        marginRight: 0,
    },
    caseTopContainer:{
        borderTopColor:"#DDDDDD",
        borderTopWidth: 1,
        flexDirection:"row",
        justifyContent:"space-between",      
        padding:20,
        paddingTop:5,
        paddingBottom:5,
    },
    caseID: {
        fontFamily: "KPWDMedium",
        color: "#000000",
        fontSize: 16,
        marginRight:"3%"
    },
    caseName:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#8D8D8D",
    },
    starImage: {
        width: 30,
        height: 30,
        alignSelf:"center",
        padding: 0,
        margin: "1%",
        marginTop: "70%",
    },
    indivContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
    },
    lawyerImage: {
        width: 15,
        height: 15,
        margin: 5,
        marginLeft: "2%",
        alignSelf: "center",
        marginBottom:"1%",
        marginTop:"0%",
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
    boardCategory:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: colors.primary,
    },
    date:{
        fontFamily: "KPWDLight",
        fontSize: 13,
        color: "#000000",
    }
});