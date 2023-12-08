export interface Post {
    id: string;
    userId: string;
    image: string;
    caption: string;
    likes: number;
    likedBy: string[];
    dislikes: number;
    dislikedBy: string[];
    comments: Comment[];
    location: string;
  }

export interface Comment{
    comment:string;
    user: string;
}
