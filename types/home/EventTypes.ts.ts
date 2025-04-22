export interface EventCard {
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
}

export interface EventCardListProps {
  events: EventCard[];
}
