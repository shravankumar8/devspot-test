type BaseDevAccountCard = {
  icon: React.JSX.Element;
  label: string;
  value: string;
  connected: boolean;
};

type DevAccountPostCard = BaseDevAccountCard & {
  url: string;
  method: "POST";
  data: any;
};

type DevAccountGetCard = BaseDevAccountCard & {
  url: string;
  method: "GET";
};

export type DevAccountInfo = DevAccountPostCard | DevAccountGetCard;
