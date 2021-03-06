/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Icon,
  Badge,
  Input,
  Item,
  Form,
  List,
  ListItem,
  Picker,
  Label,
  Button,
  Toast,
} from 'native-base';

import Popover from 'react-native-popover-view';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import ImagePicker from 'react-native-image-picker';

import {API, BaseURL} from '../../config/API';

const progressStepsStyle = {
  activeStepIconBorderColor: '#0079C2',
  activeLabelColor: '#0079C2',
  activeStepNumColor: 'white',
  activeStepIconColor: '#0079C2',
  completedStepIconColor: '#0079C2',
  completedProgressBarColor: '#0079C2',
  completedCheckColor: '#4bb543',
};

const buttonTextStyle = {
  color: '#0079C2',
  fontWeight: 'bold',
  marginBottom: 0,
};

class AddVisit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataNotification: [],
      isVisible: false,
      dataAllRetailer: [],
      dataAllStore: [],
      dataAllDC: [],
      dataAllStoreRetailer: [],
      dataAllStoreForDisplay: [],
      dataFixtureType: [],
      idRetailer: '',
      idDC: '',
      nameDC: '',
      initialRetailer: '',
      nameStore: '',
      city: '',
      address: '',
      fixtureTypeId: '',
      storeOpen: '',

      hasChangeNameStore: '',
      hasChangeDc: '',
      hasChangeCity: '',
      hasChangeAddress: '',

      img_store: null,
      img_fixture_in: null,
      img_fixture_out: null,
      idStore: '',
      entryFixComp: '',
      entryCorrectFix: '',
      entryGoogle50KSpacing: '',
      entryGoogle100KSpacing: '',
      entryGoogle150KSpacing: '',
      entryGoogle300KSpacing: '',
      entryGoogle500KSpacing: '',
      entryPegComp: '',
      entryBrokenHanger: '',
      entryPogComp: '',
      entryCorrectPog: '',
      entryGoogle50k: '',
      entryLotGoogle50k: '',
      entryGoogle100k: '',
      entryLotGoogle100k: '',
      entryGoogle150k: '',
      entryLotGoogle150k: '',
      entryGoogle300k: '',
      entryLotGoogle300k: '',
      entryGoogle500k: '',
      entryLotGoogle500k: '',
      entrySpotify1m: '',
      entryLotSpotify1m: '',
      entrySpotify3m: '',
      entryLotSpotify3m: '',
      entryPop1: '',
      entryPop2: '',
      // assistName: '',
      giftCard: '',
      aktifPOR: '',
      changeCardGift: '',
      exitFixComp: '',
      exitCorrectFix: '',
      exitGoogle50KSpacing: '',
      limitOptionExitGoogle50KSpacing: 0,
      exitGoogle100KSpacing: '',
      limitOptionExitGoogle100KSpacing: 0,
      exitGoogle150KSpacing: '',
      limitOptionExitGoogle150KSpacing: 0,
      exitGoogle300KSpacing: '',
      limitOptionExitGoogle300KSpacing: 0,
      exitGoogle500KSpacing: '',
      limitOptionExitGoogle500KSpacing: 0,
      exitPegComp: '',
      exitBrokenHanger: '',
      exitPogComp: '',
      exitCorrectPog: '',
      exitGoogle50k: '',
      exitLotGoogle50k: '',
      exitGoogle100k: '',
      exitLotGoogle100k: '',
      exitGoogle150k: '',
      exitLotGoogle150k: '',
      exitGoogle300k: '',
      exitLotGoogle300k: '',
      exitGoogle500k: '',
      exitLotGoogle500k: '',
      exitSpotify1m: '',
      exitLotSpotify1m: '',
      exitSpotify3m: '',
      exitLotSpotify3m: '',
      exitPop1: '',
      exitPop2: '',

      imgPOG1: '',
      imgPOG2: '',
      imgFixture1: '',
      imgFixture2: '',
      imgPOP1: '',
      imgPOP2: '',

      showSuggestion: false,
      hasSelectedStore: false,
      number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      number2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      optionNumber: [],

      submit: false,
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    });

    await this.fetchNotif();
    await this.fetchData();

    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.idRetailer !== prevState.idRetailer) {
      let newListStore = await this.state.dataAllStore.filter(
        el => Number(el.retailer_id) === Number(this.state.idRetailer),
      );

      let initialRetailer = await this.state.dataAllRetailer.find(
        el => Number(el.id) === Number(this.state.idRetailer),
      );

      initialRetailer &&
        this.setState({
          initialRetailer: initialRetailer.initial,
          dataAllStoreRetailer: newListStore,
          dataAllStoreForDisplay: newListStore.slice(0, 4),
          imgPOP1: initialRetailer.promotion_1,
          imgPOP2: initialRetailer.promotion_2,
        });
    }

    if (this.state.idStore !== prevState.idStore) {
      let hasilSearch = await this.state.dataAllStoreRetailer.filter(el =>
        el.store_code
          .toLowerCase()
          .match(new RegExp(this.state.idStore.toLowerCase())),
      );

      this.setState({
        dataAllStoreForDisplay: hasilSearch.slice(0, 4),
        showSuggestion: true,
      });

      if (this.state.nameStore) {
        this.setState({
          nameStore: '',
          dc: '',
          city: '',
          address: '',
          imgPOG1: '',
          imgPOG2: '',
          imgFixture1: '',
          imgFixture2: '',
          hasSelectedStore: false,
        });
      }
    }

    if (this.state.hasSelectedStore !== prevState.hasSelectedStore) {
      if (this.state.hasSelectedStore) {
        let storeSelected = await this.state.dataAllStoreForDisplay.find(
          el => el.store_code === this.state.idStore,
        );

        if (storeSelected) {
          let POG1, POG2, Fix1, Fix2;

          if (storeSelected.fixture_type_id_1) {
            POG1 = storeSelected.fixtureType1.POG;
            Fix1 = storeSelected.fixtureType1.fixture_traits;
          }
          if (storeSelected.fixture_type_id_2) {
            POG2 = storeSelected.fixtureType2.POG;
            Fix2 = storeSelected.fixtureType2.fixture_traits;
          }
          console.log(storeSelected.tbl_dc.id);
          let nameDC = await this.state.dataAllDC.find(
            el => el.id === storeSelected.tbl_dc.id,
          );

          this.setState({
            nameStore: storeSelected.store_name,
            idDC: storeSelected.tbl_dc.id,
            nameDC: nameDC.DC_name,
            city: storeSelected.city,
            address: storeSelected.address,
            imgPOG1: POG1 ? POG1 : '',
            imgPOG2: POG2 ? POG2 : '',
            imgFixture1: Fix1 ? Fix1 : '',
            imgFixture2: Fix2 ? Fix2 : '',
            showSuggestion: false,
            fixtureTypeId: storeSelected.fixture_type_id_1,
          });
        } else {
          this.setState({
            nameStore: '',
            dc: '',
            city: '',
            address: '',
            imgPOG1: '',
            imgPOG2: '',
            imgFixture1: '',
            imgFixture2: '',
            showSuggestion: false,
          });
        }
      }
    }

    if (
      this.state.nameStore !== prevState.nameStore &&
      prevState.nameStore !== ''
    ) {
      this.setState({
        hasChangeNameStore: true,
      });
    }

    if (this.state.idDC !== prevState.idDC && prevState.idDC !== '') {
      let nameDC = await this.state.dataAllDC.find(
        el => el.id === this.state.idDC,
      );

      this.setState({
        hasChangeDc: true,
        nameDC: nameDC.DC_name,
      });
    }

    if (this.state.city !== prevState.city && prevState.city !== '') {
      this.setState({
        hasChangeCity: true,
      });
    }

    if (this.state.address !== prevState.address && prevState.address !== '') {
      this.setState({
        hasChangeAddress: true,
      });
    }

    if (this.state.entryFixComp !== prevState.entryFixComp) {
      if (this.state.entryFixComp === 'Iya') {
        this.fetchGoogleSpacing('entry', this.state.fixtureTypeId);
      }
    }

    if (this.state.entryCorrectFix !== prevState.entryCorrectFix) {
      if (this.state.entryFixComp === 'Tidak') {
        this.fetchGoogleSpacing('entry', this.state.entryCorrectFix);
      }
    }

    if (this.state.exitFixComp !== prevState.exitFixComp) {
      if (this.state.exitFixComp === 'Iya') {
        this.fetchGoogleSpacing('exit', this.state.fixtureTypeId);
      }
    }

    if (this.state.exitCorrectFix !== prevState.exitCorrectFix) {
      if (this.state.exitFixComp === 'Tidak') {
        this.fetchGoogleSpacing('exit', this.state.exitCorrectFix);
      }
    }

    if (
      this.state.storeOpen !== prevState.storeOpen &&
      this.state.storeOpen === 0
    ) {
      this.setState({
        entryFixComp: 'Tidak',
        entryCorrectFix:
          this.state.idRetailer === 1 ? 7 : this.state.idRetailer === 2 ? 8 : 9,
        entryPegComp: 'Iya',
        entryBrokenHanger: 14,
        entryPogComp: 'Tidak',
        entryCorrectPog: 'Tidak ada sarana',
        entryPop1: 'Tidak',
        entryPop2: this.state.idRetailer === 1 ? 'Tidak' : '',
        entryGoogle50k: 'Tidak',
        entryLotGoogle50k: 0,
        entryGoogle100k: 'Tidak',
        entryLotGoogle100k: 0,
        entryGoogle150k: 'Tidak',
        entryLotGoogle150k: 0,
        entryGoogle300k: 'Tidak',
        entryLotGoogle300k: 0,
        entryGoogle500k: 'Tidak',
        entryLotGoogle500k: 0,
        entrySpotify1m: 'Tidak',
        entryLotSpotify1m: 0,
        entrySpotify3m: 'Tidak',
        entryLotSpotify3m: 0,
        exitFixComp: 'Tidak',
        exitCorrectFix:
          this.state.idRetailer === 1 ? 7 : this.state.idRetailer === 2 ? 8 : 9,
        exitPegComp: 'Iya',
        exitBrokenHanger: 14,
        exitPogComp: 'Tidak',
        exitCorrectPog: 'Tidak ada sarana',
        exitPop1: 'Tidak',
        exitPop2: this.state.idRetailer === 1 ? 'Tidak' : '',
        exitGoogle50k: 'Tidak',
        exitLotGoogle50k: 0,
        exitGoogle100k: 'Tidak',
        exitLotGoogle100k: 0,
        exitGoogle150k: 'Tidak',
        exitLotGoogle150k: 0,
        exitGoogle300k: 'Tidak',
        exitLotGoogle300k: 0,
        exitGoogle500k: 'Tidak',
        exitLotGoogle500k: 0,
        exitSpotify1m: 'Tidak',
        exitLotSpotify1m: 0,
        exitSpotify3m: 'Tidak',
        exitLotSpotify3m: 0,
        entryGoogle50KSpacing: 0,
        entryGoogle100KSpacing: 0,
        entryGoogle150KSpacing: 0,
        entryGoogle300KSpacing: 0,
        entryGoogle500KSpacing: 0,
        exitGoogle50KSpacing: 0,
        exitGoogle100KSpacing: 0,
        exitGoogle150KSpacing: 0,
        exitGoogle300KSpacing: 0,
        exitGoogle500KSpacing: 0,
        giftCard: 'Tidak',
        aktifPOR: 'Tidak',
        changeCardGift: 'Tidak',
      });
    }

    if (this.state.submit !== prevState.submit && this.state.submit) {
      this.submit();
    }
  }

  fetchGoogleSpacing = async (status, fixtureId) => {
    let selected = this.state.dataFixtureType.find(el => el.id === fixtureId);

    if (status === 'entry') {
      this.setState({optionNumber: []});
      let optionNumber = [],
        total =
          selected.google_50k +
          selected.google_100k +
          selected.google_150k +
          selected.google_300k +
          selected.google_500k;

      for (let i = 0; i <= total; i++) {
        optionNumber.push(i);
      }

      this.setState({
        optionNumber,
      });
    } else {
      this.setState({
        limitOptionExitGoogle50KSpacing: selected.google_50k,
        limitOptionExitGoogle100KSpacing: selected.google_100k,
        limitOptionExitGoogle150KSpacing: selected.google_150k,
        limitOptionExitGoogle300KSpacing: selected.google_300k,
        limitOptionExitGoogle500KSpacing: selected.google_500k,
      });
    }
  };

  fetchData = async () => {
    try {
      this.setState({
        loading: true,
      });
      let token = await AsyncStorage.getItem('token_bhn_md');
      let allRetailer = await API.get('/retailer', {headers: {token}});
      let allStore = await API.get('/store?forVisit=true', {headers: {token}});
      let allDc = await API.get('/dc', {headers: {token}});
      let allFixtureType = await API.get('/fixture-type', {headers: {token}});

      let newListRetailer = [];
      await allRetailer.data.data.forEach(async element => {
        let isAvailable = await allStore.data.data.find(
          el => el.retailer_id === element.id,
        );
        if (isAvailable) {
          newListRetailer.push(element);
        }
      });

      this.setState({
        loading: false,
        idRetailer: newListRetailer.length > 0 ? newListRetailer[0].id : '',
        dataAllRetailer: newListRetailer,
        dataAllStore: allStore.data.data,
        dataAllStoreForDisplay: allStore.data.data,
        dataAllDC: allDc.data.data,
        dataFixtureType: allFixtureType.data.data,
      });

      if (allStore.length === 0) {
        Toast.show({
          text: 'Anda belum ditugaskan di Toko manapun',
          buttonText: 'Okay',
          duration: 5000,
          type: 'danger',
        });
      }
    } catch (err) {
      this.setState({
        loading: false,
      });
      Toast.show({
        text: 'Fetch data retailer and store failed. Please try again',
        buttonText: 'Okay',
        duration: 3000,
        type: 'danger',
      });
    }
  };

  fetchNotif = async () => {
    try {
      let token = await AsyncStorage.getItem('token_bhn_md');
      let allNotif = await API.get('/notification', {headers: {token}});

      let newNotif = await allNotif.data.data.find(
        element => Number(element.read) === 0,
      );

      this.setState({
        dataNotification: allNotif.data.data,
        newNotif: newNotif ? true : false,
      });
    } catch (err) {
      Toast.show({
        text: 'Fetch notification failed',
        buttonText: 'Okay',
        duration: 3000,
        type: 'danger',
      });
    }
  };

  showPopover() {
    this.setState({isVisible: true});
  }

  closePopover() {
    this.setState({isVisible: false});
  }

  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  onValueChangeRetailer = value => {
    this.setState({
      idRetailer: value,
    });
  };

  onValueChangeStore = value => {
    this.setState({
      idStore: value,
    });
  };

  submit = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.sendVisit();
      } else {
        this.pendingVisit();
      }
    });
  };

  sendVisit = async () => {
    try {
      this.setState({
        loading: true,
      });

      let token = await AsyncStorage.getItem('token_bhn_md');

      var formData = new FormData();

      formData.append('store_open', this.state.storeOpen);
      formData.append('visit_date', `${new Date()}`);
      formData.append('user_id', this.props.user_id);
      formData.append('store_code', this.state.idStore);
      formData.append(
        'entry_fixture_comp',
        this.state.entryFixComp.toLowerCase() === 'iya' ? 1 : 0,
      );
      if (this.state.entryFixComp.toLowerCase() === 'tidak') {
        formData.append('entry_correct_fixture', this.state.entryCorrectFix);
      }
      formData.append(
        'entry_peg_comp',
        this.state.entryPegComp.toLowerCase() === 'iya' ? 0 : 1,
      );
      formData.append('entry_broken_hanger', this.state.entryBrokenHanger);
      formData.append(
        'entry_pog_comp',
        this.state.entryPogComp.toLowerCase() === 'iya' ? 1 : 0,
      );
      if (this.state.entryPogComp.toLowerCase() === 'tidak') {
        formData.append('entry_correct_pog', this.state.entryCorrectPog);
      }
      formData.append(
        'entry_pop_pic_1',
        this.state.entryPop1.toLowerCase() === 'iya' ? 1 : 0,
      );
      formData.append(
        'entry_pop_pic_2',
        this.state.entryPop2.toLowerCase() === 'iya' ? 1 : 0,
      );
      formData.append(
        'entry_google50k',
        this.state.entryGoogle50k.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotGoogle50k,
      );
      formData.append(
        'entry_google100k',
        this.state.entryGoogle100k.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotGoogle100k,
      );
      formData.append(
        'entry_google150k',
        this.state.entryGoogle150k.toLowerCase() === 'iya'
          ? 10
          : this.state.entryLotGoogle150k,
      );
      formData.append(
        'entry_google300k',
        this.state.entryGoogle300k.toLowerCase() === 'iya'
          ? 10
          : this.state.entryLotGoogle300k,
      );
      formData.append(
        'entry_google500k',
        this.state.entryGoogle500k.toLowerCase() === 'iya'
          ? 10
          : this.state.entryLotGoogle500k,
      );
      formData.append(
        'entry_spotify1M',
        this.state.entrySpotify1m.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotSpotify1m,
      );
      formData.append(
        'entry_spotify3M',
        this.state.entrySpotify3m.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotSpotify3m,
      );
      formData.append(
        'exit_fixture_comp',
        this.state.exitFixComp.toLowerCase() === 'iya' ? 1 : 0,
      );
      if (this.state.exitFixComp.toLowerCase() === 'tidak') {
        formData.append('exit_correct_fixture', this.state.exitCorrectFix);
      }
      formData.append(
        'exit_peg_comp',
        this.state.exitPegComp.toLowerCase() === 'iya' ? 0 : 1,
      );
      formData.append('exit_broken_hanger', this.state.exitBrokenHanger);
      formData.append(
        'exit_pog_comp',
        this.state.exitPogComp.toLowerCase() === 'iya' ? 1 : 0,
      );
      if (this.state.exitPogComp.toLowerCase() === 'tidak') {
        formData.append('exit_correct_pog', this.state.exitCorrectPog);
      }
      formData.append(
        'exit_pop_pic_1',
        this.state.exitPop1.toLowerCase() === 'iya' ? 1 : 0,
      );
      formData.append(
        'exit_pop_pic_2',
        this.state.exitPop2.toLowerCase() === 'iya' ? 1 : 0,
      );
      formData.append(
        'exit_google50k',
        this.state.exitGoogle50k.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotGoogle50k,
      );
      formData.append(
        'exit_google100k',
        this.state.exitGoogle100k.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotGoogle100k,
      );
      formData.append(
        'exit_google150k',
        this.state.exitGoogle150k.toLowerCase() === 'iya'
          ? 10
          : this.state.exitLotGoogle150k,
      );
      formData.append(
        'exit_google300k',
        this.state.exitGoogle300k.toLowerCase() === 'iya'
          ? 10
          : this.state.exitLotGoogle300k,
      );
      formData.append(
        'exit_google500k',
        this.state.exitGoogle500k.toLowerCase() === 'iya'
          ? 10
          : this.state.exitLotGoogle500k,
      );
      formData.append(
        'exit_spotify1M',
        this.state.exitSpotify1m.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotSpotify1m,
      );
      formData.append(
        'exit_spotify3M',
        this.state.exitSpotify3m.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotSpotify3m,
      );

      formData.append(
        'entryGoogle50KSpacing',
        this.state.entryGoogle50KSpacing,
      );
      formData.append(
        'entryGoogle100KSpacing',
        this.state.entryGoogle100KSpacing,
      );
      formData.append(
        'entryGoogle150KSpacing',
        this.state.entryGoogle150KSpacing,
      );
      formData.append(
        'entryGoogle300KSpacing',
        this.state.entryGoogle300KSpacing,
      );
      formData.append(
        'entryGoogle500KSpacing',
        this.state.entryGoogle500KSpacing,
      );
      formData.append('exitGoogle50KSpacing', this.state.exitGoogle50KSpacing);
      formData.append(
        'exitGoogle100KSpacing',
        this.state.exitGoogle100KSpacing,
      );
      formData.append(
        'exitGoogle150KSpacing',
        this.state.exitGoogle150KSpacing,
      );
      formData.append(
        'exitGoogle300KSpacing',
        this.state.exitGoogle300KSpacing,
      );
      formData.append(
        'exitGoogle500KSpacing',
        this.state.exitGoogle500KSpacing,
      );
      // formData.append("assistants_name", this.state.assistName)

      formData.append(
        'q1',
        this.state.giftCard.toLowerCase() === 'iya' ? 1 : 0,
      );
      formData.append(
        'q2',
        this.state.aktifPOR.toLowerCase() === 'iya' ? 1 : 0,
      );
      formData.append(
        'q3',
        this.state.changeCardGift.toLowerCase() === 'iya' ? 1 : 0,
      );

      if (this.state.hasChangeNameStore) {
        formData.append('store_name', this.state.nameStore);
      }
      if (this.state.hasChangeDc) {
        formData.append('dc_id', this.state.idDC);
      }
      if (this.state.hasChangeCity) {
        formData.append('city', this.state.city);
      }
      if (this.state.hasChangeAddress) {
        formData.append('address', this.state.address);
      }

      this.state.img_store &&
        formData.append('files', {
          name: 'img_store.jpg',
          type: 'image/jpeg',
          uri: this.state.img_store.uri,
        });

      this.state.img_fixture_in &&
        formData.append('files', {
          name: 'img_fixture_in.jpg',
          type: 'image/jpeg',
          uri: this.state.img_fixture_in.uri,
        });

      this.state.img_fixture_out &&
        formData.append('files', {
          name: 'img_fixture_out.jpg',
          type: 'image/jpeg',
          uri: this.state.img_fixture_out.uri,
        });

      await API.post('/visit', formData, {headers: {token}});

      Toast.show({
        text: 'Add data visit success',
        buttonText: 'Okay',
        duration: 3000,
        type: 'success',
      });

      this.resetForm();
      this.setState({
        loading: false,
      });

      this.props.route.params.refresh();
      this.props.navigation.navigate('Dashboard');
    } catch (err) {
      this.setState({
        loading: false,
      });

      await this.pendingVisit();
    }
  };

  pendingVisit = async () => {
    this.setState({
      loading: true,
    });

    let newArray = [
      ['store_open', this.state.storeOpen],
      ['visit_date', `${new Date()}`],
      ['user_id', this.props.user_id],
      ['store_code', this.state.idStore],
      [
        'entry_fixture_comp',
        this.state.entryFixComp.toLowerCase() === 'iya' ? 1 : 0,
      ],
      ['entry_correct_fixture', this.state.entryCorrectFix],
      [
        'entry_peg_comp',
        this.state.entryPegComp.toLowerCase() === 'iya' ? 0 : 1,
      ],
      ['entry_broken_hanger', this.state.entryBrokenHanger],
      [
        'entry_pog_comp',
        this.state.entryPogComp.toLowerCase() === 'iya' ? 1 : 0,
      ],
      ['entry_correct_pog', this.state.entryCorrectPog],
      ['entry_pop_pic_1', this.state.entryPop1.toLowerCase() === 'iya' ? 1 : 0],
      ['entry_pop_pic_2', this.state.entryPop2.toLowerCase() === 'iya' ? 1 : 0],
      [
        'entry_google50k',
        this.state.entryGoogle50k.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotGoogle50k,
      ],
      [
        'entry_google100k',
        this.state.entryGoogle100k.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotGoogle100k,
      ],
      [
        'entry_google150k',
        this.state.entryGoogle150k.toLowerCase() === 'iya'
          ? 10
          : this.state.entryLotGoogle150k,
      ],
      [
        'entry_google300k',
        this.state.entryGoogle300k.toLowerCase() === 'iya'
          ? 10
          : this.state.entryLotGoogle300k,
      ],
      [
        'entry_google500k',
        this.state.entryGoogle500k.toLowerCase() === 'iya'
          ? 10
          : this.state.entryLotGoogle500k,
      ],
      [
        'entry_spotify1M',
        this.state.entrySpotify1m.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotSpotify1m,
      ],
      [
        'entry_spotify3M',
        this.state.entrySpotify3m.toLowerCase() === 'iya'
          ? 15
          : this.state.entryLotSpotify3m,
      ],
      [
        'exit_fixture_comp',
        this.state.exitFixComp.toLowerCase() === 'iya' ? 1 : 0,
      ],
      ['exit_correct_fixture', this.state.exitCorrectFix],
      ['exit_peg_comp', this.state.exitPegComp.toLowerCase() === 'iya' ? 0 : 1],
      ['exit_broken_hanger', this.state.exitBrokenHanger],
      ['exit_pog_comp', this.state.exitPogComp.toLowerCase() === 'iya' ? 1 : 0],
      ['exit_correct_pog', this.state.exitCorrectPog],
      ['exit_pop_pic_1', this.state.exitPop1.toLowerCase() === 'iya' ? 1 : 0],
      ['exit_pop_pic_2', this.state.exitPop2.toLowerCase() === 'iya' ? 1 : 0],
      [
        'exit_google50k',
        this.state.exitGoogle50k.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotGoogle50k,
      ],
      [
        'exit_google100k',
        this.state.exitGoogle100k.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotGoogle100k,
      ],
      [
        'exit_google150k',
        this.state.exitGoogle150k.toLowerCase() === 'iya'
          ? 10
          : this.state.exitLotGoogle150k,
      ],
      [
        'exit_google300k',
        this.state.exitGoogle300k.toLowerCase() === 'iya'
          ? 10
          : this.state.exitLotGoogle300k,
      ],
      [
        'exit_google500k',
        this.state.exitGoogle500k.toLowerCase() === 'iya'
          ? 10
          : this.state.exitLotGoogle500k,
      ],
      [
        'exit_spotify1M',
        this.state.exitSpotify1m.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotSpotify1m,
      ],
      [
        'exit_spotify3M',
        this.state.exitSpotify3m.toLowerCase() === 'iya'
          ? 15
          : this.state.exitLotSpotify3m,
      ],
      ['entryGoogle50KSpacing', this.state.entryGoogle50KSpacing],
      ['entryGoogle100KSpacing', this.state.entryGoogle100KSpacing],
      ['entryGoogle150KSpacing', this.state.entryGoogle150KSpacing],
      ['entryGoogle300KSpacing', this.state.entryGoogle300KSpacing],
      ['entryGoogle500KSpacing', this.state.entryGoogle500KSpacing],
      ['exitGoogle50KSpacing', this.state.exitGoogle50KSpacing],
      ['exitGoogle100KSpacing', this.state.exitGoogle100KSpacing],
      ['exitGoogle150KSpacing', this.state.exitGoogle150KSpacing],
      ['exitGoogle300KSpacing', this.state.exitGoogle300KSpacing],
      ['exitGoogle500KSpacing', this.state.exitGoogle500KSpacing],
      // ["assistants_name", this.state.assistName],

      ['q1', this.state.giftCard.toLowerCase() === 'iya' ? 1 : 0],
      ['q2', this.state.aktifPOR.toLowerCase() === 'iya' ? 1 : 0],
      ['q3', this.state.changeCardGift.toLowerCase() === 'iya' ? 1 : 0],
    ];

    if (this.state.hasChangeNameStore) {
      newArray.push(['store_name', this.state.nameStore]);
    }
    if (this.state.hasChangeDc) {
      newArray.push(['dc_id', this.state.idDC]);
    }
    if (this.state.hasChangeCity) {
      newArray.push(['city', this.state.city]);
    }
    if (this.state.hasChangeAddress) {
      newArray.push(['address', this.state.address]);
    }

    if (this.state.img_store) {
      newArray.push([
        'files',
        {
          name: 'img_store.jpg',
          type: 'image/jpeg',
          uri: this.state.img_store.uri,
        },
      ]);
    }

    if (this.state.img_fixture_in) {
      newArray.push([
        'files',
        {
          name: 'img_fixture_in.jpg',
          type: 'image/jpeg',
          uri: this.state.img_fixture_in.uri,
        },
      ]);
    }

    if (this.state.img_fixture_out) {
      newArray.push([
        'files',
        {
          name: 'img_fixture_out.jpg',
          type: 'image/jpeg',
          uri: this.state.img_fixture_out.uri,
        },
      ]);
    }

    let listPendingVisit = await AsyncStorage.getItem('visit_pending');
    if (listPendingVisit) {
      listPendingVisit = JSON.parse(listPendingVisit);
    } else {
      listPendingVisit = [];
    }

    listPendingVisit.push(newArray);

    await AsyncStorage.setItem(
      'visit_pending',
      JSON.stringify(listPendingVisit),
    );

    Toast.show({
      text: "Add data visit pending. There isn't connection",
      buttonText: 'Oke',
      duration: 3000,
      type: 'warning',
    });

    setTimeout(() => {
      this.props.route.params.refresh();
      this.props.navigation.navigate('Dashboard');
      this.setState({
        loading: false,
      });
    }, 3000);
  };

  launchCamera = args => {
    const options = {
      noData: true,
    };
    ImagePicker.launchCamera(options, response => {
      if (response.uri) {
        this.setState({
          [args]: response,
        });
      }
    });
  };

  onValueChangeNew = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  resetForm = () => {
    this.setState({
      idRetailer: '',
      initialRetailer: '',
      nameStore: '',
      dc: '',
      city: '',
      address: '',
      storeOpen: true,

      idStore: '',
      entryFixComp: '',
      entryCorrectFix: '',
      entryGoogle50KSpacing: '',
      entryGoogle100KSpacing: '',
      entryGoogle150KSpacing: '',
      entryGoogle300KSpacing: '',
      entryGoogle500KSpacing: '',
      entryPegComp: '',
      entryBrokenHanger: '',
      entryPogComp: '',
      entryCorrectPog: '',
      entryGoogle50k: '',
      entryLotGoogle50k: '',
      entryGoogle100k: '',
      entryLotGoogle100k: '',
      entryGoogle150k: '',
      entryLotGoogle150k: '',
      entryGoogle300k: '',
      entryLotGoogle300k: '',
      entryGoogle500k: '',
      entryLotGoogle500k: '',
      entrySpotify1m: '',
      entryLotSpotify1m: '',
      entrySpotify3m: '',
      entryLotSpotify3m: '',
      entryPop1: '',
      entryPop2: '',
      // assistName: '',
      giftCard: '',
      aktifPOR: '',
      changeCardGift: '',
      exitFixComp: '',
      exitCorrectFix: '',
      limitOptionExitGoogle50KSpacing: 0,
      exitGoogle100KSpacing: '',
      limitOptionExitGoogle100KSpacing: 0,
      exitGoogle150KSpacing: '',
      limitOptionExitGoogle150KSpacing: 0,
      exitGoogle300KSpacing: '',
      optionExitGoogle300KSpacing: 0,
      exitGoogle500KSpacing: '',
      limitOptionExitGoogle500KSpacing: 0,
      exitPegComp: '',
      exitBrokenHanger: '',
      exitPogComp: '',
      exitCorrectPog: '',
      exitGoogle50k: '',
      exitLotGoogle50k: '',
      exitGoogle100k: '',
      exitLotGoogle100k: '',
      exitGoogle150k: '',
      exitLotGoogle150k: '',
      exitGoogle300k: '',
      exitLotGoogle300k: '',
      exitGoogle500k: '',
      exitLotGoogle500k: '',
      exitSpotify1m: '',
      exitLotSpotify1m: '',
      exitSpotify3m: '',
      exitLotSpotify3m: '',
      exitPop1: '',
      exitPop2: '',
      exitGoogle50KSpacing: '',

      imgPOG1: '',
      imgPOG2: '',
      imgFixture1: '',
      imgFixture2: '',
      imgPOP1: '',
      imgPOP2: '',
    });
  };

  handleSelectItem = (item, index) => {
    const {onDropdownClose} = this.props;
    onDropdownClose();
  };

  nextDah = e => {
    console.log(e);
  };
  render() {
    return (
      <>
        <View
          style={{
            height: '100%',
            backgroundColor: '#0079C2',
            padding: 15,
            paddingBottom: 5,
            display: 'flex',
          }}>
          <View style={styles.header}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                BHN MD
              </Text>

              {this.state.newNotif ? (
                <TouchableHighlight
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  ref={ref => (this.touchable = ref)}
                  onPress={() => this.showPopover()}
                  underlayColor="transparent">
                  <Image
                    source={require('../asset/notif-new.png')}
                    style={{
                      height: 30,
                      width: 33,
                      resizeMode: 'stretch',
                    }}
                  />
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  ref={ref => (this.touchable = ref)}
                  onPress={() => this.showPopover()}
                  underlayColor="transparent">
                  <Image
                    source={require('../asset/notif.png')}
                    style={{
                      height: 27,
                      width: 27,
                      resizeMode: 'stretch',
                    }}
                  />
                </TouchableHighlight>
              )}
            </View>
            <TouchableHighlight
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => this.logout()}
              underlayColor="transparent">
              <>
                <Image
                  source={require('../asset/logout.png')}
                  style={{
                    height: 27,
                    width: 27,
                    resizeMode: 'stretch',
                    marginRight: 5,
                  }}
                />
                <Text
                  style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
                  Keluar
                </Text>
              </>
            </TouchableHighlight>
          </View>

          <View style={{backgroundColor: 'white', marginTop: 20}}>
            <ScrollView style={{height: '100%'}}>
              <ProgressSteps {...progressStepsStyle}>
                {/* 1 */}
                <ProgressStep
                  label=""
                  nextBtnTextStyle={buttonTextStyle}
                  previousBtnStyle={{display: 'none'}}
                  nextBtnDisabled={
                    !this.state.nameStore ||
                    !this.state.img_store ||
                    this.state.storeOpen === ''
                  }
                  onNext={e => this.nextDah(e)}>
                  <Form style={{padding: 20, paddingTop: 0}}>
                    <View id="idRetailer" style={{marginBottom: 15}}>
                      <Label>Retailer</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.idRetailer}
                          onValueChange={text =>
                            this.onValueChangeNew('idRetailer', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          {this.state.dataAllRetailer.length > 0 &&
                            this.state.dataAllRetailer.map(el => (
                              <Picker.Item
                                label={el.initial}
                                value={el.id}
                                key={`${el.id}${el.initial}`}
                              />
                            ))}
                        </Picker>
                      </Item>
                    </View>
                    <View id="idStore" style={{marginBottom: 15}}>
                      <Label>Store</Label>
                      <Input
                        value={this.state.idStore}
                        style={{backgroundColor: '#F0F0F0', width: '100%'}}
                        onChangeText={text =>
                          this.setState({
                            idStore: text,
                          })
                        }
                      />
                      {this.state.showSuggestion &&
                        !this.state.hasSelectedStore && (
                          <List
                            style={{
                              maxHeight: 250,
                              width: '100%',
                              borderWidth: 1,
                              borderColor: 'black',
                            }}>
                            {this.state.dataAllStoreForDisplay.map(el => (
                              <ListItem
                                style={{
                                  flexDirection: 'row',
                                  height: 50,
                                  alignItems: 'center',
                                  marginLeft: 0,
                                  paddingLeft: 8,
                                }}
                                key={el.store_code}>
                                <TouchableHighlight
                                  underlayColor="transparent"
                                  style={{width: '100%'}}
                                  onPress={() =>
                                    this.setState({
                                      idStore: el.store_code,
                                      hasSelectedStore: true,
                                    })
                                  }>
                                  <Text style={{fontSize: 15}}>
                                    {el.store_code}
                                  </Text>
                                </TouchableHighlight>
                              </ListItem>
                            ))}
                          </List>
                        )}
                    </View>

                    <View id="nameStore" style={{marginBottom: 15}}>
                      <Label>Store Name</Label>
                      <Input
                        value={this.state.nameStore}
                        style={{backgroundColor: '#F0F0F0'}}
                        onChangeText={text =>
                          this.setState({
                            nameStore: text,
                          })
                        }
                        disabled={!this.state.hasSelectedStore}
                      />
                    </View>
                    <View id="dc" style={{marginBottom: 15}}>
                      <Label>DC/Wilayah Store</Label>
                      {this.state.hasSelectedStore ? (
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.idDC}
                            onValueChange={text =>
                              this.onValueChangeNew('idDC', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.dataAllDC.length > 0 &&
                              this.state.dataAllDC.map(el => (
                                <Picker.Item
                                  label={el.DC_name}
                                  value={el.id}
                                  key={el.id}
                                />
                              ))}
                          </Picker>
                        </Item>
                      ) : (
                        <Input
                          value={this.state.idDC}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      )}
                    </View>
                    <View id="city" style={{marginBottom: 15}}>
                      <Label>City</Label>
                      <Input
                        value={this.state.city}
                        style={{backgroundColor: '#F0F0F0'}}
                        onChangeText={text =>
                          this.setState({
                            city: text,
                          })
                        }
                        disabled={!this.state.hasSelectedStore}
                      />
                    </View>
                    <View id="address" style={{marginBottom: 15}}>
                      <Label>Address</Label>
                      <Input
                        value={this.state.address}
                        style={{backgroundColor: '#F0F0F0'}}
                        onChangeText={text =>
                          this.setState({
                            address: text,
                          })
                        }
                        disabled={!this.state.hasSelectedStore}
                      />
                    </View>

                    <View id="foto" style={{marginBottom: 15}}>
                      <Label>Image Store</Label>
                      {this.state.img_store ? (
                        <Image
                          source={this.state.img_store}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder-take-image.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                      <Button
                        info
                        onPress={() => this.launchCamera('img_store')}
                        style={{
                          justifyContent: 'center',
                          backgroundColor: '#0079C2',
                        }}>
                        <Text style={{color: 'white'}}>Take Photo</Text>
                      </Button>
                    </View>

                    <View id="storeOpen" style={{marginBottom: 15}}>
                      <Label>Apakah Toko Buka</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.storeOpen}
                          onValueChange={text =>
                            this.onValueChangeNew('storeOpen', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Buka" value={1} />
                          <Picker.Item label="Tutup" value={0} />
                        </Picker>
                      </Item>
                    </View>
                  </Form>
                </ProgressStep>

                {/* 2 */}
                <ProgressStep
                  label=""
                  nextBtnTextStyle={buttonTextStyle}
                  previousBtnTextStyle={buttonTextStyle}
                  nextBtnDisabled={
                    (!this.state.img_fixture_in &&
                      this.state.storeOpen === 'Buka') ||
                    !this.state.entryFixComp ||
                    (this.state.entryFixComp === 'Tidak' &&
                      !this.state.entryCorrectFix) ||
                    !this.state.entryPegComp ||
                    (this.state.entryPegComp === 'Iya' &&
                      !this.state.entryBrokenHanger) ||
                    !this.state.entryPogComp ||
                    (this.state.entryPogComp === 'Tidak' &&
                      !this.state.entryCorrectPog) ||
                    !this.state.entryGoogle50k ||
                    (this.state.entryGoogle50k === 'Tidak' &&
                      this.state.entryLotGoogle50k === '') ||
                    !this.state.entryGoogle100k ||
                    (this.state.entryGoogle100k === 'Tidak' &&
                      this.state.entryLotGoogle100k === '') ||
                    !this.state.entryGoogle150k ||
                    (this.state.entryGoogle150k === 'Tidak' &&
                      this.state.entryLotGoogle150k === '') ||
                    !this.state.entryGoogle300k ||
                    (this.state.entryGoogle300k === 'Tidak' &&
                      this.state.entryLotGoogle300k === '') ||
                    !this.state.entryGoogle500k ||
                    (this.state.entryGoogle500k === 'Tidak' &&
                      this.state.entryLotGoogle500k === '') ||
                    (this.state.idRetailer === 1 &&
                      !this.state.entrySpotify1m) ||
                    (this.state.idRetailer === 1 &&
                      this.state.entrySpotify1m === 'Tidak' &&
                      this.state.entryLotSpotify1m === '') ||
                    (this.state.idRetailer === 1 &&
                      !this.state.entrySpotify3m) ||
                    (this.state.idRetailer === 1 &&
                      this.state.entrySpotify3m === 'Tidak' &&
                      this.state.entryLotSpotify3m === '') ||
                    !this.state.entryPop1 ||
                    (this.state.idRetailer === 1 && !this.state.entryPop2) ||
                    !this.state.giftCard ||
                    !this.state.aktifPOR ||
                    !this.state.changeCardGift ||
                    this.state.entryGoogle50KSpacing === '' ||
                    this.state.entryGoogle100KSpacing === '' ||
                    this.state.entryGoogle150KSpacing === '' ||
                    this.state.entryGoogle300KSpacing === '' ||
                    this.state.entryGoogle500KSpacing === ''
                  }>
                  <Form style={{padding: 20, paddingTop: 0}}>
                    <View id="fotoEntFix" style={{marginBottom: 15}}>
                      <Label>Foto Sarana Sebelum</Label>
                      {this.state.img_fixture_in ? (
                        <Image
                          source={this.state.img_fixture_in}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder-take-image.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                      <Button
                        info
                        onPress={() => this.launchCamera('img_fixture_in')}
                        style={{
                          justifyContent: 'center',
                          backgroundColor: '#0079C2',
                        }}>
                        <Text style={{color: 'white'}}>Take Photo</Text>
                      </Button>
                    </View>
                    <View id="entryFixComp" style={{marginBottom: 15}}>
                      <Label>
                        Apakah itu cocok dengan apa yang ada di aplikasi?
                      </Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          placeholder="Select your SIM"
                          selectedValue={this.state.entryFixComp}
                          onValueChange={text =>
                            this.onValueChangeNew('entryFixComp', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryFixComp === 'Tidak' && (
                      <View id="entryCorrectFix" style={{marginBottom: 15}}>
                        <Label>Fixture yang ada dilapangan ?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryCorrectFix}
                            onValueChange={text =>
                              this.onValueChangeNew('entryCorrectFix', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.dataFixtureType.map(el => (
                              <Picker.Item
                                label={el.fixture_type}
                                value={el.id}
                                key={'fix' + el.id}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View
                      id="instockComp"
                      style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#afbd20',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        marginBottom: 10,
                        marginTop: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Tampilan voucher saat masuk
                      </Text>
                    </View>

                    {/* ENTRY SPACING */}
                    <>
                      {/* 50K */}
                      <View
                        id="entryGoogle50KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 50K?</Label>
                        <Item picker disabled>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryGoogle50KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'entryGoogle50KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.optionNumber.map(el => (
                              <Picker.Item
                                label={`${el}`}
                                value={el}
                                key={`egs50${el}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>

                      {/* 100K */}
                      <View
                        id="entryGoogle100KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 100K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryGoogle100KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'entryGoogle100KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.optionNumber.map(el => (
                              <Picker.Item
                                label={`${el}`}
                                value={el}
                                key={`egs100${el}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>

                      {/* 150K */}
                      <View
                        id="entryGoogle150KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 150K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryGoogle150KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'entryGoogle150KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.optionNumber.map(el => (
                              <Picker.Item
                                label={`${el}`}
                                value={el}
                                key={`egs150${el}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>

                      {/* 300K */}
                      <View
                        id="entryGoogle300KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 300K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryGoogle300KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'entryGoogle300KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.optionNumber.map(el => (
                              <Picker.Item
                                label={`${el}`}
                                value={el}
                                key={`egs300${el}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>

                      {/* 500K */}
                      <View
                        id="entryGoogle500KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 500K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryGoogle500KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'entryGoogle500KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.optionNumber.map(el => (
                              <Picker.Item
                                label={`${el}`}
                                value={el}
                                key={`egs500${el}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>
                    </>

                    <View id="entryPEGComp" style={{marginBottom: 15}}>
                      <Label>Adakah gantungan yang rusak ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryPegComp}
                          onValueChange={text =>
                            this.onValueChangeNew('entryPegComp', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryPegComp === 'Iya' && (
                      <View id="entryBrokenHanger" style={{marginBottom: 15}}>
                        <Label>Berapa gantungan yang rusak ?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryBrokenHanger}
                            onValueChange={text =>
                              this.onValueChangeNew('entryBrokenHanger', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number2.map(num => (
                              <Picker.Item
                                label={`${num}`}
                                value={num}
                                key={`a${num}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="fotoPOG" style={{marginBottom: 15}}>
                      <Label>Foto Planogram</Label>
                      {this.state.imgPOG1 ? (
                        <Image
                          source={{uri: `${BaseURL}/${this.state.imgPOG1}`}}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                    </View>
                    <View id="entryPOGComp" style={{marginBottom: 15}}>
                      <Label>Apakah Planogram terpasang dengan benar ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryPogComp}
                          onValueChange={text =>
                            this.onValueChangeNew('entryPogComp', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryPogComp === 'Tidak' && (
                      <View id="entryCorrectPog" style={{marginBottom: 15}}>
                        <Label>Bagaimana keadaan Planogram di lapangan ?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryCorrectPog}
                            onValueChange={text =>
                              this.onValueChangeNew('entryCorrectPog', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            <Picker.Item
                              label="Gantungan rusak / patah"
                              value="Gantungan rusak / patah"
                            />
                            <Picker.Item
                              label="Voucher tidak sesuai aturan"
                              value="Voucher tidak sesuai aturan"
                            />
                            <Picker.Item
                              label="Stock voucher kosong"
                              value="Stock voucher kosong"
                            />
                            <Picker.Item
                              label="Tidak ada sarana"
                              value="Tidak ada sarana"
                            />
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View
                      id="instockComp"
                      style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#afbd20',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        marginBottom: 10,
                        marginTop: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        In-stock Compliance
                      </Text>
                    </View>

                    <View id="entryGoogle50k" style={{marginBottom: 15}}>
                      <Label>Google 50K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryGoogle50k}
                          onValueChange={text =>
                            this.onValueChangeNew('entryGoogle50k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryGoogle50k === 'Tidak' && (
                      <View id="entryLotGoogle50k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google50K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryLotGoogle50k}
                            onValueChange={text =>
                              this.onValueChangeNew('entryLotGoogle50k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el => +this.state.entryGoogle50KSpacing <= +el,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`b${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="entryGoogle100k" style={{marginBottom: 15}}>
                      <Label>Google 100K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryGoogle100k}
                          onValueChange={text =>
                            this.onValueChangeNew('entryGoogle100k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryGoogle100k === 'Tidak' && (
                      <View id="entryLotGoogle100k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google100K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryLotGoogle100k}
                            onValueChange={text =>
                              this.onValueChangeNew('entryLotGoogle100k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el => +this.state.entryGoogle100KSpacing <= +el,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`c${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="entryGoogle150k" style={{marginBottom: 15}}>
                      <Label>Google 150K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryGoogle150k}
                          onValueChange={text =>
                            this.onValueChangeNew('entryGoogle150k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryGoogle150k === 'Tidak' && (
                      <View id="entryLotGoogle150k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google150K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryLotGoogle150k}
                            onValueChange={text =>
                              this.onValueChangeNew('entryLotGoogle150k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el =>
                                  +this.state.entryGoogle150KSpacing <= +el &&
                                  +el < 10,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`d${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="entryGoogle300k" style={{marginBottom: 15}}>
                      <Label>Google 300K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryGoogle300k}
                          onValueChange={text =>
                            this.onValueChangeNew('entryGoogle300k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryGoogle300k === 'Tidak' && (
                      <View id="entryLotGoogle300k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google300K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryLotGoogle300k}
                            onValueChange={text =>
                              this.onValueChangeNew('entryLotGoogle300k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el =>
                                  +this.state.entryGoogle300KSpacing <= +el &&
                                  +el < 10,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`e${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="entryGoogle500k" style={{marginBottom: 15}}>
                      <Label>Google 500K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryGoogle500k}
                          onValueChange={text =>
                            this.onValueChangeNew('entryGoogle500k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.entryGoogle500k === 'Tidak' && (
                      <View id="entryLotGoogle500k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google500K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.entryLotGoogle500k}
                            onValueChange={text =>
                              this.onValueChangeNew('entryLotGoogle500k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el =>
                                  +this.state.entryGoogle500KSpacing <= +el &&
                                  +el < 10,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`f${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    {this.state.idRetailer === 1 && (
                      <>
                        <View id="entrySpotify1m" style={{marginBottom: 15}}>
                          <Label>Spotify 1m ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.entrySpotify1m}
                              onValueChange={text =>
                                this.onValueChangeNew('entrySpotify1m', text)
                              }>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>

                        {this.state.entrySpotify1m === 'Tidak' && (
                          <View
                            id="entryLotSpotify1m"
                            style={{marginBottom: 15}}>
                            <Label>Sisa voucher Spotify1M?</Label>
                            <Item picker>
                              <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{backgroundColor: '#F0F0F0'}}
                                selectedValue={this.state.entryLotSpotify1m}
                                onValueChange={text =>
                                  this.onValueChangeNew(
                                    'entryLotSpotify1m',
                                    text,
                                  )
                                }>
                                <Picker.Item label="Pilih opsi anda" value="" />
                                {this.state.number.map(num => (
                                  <Picker.Item
                                    label={`${num}`}
                                    value={num}
                                    key={`g${num}`}
                                  />
                                ))}
                              </Picker>
                            </Item>
                          </View>
                        )}

                        <View id="entrySpotify3m" style={{marginBottom: 15}}>
                          <Label>Spotify 3m ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.entrySpotify3m}
                              onValueChange={text =>
                                this.onValueChangeNew('entrySpotify3m', text)
                              }>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>

                        {this.state.entrySpotify3m === 'Tidak' && (
                          <View
                            id="entryLotSpotify3m"
                            style={{marginBottom: 15}}>
                            <Label>Sisa voucher Spotify3M?</Label>
                            <Item picker>
                              <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{backgroundColor: '#F0F0F0'}}
                                selectedValue={this.state.entryLotSpotify3m}
                                onValueChange={text =>
                                  this.onValueChangeNew(
                                    'entryLotSpotify3m',
                                    text,
                                  )
                                }>
                                <Picker.Item label="Pilih opsi anda" value="" />
                                {this.state.number.map(num => (
                                  <Picker.Item
                                    label={`${num}`}
                                    value={num}
                                    key={`h${num}`}
                                  />
                                ))}
                              </Picker>
                            </Item>
                          </View>
                        )}
                      </>
                    )}

                    <View id="fotoPOP1" style={{marginBottom: 15}}>
                      {this.state.idRetailer === 1 ? (
                        <Label>Foto Promotion 1</Label>
                      ) : (
                        <Label>Foto Promotion</Label>
                      )}
                      {this.state.imgPOP1 ? (
                        <Image
                          source={{uri: `${BaseURL}/${this.state.imgPOP1}`}}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                    </View>
                    <View id="entryPop1" style={{marginBottom: 15}}>
                      {this.state.idRetailer === 1 ? (
                        <Label>
                          Apakah foto promosi 1 cocok dengan gambar diatas?
                        </Label>
                      ) : (
                        <Label>
                          Apakah foto promosi cocok dengan gambar diatas?
                        </Label>
                      )}
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.entryPop1}
                          onValueChange={text =>
                            this.onValueChangeNew('entryPop1', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.idRetailer === 1 && (
                      <>
                        <View id="fotoPOP2" style={{marginBottom: 15}}>
                          <Label>Foto Promotion 2</Label>
                          {this.state.imgPOP2 ? (
                            <Image
                              source={{uri: `${BaseURL}/${this.state.imgPOP2}`}}
                              style={{
                                width: '100%',
                                height: 400,
                                resizeMode: 'stretch',
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../asset/placeholder.png')}
                              style={{
                                width: '100%',
                                height: 300,
                                resizeMode: 'stretch',
                              }}
                            />
                          )}
                        </View>
                        <View id="entryPop2" style={{marginBottom: 15}}>
                          <Label>
                            Apakah foto promosi 2 cocok dengan gambar diatas?
                          </Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.entryPop2}
                              onValueChange={text =>
                                this.onValueChangeNew('entryPop2', text)
                              }>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>
                      </>
                    )}

                    <View
                      id="knowledge"
                      style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#afbd20',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        marginBottom: 10,
                        marginTop: 5,
                      }}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        Knowledge
                      </Text>
                    </View>

                    <View id="giftCard" style={{marginBottom: 15}}>
                      <Label>
                        Apakah staff toko tau cara aktifasi voucher ?
                      </Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.giftCard}
                          onValueChange={text =>
                            this.onValueChangeNew('giftCard', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="aktifPOR" style={{marginBottom: 15}}>
                      <Label>
                        Apakah staff toko tau promosi yang berjalan ?
                      </Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.aktifPOR}
                          onValueChange={text =>
                            this.onValueChangeNew('aktifPOR', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="changeCardGift" style={{marginBottom: 15}}>
                      <Label>
                        Apakah staff toko tau cara mengatasi customer komplen ?
                      </Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.changeCardGift}
                          onValueChange={text =>
                            this.onValueChangeNew('changeCardGift', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>
                  </Form>
                </ProgressStep>

                {/* 3 */}
                <ProgressStep
                  label=""
                  nextBtnTextStyle={buttonTextStyle}
                  previousBtnTextStyle={buttonTextStyle}
                  style={{height: '100%'}}>
                  <View
                    style={{padding: 20, paddingTop: 10, height: height - 250}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{width: 25, fontSize: 18}}>1.</Text>
                      <Text style={{fontSize: 18}}>
                        Install fixture yang benar jika perlu dan memungkinkan
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{width: 25, fontSize: 18}}>2.</Text>
                      <Text style={{fontSize: 18}}>
                        Memperbaiki atau ganti gantungan yang rusak jika perlu
                        dan memungkinkan
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{width: 25, fontSize: 18}}>3.</Text>
                      <Text style={{fontSize: 18}}>
                        Memperbaiki display atau tampilan untuk memperbaiki
                        planogram
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{width: 25, fontSize: 18}}>4.</Text>
                      <Text style={{fontSize: 18}}>
                        Memperbaiki gambar promosi jika perlu dan memungkinkan
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{width: 25, fontSize: 18}}>5.</Text>
                      <Text style={{fontSize: 18}}>
                        Tambahkan stok jika diberikan oleh staf toko
                      </Text>
                    </View>
                  </View>
                </ProgressStep>

                {/* 4 */}
                <ProgressStep
                  label=""
                  nextBtnTextStyle={buttonTextStyle}
                  previousBtnTextStyle={buttonTextStyle}
                  nextBtnDisabled={
                    (!this.state.img_fixture_out &&
                      this.state.storeOpen === 'Buka') ||
                    !this.state.exitFixComp ||
                    (this.state.exitFixComp === 'Tidak' &&
                      !this.state.exitCorrectFix) ||
                    !this.state.exitPegComp ||
                    (this.state.exitPegComp === 'Iya' &&
                      !this.state.exitBrokenHanger) ||
                    !this.state.exitPogComp ||
                    (this.state.exitPogComp === 'Tidak' &&
                      !this.state.exitCorrectPog) ||
                    !this.state.exitGoogle50k ||
                    (this.state.exitGoogle50k === 'Tidak' &&
                      this.state.exitLotGoogle50k === '') ||
                    !this.state.exitGoogle100k ||
                    (this.state.exitGoogle100k === 'Tidak' &&
                      this.state.exitLotGoogle100k === '') ||
                    !this.state.exitGoogle150k ||
                    (this.state.exitGoogle150k === 'Tidak' &&
                      this.state.exitLotGoogle150k === '') ||
                    !this.state.exitGoogle300k ||
                    (this.state.exitGoogle300k === 'Tidak' &&
                      this.state.exitLotGoogle300k === '') ||
                    !this.state.exitGoogle500k ||
                    (this.state.exitGoogle500k === 'Tidak' &&
                      this.state.exitLotGoogle500k === '') ||
                    (this.state.idRetailer === 1 &&
                      !this.state.exitSpotify1m) ||
                    (this.state.idRetailer === 1 &&
                      this.state.exitSpotify1m === 'Tidak' &&
                      this.state.exitLotSpotify1m === '') ||
                    (this.state.idRetailer === 1 &&
                      !this.state.exitSpotify3m) ||
                    (this.state.idRetailer === 1 &&
                      this.state.exitSpotify3m === 'Tidak' &&
                      this.state.exitLotSpotify3m === '') ||
                    !this.state.exitPop1 ||
                    (this.state.idRetailer === 1 && !this.state.exitPop2) ||
                    this.state.exitGoogle50KSpacing === '' ||
                    this.state.exitGoogle100KSpacing === '' ||
                    this.state.exitGoogle150KSpacing === '' ||
                    this.state.exitGoogle300KSpacing === '' ||
                    this.state.exitGoogle500KSpacing === ''
                  }>
                  <Form style={{padding: 20, paddingTop: 0}}>
                    <View id="fotoExFix" style={{marginBottom: 15}}>
                      <Label>Foto Sarana Sesudah</Label>
                      {this.state.img_fixture_out ? (
                        <Image
                          source={this.state.img_fixture_out}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder-take-image.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                      <Button
                        info
                        onPress={() => this.launchCamera('img_fixture_out')}
                        style={{
                          justifyContent: 'center',
                          backgroundColor: '#0079C2',
                        }}>
                        <Text style={{color: 'white'}}>Take Photo</Text>
                      </Button>
                    </View>
                    <View id="exitFixComp" style={{marginBottom: 15}}>
                      <Label>
                        Apakah itu cocok dengan apa yang ada di aplikasi?
                      </Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitFixComp}
                          onValueChange={text =>
                            this.onValueChangeNew('exitFixComp', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitFixComp === 'Tidak' && (
                      <View id="exitCorrectFix" style={{marginBottom: 15}}>
                        <Label>Fixture yang ada dilapangan ?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitCorrectFix}
                            onValueChange={text =>
                              this.onValueChangeNew('exitCorrectFix', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.dataFixtureType.map(el => (
                              <Picker.Item
                                label={el.fixture_type}
                                value={el.id}
                                key={'fix' + el.id}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View
                      id="instockComp2"
                      style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#afbd20',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        marginBottom: 10,
                        marginTop: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Tampilan voucher saat keluar
                      </Text>
                    </View>

                    {/* EXIT SPACING */}
                    <>
                      {/* 50K */}
                      <View
                        id="exitGoogle50KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 50K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitGoogle50KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'exitGoogle50KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number.map(
                              el =>
                                this.state.limitOptionExitGoogle50KSpacing >=
                                  el && (
                                  <Picker.Item
                                    label={`${el}`}
                                    value={el}
                                    key={`exgs50${el}`}
                                  />
                                ),
                            )}
                          </Picker>
                        </Item>
                      </View>

                      {/* 100K */}
                      <View
                        id="exitGoogle100KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 100K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitGoogle100KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'exitGoogle100KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number.map(
                              el =>
                                this.state.limitOptionExitGoogle100KSpacing >=
                                  el && (
                                  <Picker.Item
                                    label={`${el}`}
                                    value={el}
                                    key={`exgs100${el}`}
                                  />
                                ),
                            )}
                          </Picker>
                        </Item>
                      </View>

                      {/* 150K */}
                      <View
                        id="exitGoogle150KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 150K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitGoogle150KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'exitGoogle150KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number.map(
                              el =>
                                this.state.limitOptionExitGoogle150KSpacing >=
                                  el && (
                                  <Picker.Item
                                    label={`${el}`}
                                    value={el}
                                    key={`exgs150${el}`}
                                  />
                                ),
                            )}
                          </Picker>
                        </Item>
                      </View>

                      {/* 300K */}
                      <View
                        id="exitGoogle300KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 300K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitGoogle300KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'exitGoogle300KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number.map(
                              el =>
                                this.state.limitOptionExitGoogle300KSpacing >=
                                  el && (
                                  <Picker.Item
                                    label={`${el}`}
                                    value={el}
                                    key={`exgs300${el}`}
                                  />
                                ),
                            )}
                          </Picker>
                        </Item>
                      </View>

                      {/* 500K */}
                      <View
                        id="exitGoogle500KSpacing"
                        style={{marginBottom: 15}}>
                        <Label>Google 500K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitGoogle500KSpacing}
                            onValueChange={text =>
                              this.onValueChangeNew(
                                'exitGoogle500KSpacing',
                                text,
                              )
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number.map(
                              el =>
                                this.state.limitOptionExitGoogle500KSpacing >=
                                  el && (
                                  <Picker.Item
                                    label={`${el}`}
                                    value={el}
                                    key={`exgs500${el}`}
                                  />
                                ),
                            )}
                          </Picker>
                        </Item>
                      </View>
                    </>

                    <View id="exitPEGComp" style={{marginBottom: 15}}>
                      <Label>Adakah gantungan yang rusak ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitPegComp}
                          onValueChange={text =>
                            this.onValueChangeNew('exitPegComp', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitPegComp === 'Iya' && (
                      <View id="exitBrokenHanger" style={{marginBottom: 15}}>
                        <Label>Berapa gantungan yang rusak ?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitBrokenHanger}
                            onValueChange={text =>
                              this.onValueChangeNew('exitBrokenHanger', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number2.map(num => (
                              <Picker.Item
                                label={`${num}`}
                                value={num}
                                key={`i${num}`}
                              />
                            ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="fotoExPOG" style={{marginBottom: 15}}>
                      <Label>Foto Planogram</Label>
                      {this.state.imgPOG1 ? (
                        <Image
                          source={{uri: `${BaseURL}/${this.state.imgPOG1}`}}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                    </View>
                    <View id="exitPOGComp" style={{marginBottom: 15}}>
                      <Label>Apakah Planogram terpasang dengan benar ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitPogComp}
                          onValueChange={text =>
                            this.onValueChangeNew('exitPogComp', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitPogComp === 'Tidak' && (
                      <View id="exitCorrectPog" style={{marginBottom: 15}}>
                        <Label>Bagaimana keadaan Planogram di lapangan ?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitCorrectPog}
                            onValueChange={text =>
                              this.onValueChangeNew('exitCorrectPog', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            <Picker.Item
                              label="Gantungan rusak / patah"
                              value="Gantungan rusak / patah"
                            />
                            <Picker.Item
                              label="Stock voucher kosong"
                              value="Stock voucher kosong"
                            />
                            <Picker.Item
                              label="Tidak ada sarana"
                              value="Tidak ada sarana"
                            />
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View
                      id="instockComp2"
                      style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#afbd20',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        marginBottom: 10,
                        marginTop: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        In-stock Compliance
                      </Text>
                    </View>

                    <View id="exitGoogle50k" style={{marginBottom: 15}}>
                      <Label>Google 50K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitGoogle50k}
                          onValueChange={text =>
                            this.onValueChangeNew('exitGoogle50k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitGoogle50k === 'Tidak' && (
                      <View id="exitLotGoogle50k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google50K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitLotGoogle50k}
                            onValueChange={text =>
                              this.onValueChangeNew('exitLotGoogle50k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el => +this.state.exitGoogle50KSpacing <= +el,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`j${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="exitGoogle100k" style={{marginBottom: 15}}>
                      <Label>Google 100K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitGoogle100k}
                          onValueChange={text =>
                            this.onValueChangeNew('exitGoogle100k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitGoogle100k === 'Tidak' && (
                      <View id="exitLotGoogle100k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google100K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitLotGoogle100k}
                            onValueChange={text =>
                              this.onValueChangeNew('exitLotGoogle100k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el => +this.state.exitGoogle100KSpacing <= +el,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`k${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="exitGoogle150k" style={{marginBottom: 15}}>
                      <Label>Google 150K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitGoogle150k}
                          onValueChange={text =>
                            this.onValueChangeNew('exitGoogle150k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitGoogle150k === 'Tidak' && (
                      <View id="exitLotGoogle150k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google150K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitLotGoogle150k}
                            onValueChange={text =>
                              this.onValueChangeNew('exitLotGoogle150k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el =>
                                  +this.state.exitGoogle150KSpacing <= +el &&
                                  +el < 10,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`l${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="exitGoogle300k" style={{marginBottom: 15}}>
                      <Label>Google 300K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitGoogle300k}
                          onValueChange={text =>
                            this.onValueChangeNew('exitGoogle300k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitGoogle300k === 'Tidak' && (
                      <View id="exitLotGoogle300k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google300K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitLotGoogle300k}
                            onValueChange={text =>
                              this.onValueChangeNew('exitLotGoogle300k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el =>
                                  +this.state.exitGoogle300KSpacing <= +el &&
                                  +el < 10,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`m${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    <View id="exitGoogle500k" style={{marginBottom: 15}}>
                      <Label>Google 500K?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitGoogle500k}
                          onValueChange={text =>
                            this.onValueChangeNew('exitGoogle500k', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.exitGoogle500k === 'Tidak' && (
                      <View id="exitLotGoogle500k" style={{marginBottom: 15}}>
                        <Label>Sisa voucher Google500K?</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.exitLotGoogle500k}
                            onValueChange={text =>
                              this.onValueChangeNew('exitLotGoogle500k', text)
                            }>
                            <Picker.Item label="Pilih opsi anda" value="" />
                            {this.state.number
                              .filter(
                                el =>
                                  +this.state.exitGoogle500KSpacing <= +el &&
                                  +el < 10,
                              )
                              .map(num => (
                                <Picker.Item
                                  label={`${num}`}
                                  value={num}
                                  key={`n${num}`}
                                />
                              ))}
                          </Picker>
                        </Item>
                      </View>
                    )}

                    {this.state.idRetailer === 1 && (
                      <>
                        <View id="exitSpotify1m" style={{marginBottom: 15}}>
                          <Label>Spotify 1m ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.exitSpotify1m}
                              onValueChange={text =>
                                this.onValueChangeNew('exitSpotify1m', text)
                              }>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>

                        {this.state.exitSpotify1m === 'Tidak' && (
                          <View
                            id="exitLotSpotify1m"
                            style={{marginBottom: 15}}>
                            <Label>Sisa voucher Spotify1M?</Label>
                            <Item picker>
                              <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{backgroundColor: '#F0F0F0'}}
                                selectedValue={this.state.exitLotSpotify1m}
                                onValueChange={text =>
                                  this.onValueChangeNew(
                                    'exitLotSpotify1m',
                                    text,
                                  )
                                }>
                                <Picker.Item label="Pilih opsi anda" value="" />
                                {this.state.number.map(num => (
                                  <Picker.Item
                                    label={`${num}`}
                                    value={num}
                                    key={`o${num}`}
                                  />
                                ))}
                              </Picker>
                            </Item>
                          </View>
                        )}

                        <View id="exitSpotify3m" style={{marginBottom: 15}}>
                          <Label>Spotify 3m ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.exitSpotify3m}
                              onValueChange={text =>
                                this.onValueChangeNew('exitSpotify3m', text)
                              }>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>

                        {this.state.exitSpotify3m === 'Tidak' && (
                          <View
                            id="exitLotSpotify3m"
                            style={{marginBottom: 15}}>
                            <Label>Sisa voucher Spotify3M?</Label>
                            <Item picker>
                              <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{backgroundColor: '#F0F0F0'}}
                                selectedValue={this.state.exitLotSpotify3m}
                                onValueChange={text =>
                                  this.onValueChangeNew(
                                    'exitLotSpotify3m',
                                    text,
                                  )
                                }>
                                <Picker.Item label="Pilih opsi anda" value="" />
                                {this.state.number.map(num => (
                                  <Picker.Item
                                    label={`${num}`}
                                    value={num}
                                    key={`p${num}`}
                                  />
                                ))}
                              </Picker>
                            </Item>
                          </View>
                        )}
                      </>
                    )}

                    <View id="fotoExPop1" style={{marginBottom: 15}}>
                      {this.state.idRetailer === 1 ? (
                        <Label>Foto Promotion 1</Label>
                      ) : (
                        <Label>Foto Promotion</Label>
                      )}
                      {this.state.imgPOP1 ? (
                        <Image
                          source={{uri: `${BaseURL}/${this.state.imgPOP1}`}}
                          style={{
                            width: '100%',
                            height: 400,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../asset/placeholder.png')}
                          style={{
                            width: '100%',
                            height: 300,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                    </View>
                    <View id="exitPop1" style={{marginBottom: 15}}>
                      {this.state.idRetailer === 1 ? (
                        <Label>
                          Apakah foto promosi 1 cocok dengan gambar diatas?
                        </Label>
                      ) : (
                        <Label>
                          Apakah foto promosi cocok dengan gambar diatas?
                        </Label>
                      )}
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{backgroundColor: '#F0F0F0'}}
                          selectedValue={this.state.exitPop1}
                          onValueChange={text =>
                            this.onValueChangeNew('exitPop1', text)
                          }>
                          <Picker.Item label="Pilih opsi anda" value="" />
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {this.state.idRetailer === 1 && (
                      <>
                        <View id="fotoPOP1" style={{marginBottom: 15}}>
                          <Label>Foto Promotion 2</Label>
                          {this.state.imgPOP2 ? (
                            <Image
                              source={{uri: `${BaseURL}/${this.state.imgPOP2}`}}
                              style={{
                                width: '100%',
                                height: 400,
                                resizeMode: 'stretch',
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../asset/placeholder.png')}
                              style={{
                                width: '100%',
                                height: 300,
                                resizeMode: 'stretch',
                              }}
                            />
                          )}
                        </View>
                        <View id="exitPop2" style={{marginBottom: 15}}>
                          <Label>
                            Apakah foto promosi 2 cocok dengan gambar diatas?
                          </Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.exitPop2}
                              onValueChange={text =>
                                this.onValueChangeNew('exitPop2', text)
                              }>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>
                      </>
                    )}
                  </Form>
                </ProgressStep>

                {/* 5 */}
                <ProgressStep
                  label=""
                  onSubmit={() => this.setState({submit: true})}
                  nextBtnTextStyle={buttonTextStyle}
                  previousBtnTextStyle={buttonTextStyle}>
                  <Form style={{padding: 20, paddingTop: 0}}>
                    <>
                      <View id="idRetailerRekap" style={{marginBottom: 15}}>
                        <Label>Retailer</Label>
                        <Input
                          value={this.state.initialRetailer}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="idStoreRekap" style={{marginBottom: 15}}>
                        <Label>Store</Label>
                        <Input
                          value={this.state.idStore}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="nameStoreRekap" style={{marginBottom: 15}}>
                        <Label>Store Name</Label>
                        <Input
                          value={this.state.nameStore}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="dcRekap" style={{marginBottom: 15}}>
                        <Label>DC/Wilayah Store</Label>
                        <Input
                          value={this.state.nameDC}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="cityRekap" style={{marginBottom: 15}}>
                        <Label>City</Label>
                        <Input
                          value={this.state.city}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="addressRekap" style={{marginBottom: 15}}>
                        <Label>Address</Label>
                        <Input
                          value={this.state.address}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="fotoTokoRekap1" style={{marginBottom: 15}}>
                        <Label>Image Store</Label>
                        <View style={{borderWidth: 0, borderColor: null}}>
                          {this.state.img_store ? (
                            <Image
                              source={this.state.img_store}
                              style={{
                                width: '100%',
                                height: 400,
                                resizeMode: 'stretch',
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../asset/placeholder-take-image.png')}
                              style={{
                                width: '100%',
                                height: 300,
                                resizeMode: 'stretch',
                              }}
                            />
                          )}
                        </View>
                      </View>

                      <View id="storeOpen" style={{marginBottom: 15}}>
                        <Label>Apakah Toko Buka</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{backgroundColor: '#F0F0F0'}}
                            selectedValue={this.state.storeOpen}
                            onValueChange={text =>
                              this.onValueChangeNew('storeOpen', text)
                            }
                            disabled>
                            <Picker.Item label="Buka" value={1} />
                            <Picker.Item label="Tutup" value={0} />
                          </Picker>
                        </Item>
                      </View>
                    </>

                    <>
                      <View id="fotoFixInRekap" style={{marginBottom: 15}}>
                        <Label>Foto Sarana Sebelum</Label>
                        <View style={{borderWidth: 0, borderColor: null}}>
                          {this.state.img_fixture_in ? (
                            <Image
                              source={this.state.img_fixture_in}
                              style={{
                                width: '100%',
                                height: 400,
                                resizeMode: 'stretch',
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../asset/placeholder-take-image.png')}
                              style={{
                                width: '100%',
                                height: 300,
                                resizeMode: 'stretch',
                              }}
                            />
                          )}
                        </View>
                      </View>
                      <View id="entryFixCompRekap" style={{marginBottom: 15}}>
                        <Label>
                          Apakah itu cocok dengan apa yang ada di aplikasi?
                        </Label>
                        <Input
                          value={this.state.entryFixComp}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryFixComp === 'Tidak' && (
                        <View
                          id="rekapEntryCorrectFix"
                          style={{marginBottom: 15}}>
                          <Label>Fixture yang ada dilapangan ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.entryCorrectFix}
                              onValueChange={text =>
                                this.onValueChangeNew('entryCorrectFix', text)
                              }
                              disabled>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              {this.state.dataFixtureType.map(el => (
                                <Picker.Item
                                  label={el.fixture_type}
                                  value={el.id}
                                  key={'fix' + el.id}
                                />
                              ))}
                            </Picker>
                          </Item>
                        </View>
                      )}

                      <View
                        id="voucherIn"
                        style={{
                          height: 50,
                          width: '100%',
                          backgroundColor: '#afbd20',
                          justifyContent: 'center',
                          paddingLeft: 10,
                          marginBottom: 10,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Tampilan voucher saat masuk
                        </Text>
                      </View>

                      <View
                        id="entryGoogle50KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 50K ?</Label>
                        <Input
                          value={'' + this.state.entryGoogle50KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View
                        id="entryGoogle100KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 100K ?</Label>
                        <Input
                          value={'' + this.state.entryGoogle100KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View
                        id="entryGoogle150KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 150K ?</Label>
                        <Input
                          value={'' + this.state.entryGoogle150KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View
                        id="entryGoogle300KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 300K ?</Label>
                        <Input
                          value={'' + this.state.entryGoogle300KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View
                        id="entryGoogle500KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 500K ?</Label>
                        <Input
                          value={'' + this.state.entryGoogle500KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View id="entryPEGCompRekap" style={{marginBottom: 15}}>
                        <Label>Adakah gantungan yang rusak ?</Label>
                        <Input
                          value={this.state.entryPegComp}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryPegComp === 'Iya' && (
                        <View id="entryBrokenHanger" style={{marginBottom: 15}}>
                          <Label>Berapa gantungan yang rusak ?</Label>
                          <Input
                            value={'' + this.state.entryBrokenHanger}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      <View id="fotoPOGRekap1" style={{marginBottom: 15}}>
                        <Label>Foto Planogram</Label>
                        {this.state.imgPOG1 ? (
                          <Image
                            source={{uri: `${BaseURL}/${this.state.imgPOG1}`}}
                            style={{
                              width: '100%',
                              height: 400,
                              resizeMode: 'stretch',
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../asset/placeholder.png')}
                            style={{
                              width: '100%',
                              height: 300,
                              resizeMode: 'stretch',
                            }}
                          />
                        )}
                      </View>
                      <View id="entryPOGCompRekap" style={{marginBottom: 15}}>
                        <Label>Apakah Planogram terpasang dengan benar ?</Label>
                        <Input
                          value={this.state.entryPogComp}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryPogComp === 'Tidak' && (
                        <View
                          id="entryCorrectPogRekap"
                          style={{marginBottom: 15}}>
                          <Label>
                            Bagaimana keadaan Planogram di lapangan ?
                          </Label>
                          <Input
                            value={this.state.entryCorrectPogRekap}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      <View
                        id="instockCompRekap1"
                        style={{
                          height: 50,
                          width: '100%',
                          backgroundColor: '#afbd20',
                          justifyContent: 'center',
                          paddingLeft: 10,
                          marginBottom: 10,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          In-stock Compliance
                        </Text>
                      </View>
                      <View id="entryGoogle50kRekap" style={{marginBottom: 15}}>
                        <Label>Google 50K?</Label>
                        <Input
                          value={this.state.entryGoogle50k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryGoogle50k === 'Tidak' && (
                        <View id="entryLotGoogle50k" style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google50K?</Label>
                          <Input
                            value={'' + this.state.entryLotGoogle50k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      <View
                        id="entryGoogle100kRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 100K?</Label>
                        <Input
                          value={this.state.entryGoogle100k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryGoogle100k === 'Tidak' && (
                        <View
                          id="entryLotGoogle100k"
                          style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google100K?</Label>
                          <Input
                            value={'' + this.state.entryLotGoogle100k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      <View
                        id="entryGoogle150kRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 150K?</Label>
                        <Input
                          value={this.state.entryGoogle150k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryGoogle150k === 'Tidak' && (
                        <View
                          id="entryLotGoogle150k"
                          style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google150K?</Label>
                          <Input
                            value={'' + this.state.entryLotGoogle150k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      <View
                        id="entryGoogle300kRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 300K?</Label>
                        <Input
                          value={this.state.entryGoogle300k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryGoogle300k === 'Tidak' && (
                        <View
                          id="entryLotGoogle300k"
                          style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google300K?</Label>
                          <Input
                            value={'' + this.state.entryLotGoogle300k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      <View
                        id="entryGoogle500kRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 500K?</Label>
                        <Input
                          value={this.state.entryGoogle500k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.entryGoogle500k === 'Tidak' && (
                        <View
                          id="entryLotGoogle500k"
                          style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google500K?</Label>
                          <Input
                            value={'' + this.state.entryLotGoogle500k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}
                      {this.state.idRetailer === 1 && (
                        <>
                          <View
                            id="entrySpotify1mRekap"
                            style={{marginBottom: 15}}>
                            <Label>Spotify 1m ?</Label>
                            <Input
                              value={this.state.entrySpotify1m}
                              style={{backgroundColor: '#F0F0F0'}}
                              disabled
                            />
                          </View>

                          {this.state.entrySpotify1m === 'Tidak' && (
                            <View
                              id="entryLotSpotify1m"
                              style={{marginBottom: 15}}>
                              <Label>Sisa voucher Spotify1m?</Label>
                              <Input
                                value={'' + this.state.entryLotSpotify1m}
                                style={{backgroundColor: '#F0F0F0'}}
                                disabled
                              />
                            </View>
                          )}

                          <View
                            id="entrySpotify3mRekap"
                            style={{marginBottom: 15}}>
                            <Label>Spotify 3m ?</Label>
                            <Input
                              value={this.state.entrySpotify3m}
                              style={{backgroundColor: '#F0F0F0'}}
                              disabled
                            />
                          </View>

                          {this.state.entrySpotify3m === 'Tidak' && (
                            <View
                              id="entryLotSpotify3m"
                              style={{marginBottom: 15}}>
                              <Label>Sisa voucher Spotify3m?</Label>
                              <Input
                                value={'' + this.state.entryLotSpotify3m}
                                style={{backgroundColor: '#F0F0F0'}}
                                disabled
                              />
                            </View>
                          )}
                        </>
                      )}
                      <View id="fotoPop1Rekap1" style={{marginBottom: 15}}>
                        {this.state.idRetailer === 1 ? (
                          <Label>Foto Promotion 1</Label>
                        ) : (
                          <Label>Foto Promotion</Label>
                        )}
                        {this.state.imgPOP1 ? (
                          <Image
                            source={{uri: `${BaseURL}/${this.state.imgPOP1}`}}
                            style={{
                              width: '100%',
                              height: 400,
                              resizeMode: 'stretch',
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../asset/placeholder.png')}
                            style={{
                              width: '100%',
                              height: 300,
                              resizeMode: 'stretch',
                            }}
                          />
                        )}
                      </View>
                      <View id="entryPop1Rekap" style={{marginBottom: 15}}>
                        {this.state.idRetailer === 1 ? (
                          <Label>
                            Apakah foto promosi 1 cocok dengan gambar diatas?
                          </Label>
                        ) : (
                          <Label>
                            Apakah foto promosi cocok dengan gambar diatas?
                          </Label>
                        )}
                        <Input
                          value={this.state.entryPop1}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      {this.state.idRetailer === 1 && (
                        <>
                          <View id="fotoPOP2Rekap2" style={{marginBottom: 15}}>
                            <Label>Foto Promotion 2</Label>
                            {this.state.imgPOP2 ? (
                              <Image
                                source={{
                                  uri: `${BaseURL}/${this.state.imgPOP2}`,
                                }}
                                style={{
                                  width: '100%',
                                  height: 400,
                                  resizeMode: 'stretch',
                                }}
                              />
                            ) : (
                              <Image
                                source={require('../asset/placeholder.png')}
                                style={{
                                  width: '100%',
                                  height: 300,
                                  resizeMode: 'stretch',
                                }}
                              />
                            )}
                          </View>
                          <View id="entryPop2Rekap" style={{marginBottom: 15}}>
                            <Label>
                              Apakah foto promosi 2 cocok dengan gambar diatas?
                            </Label>
                            <Input
                              value={this.state.entryPop2}
                              style={{backgroundColor: '#F0F0F0'}}
                              disabled
                            />
                          </View>
                        </>
                      )}
                      <View
                        id="knowledge"
                        style={{
                          height: 50,
                          width: '100%',
                          backgroundColor: '#afbd20',
                          justifyContent: 'center',
                          paddingLeft: 10,
                          marginBottom: 10,
                          marginTop: 5,
                        }}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>
                          Knowledge
                        </Text>
                      </View>
                      <View id="giftCardRekap" style={{marginBottom: 15}}>
                        <Label>
                          Apakah staf tahu cara mengaktifkan kartu hadiah ?
                        </Label>
                        <Input
                          value={this.state.giftCard}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="aktifPORRekap" style={{marginBottom: 15}}>
                        <Label>Apakah staf tahu cara mengaktifkan POR ?</Label>
                        <Input
                          value={this.state.aktifPOR}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View id="changeCardGiftRekap" style={{marginBottom: 15}}>
                        <Label>
                          Apakah staf tahu bagaimana menangani keluhan pelanggan
                          tentang penukaran kartu hadiah ?
                        </Label>
                        <Input
                          value={this.state.changeCardGift}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                    </>

                    <>
                      <View id="fotoFixOutRekap" style={{marginBottom: 15}}>
                        <Label>Foto Sarana Sesudah</Label>
                        <View style={{borderWidth: 0, borderColor: null}}>
                          {this.state.img_fixture_out ? (
                            <Image
                              source={this.state.img_fixture_out}
                              style={{
                                width: '100%',
                                height: 400,
                                resizeMode: 'stretch',
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../asset/placeholder-take-image.png')}
                              style={{
                                width: '100%',
                                height: 300,
                                resizeMode: 'stretch',
                              }}
                            />
                          )}
                        </View>
                      </View>
                      <View id="exitFixCompRekap" style={{marginBottom: 15}}>
                        <Label>
                          Apakah itu cocok dengan apa yang ada di aplikasi?
                        </Label>
                        <Input
                          value={this.state.exitFixComp}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitFixComp === 'Tidak' && (
                        <View
                          id="rekapExitCorrectFix"
                          style={{marginBottom: 15}}>
                          <Label>Fixture yang ada dilapangan ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{backgroundColor: '#F0F0F0'}}
                              selectedValue={this.state.exitCorrectFix}
                              onValueChange={text =>
                                this.onValueChangeNew('exitCorrectFix', text)
                              }
                              disabled>
                              <Picker.Item label="Pilih opsi anda" value="" />
                              {this.state.dataFixtureType.map(el => (
                                <Picker.Item
                                  label={el.fixture_type}
                                  value={el.id}
                                  key={'fix' + el.id}
                                />
                              ))}
                            </Picker>
                          </Item>
                        </View>
                      )}

                      <View
                        id="voucherOut"
                        style={{
                          height: 50,
                          width: '100%',
                          backgroundColor: '#afbd20',
                          justifyContent: 'center',
                          paddingLeft: 10,
                          marginBottom: 10,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Tampilan voucher saat keluar
                        </Text>
                      </View>

                      <View
                        id="exitGoogle50KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 50K ?</Label>
                        <Input
                          value={'' + this.state.exitGoogle50KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View
                        id="exitGoogle100KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 100K ?</Label>
                        <Input
                          value={'' + this.state.exitGoogle100KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View
                        id="exitGoogle150KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 150K ?</Label>
                        <Input
                          value={'' + this.state.exitGoogle150KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>
                      <View
                        id="exitGoogle300KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 300K ?</Label>
                        <Input
                          value={'' + this.state.exitGoogle300KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View
                        id="exitGoogle500KSpacingRekap"
                        style={{marginBottom: 15}}>
                        <Label>Google 500K ?</Label>
                        <Input
                          value={'' + this.state.exitGoogle500KSpacing}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      <View id="exitPEGCompRekap" style={{marginBottom: 15}}>
                        <Label>Adakah gantungan yang rusak ?</Label>
                        <Input
                          value={this.state.exitPegComp}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitPegComp === 'Iya' && (
                        <View id="exitBrokenHanger" style={{marginBottom: 15}}>
                          <Label>Berapa gantungan yang rusak ?</Label>
                          <Input
                            value={'' + this.state.exitBrokenHanger}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      <View id="fotoPOGRekap2" style={{marginBottom: 15}}>
                        <Label>Foto Planogram</Label>
                        {this.state.imgPOG1 ? (
                          <Image
                            source={{uri: `${BaseURL}/${this.state.imgPOG1}`}}
                            style={{
                              width: '100%',
                              height: 400,
                              resizeMode: 'stretch',
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../asset/placeholder.png')}
                            style={{
                              width: '100%',
                              height: 300,
                              resizeMode: 'stretch',
                            }}
                          />
                        )}
                      </View>
                      <View id="exitPOGCompRekap" style={{marginBottom: 15}}>
                        <Label>Apakah Planogram terpasang dengan benar ?</Label>
                        <Input
                          value={this.state.exitPogComp}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitPogComp === 'Tidak' && (
                        <View
                          id="exitCorrectPogRekap"
                          style={{marginBottom: 15}}>
                          <Label>
                            Bagaimana keadaan Planogram di lapangan ?
                          </Label>
                          <Input
                            value={this.state.exitCorrectPogRekap}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      <View
                        id="instockCompRekap2"
                        style={{
                          height: 50,
                          width: '100%',
                          backgroundColor: '#afbd20',
                          justifyContent: 'center',
                          paddingLeft: 10,
                          marginBottom: 10,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          In-stock Compliance
                        </Text>
                      </View>

                      <View id="exitGoogle50kRekap" style={{marginBottom: 15}}>
                        <Label>Google 50K?</Label>
                        <Input
                          value={this.state.exitGoogle50k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitGoogle50k === 'Tidak' && (
                        <View id="exitLotGoogle50k" style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google50K?</Label>
                          <Input
                            value={'' + this.state.exitLotGoogle50k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      <View id="exitGoogle100kRekap" style={{marginBottom: 15}}>
                        <Label>Google 100K?</Label>
                        <Input
                          value={this.state.exitGoogle100k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitGoogle100k === 'Tidak' && (
                        <View id="exitLotGoogle100k" style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google100K?</Label>
                          <Input
                            value={'' + this.state.exitLotGoogle100k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      <View id="exitGoogle150kRekap" style={{marginBottom: 15}}>
                        <Label>Google 150K?</Label>
                        <Input
                          value={this.state.exitGoogle150k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitGoogle150k === 'Tidak' && (
                        <View id="exitLotGoogle150k" style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google150K?</Label>
                          <Input
                            value={'' + this.state.exitLotGoogle150k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      <View id="exitGoogle300kRekap" style={{marginBottom: 15}}>
                        <Label>Google 300K?</Label>
                        <Input
                          value={this.state.exitGoogle300k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitGoogle300k === 'Tidak' && (
                        <View id="exitLotGoogle300k" style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google300K?</Label>
                          <Input
                            value={'' + this.state.exitLotGoogle300k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      <View id="exitGoogle500kRekap" style={{marginBottom: 15}}>
                        <Label>Google 500K?</Label>
                        <Input
                          value={this.state.exitGoogle500k}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.exitGoogle500k === 'Tidak' && (
                        <View id="exitLotGoogle500k" style={{marginBottom: 15}}>
                          <Label>Sisa voucher Google500K?</Label>
                          <Input
                            value={'' + this.state.exitLotGoogle500k}
                            style={{backgroundColor: '#F0F0F0'}}
                            disabled
                          />
                        </View>
                      )}

                      {this.state.idRetailer === 1 && (
                        <>
                          <View
                            id="exitSpotify1mRekap"
                            style={{marginBottom: 15}}>
                            <Label>Spotify 1m ?</Label>
                            <Input
                              value={this.state.exitSpotify1m}
                              style={{backgroundColor: '#F0F0F0'}}
                              disabled
                            />
                          </View>

                          {this.state.exitSpotify1m === 'Tidak' && (
                            <View
                              id="exitLotSpotify1m"
                              style={{marginBottom: 15}}>
                              <Label>Sisa voucher Spotify1M?</Label>
                              <Input
                                value={'' + this.state.exitLotSpotify1m}
                                style={{backgroundColor: '#F0F0F0'}}
                                disabled
                              />
                            </View>
                          )}

                          <View
                            id="exitSpotify3mRekap"
                            style={{marginBottom: 15}}>
                            <Label>Spotify 3m ?</Label>
                            <Input
                              value={this.state.exitSpotify3m}
                              style={{backgroundColor: '#F0F0F0'}}
                              disabled
                            />
                          </View>

                          {this.state.exitSpotify3m === 'Tidak' && (
                            <View
                              id="exitLotSpotify3m"
                              style={{marginBottom: 15}}>
                              <Label>Sisa voucher Spotify3M?</Label>
                              <Input
                                value={'' + this.state.exitLotSpotify3m}
                                style={{backgroundColor: '#F0F0F0'}}
                                disabled
                              />
                            </View>
                          )}
                        </>
                      )}

                      <View id="fotoPop1Rekap" style={{marginBottom: 15}}>
                        {this.state.idRetailer === 1 ? (
                          <Label>Foto Promotion 1</Label>
                        ) : (
                          <Label>Foto Promotion</Label>
                        )}
                        {this.state.imgPOP1 ? (
                          <Image
                            source={{uri: `${BaseURL}/${this.state.imgPOP1}`}}
                            style={{
                              width: '100%',
                              height: 400,
                              resizeMode: 'stretch',
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../asset/placeholder.png')}
                            style={{
                              width: '100%',
                              height: 300,
                              resizeMode: 'stretch',
                            }}
                          />
                        )}
                      </View>
                      <View id="exitPop1Rekap" style={{marginBottom: 15}}>
                        {this.state.idRetailer === 1 ? (
                          <Label>
                            Apakah foto promosi 1 cocok dengan gambar diatas?
                          </Label>
                        ) : (
                          <Label>
                            Apakah foto promosi cocok dengan gambar diatas?
                          </Label>
                        )}
                        <Input
                          value={this.state.exitPop1}
                          style={{backgroundColor: '#F0F0F0'}}
                          disabled
                        />
                      </View>

                      {this.state.idRetailer === 1 && (
                        <>
                          <View id="fotoPOP2Rekap2" style={{marginBottom: 15}}>
                            <Label>Foto Promotion 2</Label>
                            {this.state.imgPOP2 ? (
                              <Image
                                source={{
                                  uri: `${BaseURL}/${this.state.imgPOP2}`,
                                }}
                                style={{
                                  width: '100%',
                                  height: 400,
                                  resizeMode: 'stretch',
                                }}
                              />
                            ) : (
                              <Image
                                source={require('../asset/placeholder.png')}
                                style={{
                                  width: '100%',
                                  height: 300,
                                  resizeMode: 'stretch',
                                }}
                              />
                            )}
                          </View>
                          <View id="exitPop2Rekap" style={{marginBottom: 15}}>
                            <Label>
                              Apakah foto promosi 2 cocok dengan gambar diatas?
                            </Label>
                            <Input
                              value={this.state.exitPop2}
                              style={{backgroundColor: '#F0F0F0'}}
                              disabled
                            />
                          </View>
                        </>
                      )}
                    </>
                  </Form>
                </ProgressStep>
              </ProgressSteps>
            </ScrollView>
          </View>
        </View>

        <Popover
          isVisible={this.state.isVisible}
          fromView={this.touchable}
          onRequestClose={() => this.closePopover()}>
          <List>
            {this.state.dataNotification.map(element => (
              <ListItem
                selected
                key={element.id}
                onPress={() =>
                  this.handleOpenNotif(
                    element.id,
                    `${BaseURL}/${element.path_file}`,
                  )
                }
                style={{
                  dispaly: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>{element.message}</Text>
                {Number(element.read) === 0 && (
                  <Badge style={{marginLeft: 10, height: 10}} />
                )}
              </ListItem>
            ))}
          </List>
        </Popover>

        {this.state.loading && (
          <View style={styles.loading}>
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <ActivityIndicator size="large" color="#0079C2" />
            </View>
          </View>
        )}
      </>
    );
  }
}

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },

  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: '100%',
    paddingHorizontal: 8,
  },
  input: {maxHeight: 40},
  inputContainer: {
    display: 'flex',
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c7c6c1',
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: '5%',
    width: '100%',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  plus: {
    position: 'absolute',
    left: 15,
    top: 10,
  },
});

const mapStateToProps = ({user_id}) => {
  return {
    user_id,
  };
};
export default connect(mapStateToProps)(AddVisit);
