import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { setDataUser } from '../store/action';

import { API } from '../../config/API';


class splashScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
      let token = await AsyncStorage.getItem('token_bhn_md')
      if (token) {

        API.get('/user/check-token', { headers: { token } })
          .then(async ({ data }) => {
            let dataUser = {
              user_id: data.user_id,
              name: data.name,
              role_id: data.role_id
            }

            await this.props.setDataUser(dataUser)
            this.props.navigation.navigate("Dashboard")
          })
          .catch(err => {
            this.props.navigation.navigate("Dashboard")
          })
      } else {
        this.props.navigation.navigate("Login")
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../asset/logo.png')} style={{ height: 80, width: 350 }} />
      </View>
    )
  }
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

const mapDispatchToProps = {
  setDataUser
}

export default connect(null, mapDispatchToProps)(splashScreen)
