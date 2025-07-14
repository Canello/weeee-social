# Weeee Social App

A React Native social app built with Expo where users can share ideas and gather interest from their followers. Think of it as a platform for turning ideas into events!

## Features

### Current Features
- **Feed**: View ideas from people you follow
- **Create Ideas**: Share your ideas with title, description, category, and tags
- **Express Interest**: Show interest in ideas you like
- **Like Ideas**: Like ideas to show appreciation
- **Explore**: Discover new ideas and creators
- **Profile**: View your profile and manage your ideas
- **Search & Filter**: Search ideas and filter by categories

### Planned Features (Future)
- **Event Organization**: Idea creators can pick interested people and organize events
- **Real-time Notifications**: Get notified when someone shows interest in your ideas
- **Comments & Discussions**: Comment on ideas and engage in discussions
- **User Authentication**: Secure login and registration system
- **Push Notifications**: Real-time updates and reminders

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Vector Icons** for icons
- **Expo Linear Gradient** for beautiful gradients

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── IdeaCard.tsx    # Card component for displaying ideas
├── screens/            # App screens
│   ├── FeedScreen.tsx      # Main feed screen
│   ├── ExploreScreen.tsx   # Explore and search screen
│   ├── CreateIdeaScreen.tsx # Create new idea screen
│   ├── ProfileScreen.tsx   # User profile screen
│   └── IdeaDetailScreen.tsx # Idea detail screen
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── utils/              # Utility functions
│   └── mockData.ts     # Mock data for development
└── hooks/              # Custom React hooks (future use)
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weeee-social
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

## App Flow

1. **Feed Screen**: Users see ideas from people they follow
2. **Create Idea**: Users can create new ideas with rich details
3. **Express Interest**: Followers can show interest in ideas
4. **Explore**: Discover new ideas and creators
5. **Profile**: Manage your ideas and view your activity

## Data Models

### User
- Basic profile information (name, username, avatar, bio)
- Followers and following lists
- Created ideas

### Idea
- Title and description
- Category and tags
- Creator information
- Interest count and likes
- Optional image

### Interest
- User's interest status in an idea
- Optional message
- Timestamp

## Development Notes

- Currently using mock data for development
- All interactions are simulated (likes, interests, etc.)
- Navigation is fully functional
- UI is responsive and follows modern design patterns

## Future Enhancements

1. **Backend Integration**: Connect to a real backend API
2. **Authentication**: Implement user authentication
3. **Real-time Features**: Add real-time updates and notifications
4. **Event Management**: Allow idea creators to organize events
5. **Advanced Search**: Implement advanced search and filtering
6. **Social Features**: Add comments, sharing, and more social interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 