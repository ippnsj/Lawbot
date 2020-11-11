import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../../context.js';
import colors from "../../config/colors";
import Header from "../Header.js";
import { withNavigation } from 'react-navigation';

export default class FavCase extends Component{
    state = {
        fontsLoaded: false,
        listExist: false,
        cases:{},
        caseURL:"",
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
    async componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
        const ctx = this.context;
        let caseList = [];
        await fetch(`${ctx.API_URL}/user/judgement`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            let favCheckList = [];
            for (let i=0; i<res.length; i++){
                caseList.push(res[i].Precedent);
                favCheckList.push(true);
            }
            let exist = false;
            if (res.length != 0){
                exist = true;
            }
            this.setState({listExist:exist, cases:caseList, token: ctx.token, favCheck:favCheckList});
        })
        .catch((error) => {
            console.error(error);
        });
    }
    async componentDidUpdate(){
        const ctx = this.context;
        if((this.state.token != ctx.token && ctx.token != '')) {
            let caseList = [];
            await fetch(`${ctx.API_URL}/user/judgement`, {
                method: "GET",
                headers: {
                    "token": ctx.token
                },
            })
            .then((res) => {
                return res.json();
            })
            .then((res) =>{
                let favCheckList = [];
                for (let i=0; i<res.length; i++){
                    caseList.push(res[i].Precedent);
                    favCheckList.push(true);
                }
                let exist = false;
                if (res.length != 0){
                    exist = true;
                }
                this.setState({listExist:exist, cases:caseList, token: ctx.token, favCheck:favCheckList});
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
                    a.Precedent_ID = this.state.cases[j].ID;
                    fetch(`${ctx.API_URL}/user/judgement`,{
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
                    a.Precedent_ID = this.state.cases[j].ID;
                    fetch(`${ctx.API_URL}/user/judgement`,{
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
    getHTML(caseID){
        var main = {
            'OC': 'ICTPoolC',
            'target': 'prec',
            'ID': caseID,
            'type': 'HTML',
            'mobileYn':'Y'
        };
        var url = 'http://www.law.go.kr/DRF/lawService.do?OC='+ main.OC+'&target='+main.target+
            '&ID='+main.ID+'&type='+main.type+'&mobileYn='+main.mobileYn;
        
        fetch(url, {
            method: "GET",
            headers: {
            // "Content-Type": "application/json",
            },
        })
        .then((response) => {
            this.state.caseURL = response.url;
            this.props.navigation.navigate('CaseView', {
                caseURL: this.state.caseURL,
                caseID: caseID,
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }
    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }

    _onRefresh= ()=>{
        this.setState({refreshing: true}, ()=>this.read());
    }
    read(){
        let caseList = [];
        const ctx = this.context;
        fetch(`${ctx.API_URL}/user/judgement`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            let favCheckList = [];
            for (let i=0; i<res.length; i++){
                caseList.push(res[i].Precedent);
                favCheckList.push(true);
            }
            let exist = false;
            if (res.length != 0){
                exist = true;
            }
            if (this.state.refreshing){
                this.setState({listExist:exist, cases:caseList, token: ctx.token, favCheck:favCheckList, refreshing: false});
            }else{
                this.setState({listExist:exist, cases:caseList, token: ctx.token, favCheck:favCheckList});
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
                        <Text style = {styles.title}>판례 즐겨찾기</Text>
                        <View style={styles.underbar} />
                    </View>
                    {!this.state.listExist ? <ScrollView style={styles.nolist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }><Text style={styles.nolistText}>즐겨찾기한 판례가 없습니다...</Text></ScrollView> :
                        <ScrollView style={styles.yeslist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }>
                            {this.state.cases.map((caseInst, idx)=>{
                                return (
                                    <View key={idx} style = {styles.caseTopContainer}>
                                        <TouchableOpacity style = {styles.caseContainer} onPress = {()=>this.getHTML(caseInst.ID)}>
                                            <Text style={styles.caseName}>{caseInst.caseName}</Text>
                                            <Text style={styles.caseID}>{"판례일련번호\n" + caseInst.ID}</Text>
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
FavCase.contextType = MyContext;
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
    userApply:{
        flexDirection:"row",
        justifyContent:"flex-end",
        alignContent:"stretch",
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
    caseContainer: {
        width : "80%",
    },
    caseID: {
        fontFamily: "KPWDMedium",
        color: "#000000",
        fontSize: 16,
    },
    caseName:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: colors.primary,
    },
    starImage: {
        width: 30,
        height: 30,
        alignSelf:"center",
        padding: 0,
        margin: "1%",
        marginTop: "40%",
    },
    confirm:{
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 5,
        width: "15%",
        alignItems: "center",
        paddingVertical: "0.5%",
        marginRight : "3%",
        marginBottom: 0,
    },
    submitText: {
        fontSize: 15,
        color: colors.primary,
        fontFamily: "KPWDBold",
    },
});