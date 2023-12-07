interface FeedCardProps {
    post: {
      id: string;
      image: string;
      caption: string;
      likes: number;
      dislikes: number;
      comments: string[];
      // Add other attributes here as needed
    };
    onLike: (id: string) => void;
    onDislike: (id: string) => void;
    onComment: (id: string, comment: string) => void;
  }

  export default FeedCardProps;