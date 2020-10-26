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
import * as DocumentPicker from 'expo-document-picker';
import { MyContext } from '../../context.js';

import colors from "../config/colors";


export default class QaWrite extends Component {
    state = {
        fontsLoaded: false,
        file: null,
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
              <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={require("../assets/menu.png")} style={styles.menu} />
                        <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate("Home")}} >LAWBOT</Text>
                        <Image
                            source={require("../assets/profile.png")}
                            style={styles.profile}
                        />
                    </View>
                 
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
})
