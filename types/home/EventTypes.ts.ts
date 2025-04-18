export interface EventCardListProps {
  events: {
    imgLink: string;
    imgAlt: string;
    title: string;
    date: {
      day: string;
      time: string;
    };
    status: string;
    location: string;
    followersCount: string;
  }[];
}
