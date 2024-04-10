import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import globalStyles from "../global-styles";
import {months} from "../constants/months";
import {getDateCode} from "../utils/date";
import {MarkedDates} from "react-native-calendars/src/types";
import PropTypes from "prop-types";

LocaleConfig.locales['ru'] = {
  monthNames: months,
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр', 'Май', 'Июн.', 'Июл.', 'Авг', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
  today: "Сегодня"
};

LocaleConfig.defaultLocale = 'ru';

interface Props {
  visible: boolean;
  maxDate: string;
  onClose: () => void;
  onChange: (payload: any) => void;
  onPressDay: (payload: any) => void;
}

const CalendarModal = (props: Props) => {
  const { visible, maxDate, onClose, onChange, onPressDay } = props;
  const [startValue, setStartValue] = useState<any>();
  const [finishValue, setFinishValue] = useState<any>();

  const getDateFromTimestamp = (value: number) => getDateCode(new Date(value));

  const getPeriod = (startTimestamp: number, endTimestamp: number) => {
    const period: MarkedDates = {}

    let currentTimestamp = startTimestamp

    while (currentTimestamp < endTimestamp) {
      const dateString = getDateFromTimestamp(currentTimestamp)

      const startingDay = currentTimestamp === startTimestamp

      period[dateString] = {
        color: startingDay ? '#4fc03073' : '#165738',
        startingDay,
        customContainerStyle:  { borderRadius: 4 }
      }

      currentTimestamp += 24 * 60 * 60 * 1000
    }

    period[getDateFromTimestamp(endTimestamp)] = {
      color: '#4fc03073',
      endingDay: true,
      customContainerStyle:  { borderRadius: 4 }
    }

    return period
  }

  const period = useMemo(() => {
    if (startValue !== undefined && finishValue === undefined) {
      const dateString = getDateFromTimestamp(startValue)
      return {
        [dateString]: {
          color: '#4fc03073',
          endingDay: true,
          startingDay: true,
          customContainerStyle: { borderRadius: 4 }
        }
      }
    } else if (finishValue !== undefined && startValue !== undefined) {
      return getPeriod(startValue, finishValue)
    }
  }, [startValue, finishValue])


  const onDayPress = (dayObj: DateData) => {
    if (onPressDay) {
      onPressDay(dayObj)
      return
    }
    const {day, month, year} = dayObj;

    const timestamp = new Date(year, month - 1, day).getTime();

    if (
      startValue === undefined ||
      (startValue !== undefined && finishValue !== undefined)
    ) {
      setStartValue(timestamp);
      setFinishValue(undefined);
    } else {
      if (startValue > timestamp) {
        setStartValue(timestamp);
        setFinishValue(startValue);
      } else {
        setFinishValue(timestamp);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={() => onClose()}
    >
      <Pressable
        style={{
          flex: 1,
          ...styles.alignCenter,
          marginTop: 22,
        }}
        onPress={() => onClose()}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: '90%',
              height: '60%',
              maxHeight: 420,
              margin: 20,
              backgroundColor: '#363636',
              borderRadius: 20,
              padding: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              ...styles.alignCenterBetween,
            }}
          >
            <Calendar
              theme={{
                backgroundColor: '#363636',
                calendarBackground: '#363636',
                textDisabledColor: 'rgba(239,230,230,0.1)',
                disabledArrowColor: '#1e1e1e',
                disabledDotColor: '#1e1e1e',
                contentStyle: {
                  backgroundColor: '#363636',
                },
              }}
              style={{
                width: 320,
                height: 320,
                backgroundColor: '#363636',
              }}
              markingType={'period'}
              maxDate={maxDate}
              markedDates={period}
              futureScrollRange={5}
              onDayPress={onDayPress}
            />
            <View
              style={{
                marginBottom: 10,
                width: '100%',
                ...styles.rowAlignWCenter
              }}
            >
              <Text
                style={{
                  width: 70,
                  color: '#165738',
                  fontSize: 14,
                }}
                onPress={() => {
                  if (!startValue && !finishValue) {
                    return;
                  }
                  const params = [startValue, finishValue].filter(e => e).map(e => getDateCode(new Date(e)))

                  onChange(params)
                  onClose()
                }}
              >ОК</Text>
              <Text
                style={{
                  width: 70,
                  color: '#165738',
                  fontSize: 14,
                }}
                onPress={() => onClose()}
              >ОТМЕНА</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...globalStyles,
});

Calendar.propTypes = {
  onChange: PropTypes.func,
}

export default CalendarModal;