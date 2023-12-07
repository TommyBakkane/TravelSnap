export interface Post {
    id: string;
    image: string;
    caption: string;
    likes: number;
    dislikes: number;
    comments: string[];
    timestamp: Int16Array;
  }