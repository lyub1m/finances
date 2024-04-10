import {months} from "../constants/months";

export const formatDate = (date: Date = new Date(), year: boolean = true): string => {
  return `${`0${date.getDate()}`.substr(-2)}.${`0${date.getMonth() + 1}`.substr(-2)}${year ? `.${date.getFullYear()}` : ''}`;
}
export const getDateCode = (date: Date = new Date) => {
  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.substr(-2)}-${`0${date.getDate()}`.substr(-2)}`;
}

export const formatMonth = (month: number): string => months[month]