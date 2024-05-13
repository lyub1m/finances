import SettingsScreen from "../screens/Settings";
import AccountsScreen from "../screens/Accounts";
import GraphicsScreen from "../screens/Graphics";
import RegularPaymentsStackScreen from "../screens/RegularPaymentsStack";
import RemindersScreen from "../screens/Reminders";
import NotificationsScreen from "../screens/Notifications";
import HomeStackScreen from "../screens/HomeStack";
import CategoriesStackScreen from "../screens/CategoriesStack";
import AccountsStackScreen from "../screens/AccountsStack";

interface menuItem {
  name: string,
  title: string,
  iconType: string,
  iconName: string,
  component: any,
}

export const MENU_ITEMS: menuItem[] = [
  {
    name:'homeStack',
    title:'Главная',
    iconType:'Material',
    iconName:'home',
    component: HomeStackScreen,
  },
  {
    name:'accountsStack',
    title:'Счета',
    iconType:'Material',
    iconName:'piggy-bank',
    component: AccountsStackScreen,
  },
  {
    name:'categoriesStack',
    title:'Категории',
    iconType:'Material',
    iconName:'format-list-bulleted-type',
    component: CategoriesStackScreen,
  },
  {
    name:'regularPaymentsStack',
    title:'Регулярные платежи',
    iconType:'Material',
    iconName:'reminder',
    component: RegularPaymentsStackScreen,
  },
  {
    name:'notifications',
    title:'Уведомления',
    iconType:'Material',
    iconName:'android-messages',
    component: NotificationsScreen,
  },
  // {
  //   name:'reminders',
  //   title:'Напоминания',
  //   iconType:'Material',
  //   iconName:'alarm',
  //   component: RemindersScreen,
  // },
  // {
  //   name:'graphics',
  //   title:'Графики',
  //   iconType:'Material',
  //   iconName:'graph',
  //   component: GraphicsScreen,
  // },
  {
    name:'settings',
    title:'Настройки',
    iconType:'Material',
    iconName:'table-settings',
    component: SettingsScreen,
  },
]