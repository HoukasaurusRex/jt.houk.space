export interface Notification {
  id: string
  title: string
  description: string
  link: string
}

export const notifications: Notification[] = [
  {
    id: 'unhcr-tigray-refugees',
    title: 'Help Refugees in Tigray',
    description:
      "Donate to UNHCR to help thousands of refugees flee ongoing fighting in Ethiopia's Tigray region to seek safety in eastern Sudan.",
    link: 'https://donate.unhcr.org/int/ethiopia-emergency/~my-donation#step-1',
  },
  {
    id: 'irc-afghan-refugees',
    title: 'Help Refugees in Afghanistan',
    description:
      'Donate to the IRC to provide humanitarian aid and resettlement resources to Afghan refugees',
    link: 'https://help.rescue.org/donate/afghanistan',
  },
]
