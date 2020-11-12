import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ViewPropTypes,
  
} from "react-native";
import moment from 'moment';
import "moment/locale/ko";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from "../../context.js";
import PropTypes from 'prop-types';

import colors from "../config/colors";
import Header from "./Header.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { render } from "react-dom";



const utils = {
  dateAgo: function (targetDate) {
    return moment(targetDate, "YYYY-MM-DD hh-mm-ss").startOf("minute").fromNow();
  },
  nameHide: function (ID) {
    var id = ID.substring(0,4);
    
    for(var j = 4; j < ID.length; j++) {
      id += "*";
    }
    return id;
  },
  onAddFav: function (boardID) {
    const ctx = utils.context;
    let body = {
    };
    body.Precedent_ID = boardID;

    fetch(`${ctx.API_RUL}/user/judgement`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": ctx.token
      },
      body: JSON.stringify(body),
  }).then((res) => {
    return res.json();
  }).then((res) => {
    if(res.success) {
      ToastAndroid.show("즐겨찾기 등록에 성공하였습니다!", ToastAndroid.SHORT);
    }else {
        ToastAndroid.show("즐겨찾기 등록에 실패하였습니다...", ToastAndroid.SHORT);
    }
  });
  },
}
utils.context = MyContext

export class StyleOverride extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, style } = this.props;

    return(
      <View>
        <Text style={style}> 
          {text}
        </Text>
      </View>
    );
  }
}

export default utils;

const styles = StyleSheet.create({
  body: {
    flex: 12,
    overflow: "scroll",
  },
});
