import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from "react-native";
import * as Font from "expo-font";
import { DrawerActions } from '@react-navigation/drawer';

import colors from "../config/colors";


export default class Header2 extends Component {
    state = {
        fontsLoaded: false,
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
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {this.props.navigation.openDrawer()}}>
                    <Image source={require("../assets/menuWhite.png")} style={styles.menu} />
                </TouchableOpacity>
                <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate("Home")}} >LAWBOT</Text>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate("MyPage")}}>
                    <Image
                        source={require("../assets/profileWhite.png")}
                        style={styles.profile}
                    />
                </TouchableOpacity>
            </View>
          )
    };
}

const styles=StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "3%",
        paddingRight: "3%",
        minHeight: 50,
        backgroundColor: colors.primary,
        zIndex: 1,
    },
    logoTitle: {
        fontSize: 20,
        fontFamily: "SCDream8",
        color: "white"
    },
    menu: {
        width: 35,
        height: 35,
    },
    profile: {
        width: 30,
        height: 30,
    },
});