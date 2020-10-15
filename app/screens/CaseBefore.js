import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";

export default class DocumentInterpret extends Component {
    state = {
        fontsLoaded: false,
        caseID: 64738,
        caseHTML: '',
        caseURL:'',
    };

    async _loadFonts(){
    await Font.loadAsync({
            SCDream8: require("../assets/fonts/SCDream8.otf"),
            KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
        });
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFonts();
    }

    getHTML(){
        var main = {
            'OC': 'ICTPoolC',
            'target': 'prec',
            'ID': this.state.caseID,
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
        }).then((response) => {
            this.state.caseURL = response.url;
            this.props.navigation.navigate('CaseView', {
                caseURL: this.state.caseURL,
            });
        }).catch((error) => {
            console.error(error);
        });
    }
    render(){
        if (!this.state.fontsLoaded) {
            return <View />;
        }
        
        return (
            <View style = {styles.container}>
                <View style={styles.header}>
                    <Image source={require("../assets/menu.png")} style={styles.menu} />
                    <Text style={styles.logoTitle}>LAWBOT</Text>
                    <Image
                        source={require("../assets/profile.png")}
                        style={styles.profile}
                    />
                </View>
                
                <TouchableOpacity style={styles.fieldButton} onPress={() => this.getHTML()}>
                    <Image style={styles.fieldImage} source={require("../assets/carAccident.png")} />
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 12,
        overflow: "scroll",
    },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 1 : Expo.Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
        minHeight: 50,
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
    fieldButton: {
        width: 60,
        height: 60,
        backgroundColor: "#E7E7E7",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    fieldImage: {
        width: "60%",
        height: "60%"
    },
})