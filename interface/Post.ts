export interface Post {
    id: string;
    userId: string;
    image: string;
    caption: string;
    likes: number;
    likedBy: string[];
    dislikes: number;
    dislikedBy: string[];
    comments: string[];
    commentedBy: string[];
    timestamp: Int16Array;
    location: string;
  }