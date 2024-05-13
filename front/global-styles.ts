import {StyleSheet} from "react-native";
const defaultText = {
  color: '#999999',
}
const whiteText = {
  color: '#ffffff',
}
export default StyleSheet.create({
  defaultText,
  whiteText,
  input: {
    ...defaultText,
    borderBottomWidth: 2,
    borderColor: '#999999',
    fontSize: 15
  },
  wrap: {
    flexWrap: 'wrap',
  },
  rowAlignHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowAlignWCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowAlignWLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  columnAlignHCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  alignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignEndBetween: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  alignCenterBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alignCenterEnd: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tAlignCenter: {
    textAlign: 'center',
  },
  tWhiteUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: 'white'
  },
  borderDash1: {
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  top: {
    height: 87,
    backgroundColor: '#165738',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  tabs: {
    flex: 0.07,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  bottomContainer: {
    marginTop: 7,
    flex: 0.15,
    backgroundColor: '#262626',
    width: '90%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  button: {
    fontSize: 17,
    ...whiteText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  middleContainer: {
    width: '100%',
    height: 43,
    alignItems: 'center',
    marginTop: -45
  },
  buttonContainer: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  buttonEnabledContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  }
});