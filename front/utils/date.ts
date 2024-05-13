import {months} from "../constants/months";

export const formatDate = (date: Date = new Date(), year: boolean = true, time = false): string => {
  return [
    `${`0${date.getDate()}`.substr(-2)}.${`0${date.getMonth() + 1}`.substr(-2)}${year ? `.${date.getFullYear()}` : ''}`,
    time && `${`0${date.getHours()}`.substr(-2)}:${`0${date.getMinutes()}`.substr(-2)}`
  ].filter(e => e).join(' ');
}

export const formatTime = (date: Date = new Date(), shift = 0): string => {
  return `${`0${date.getHours() - shift}`.substr(-2)}:${`0${date.getMinutes()}`.substr(-2)}`;
}
export const getDateCode = (date: Date = new Date) => {
  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.substr(-2)}-${`0${date.getDate()}`.substr(-2)}`;
}

export const formatMonth = (month: number): string => months[month]