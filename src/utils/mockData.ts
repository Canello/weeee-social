import { User, Idea, FeedItem, Event } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alice_dev',
    displayName: 'Alice Developer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionate about building amazing apps.\n\nI love working with React Native, TypeScript, and all things mobile.\n\nIn my free time, I enjoy hiking, reading sci-fi novels, and exploring new technologies.\n\nLet\'s connect and create something awesome together!\n\nThis is a fifth line to ensure the bio is long enough to test the collapse feature.',
    followers: ['2', '3', '4', '5'],
    following: ['2', '3', '4'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'bob_creator',
    displayName: 'Bob Creator',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Creative mind always thinking of new ideas.\n\nI\'m passionate about art, design, and technology.\n\nI believe in lifelong learning and sharing knowledge.\n\nFeel free to reach out for collaborations or just to chat!\n\nHere is a fifth line to make this bio long enough for testing.',
    followers: ['1', '3', '6'],
    following: ['1', '4'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    username: 'charlie_innovator',
    displayName: 'Charlie Innovator',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Innovation is my middle name',
    followers: ['1', '2', '5'],
    following: ['1', '2', '7'],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    username: 'dana_visionary',
    displayName: 'Dana Visionary',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Turning dreams into reality',
    followers: ['1', '5', '6'],
    following: ['2', '3', '7'],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '5',
    username: 'eve_maker',
    displayName: 'Eve Maker',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Making things happen, one project at a time.\n\nI love to tinker, build, and bring ideas to life.\n\nAlways looking for new challenges and opportunities.\n\nLet\'s collaborate and make something great!\n\nThis is a fifth line for testing the bio collapse.',
    followers: ['3', '4', '7'],
    following: ['1', '6', '8'],
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '6',
    username: 'frank_builder',
    displayName: 'Frank Builder',
    avatar: 'https://i.pravatar.cc/150?img=6',
    bio: 'Building bridges and communities',
    followers: ['2', '4', '8'],
    following: ['5', '7', '9'],
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '7',
    username: 'grace_organizer',
    displayName: 'Grace Organizer',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: 'Organizing events and people',
    followers: ['4', '5', '6'],
    following: ['8', '9', '10'],
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '8',
    username: 'hank_enthusiast',
    displayName: 'Hank Enthusiast',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Always excited to join new things',
    followers: ['5', '6', '7'],
    following: ['9', '10', '1'],
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '9',
    username: 'ivy_networker',
    displayName: 'Ivy Networker',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Connecting people everywhere',
    followers: ['6', '7', '8'],
    following: ['10', '1', '2'],
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '10',
    username: 'jack_collaborator',
    displayName: 'Jack Collaborator',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'Collaboration is key',
    followers: ['7', '8', '9'],
    following: ['1', '2', '3'],
    createdAt: new Date('2024-03-25'),
  },
];

export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'Local Food Festival',
    description: 'A community-driven food festival showcasing local restaurants and food trucks. We could have live music, cooking demonstrations, and food competitions.',
    creatorId: '2',
    creator: mockUsers[1],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    interestedUsers: ['1', '3', '4', '5', '6', '7', '8'], // 7 > 3
    interestedUsersPreview: [mockUsers[0], mockUsers[2], mockUsers[3]],
    minimumInterested: 3,
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now (normal - blue)
    location: 'Central Park, New York',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01'),
    visibilityOption: 'followers',
  },
  {
    id: '2',
    title: 'Tech Meetup Series',
    description: 'Monthly tech meetups focusing on emerging technologies like AI, blockchain, and sustainable tech. Great networking opportunity for developers and entrepreneurs. We\'ll be covering cutting-edge topics including machine learning applications in healthcare, decentralized finance protocols, green computing solutions, and the future of remote collaboration tools. Each session will feature industry experts, hands-on workshops, and plenty of networking time. Whether you\'re a seasoned developer looking to stay ahead of the curve or a newcomer eager to learn about the latest innovations, this series has something for everyone. We\'ll also have special events like hackathons, startup pitch nights, and mentorship programs. The goal is to build a vibrant tech community that fosters innovation, collaboration, and knowledge sharing. Join us for an exciting journey into the future of technology!',
    creatorId: '1',
    creator: mockUsers[0],
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
    interestedUsers: ['2', '3', '5'], // 3 < 5
    interestedUsersPreview: [mockUsers[1], mockUsers[2], mockUsers[4]],
    minimumInterested: 5,
    expirationDate: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000), // 1.5 days from now (yellow)
    location: 'Tech Hub Downtown, San Francisco',
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-05'),
    visibilityOption: 'followers-share',
  },
  {
    id: '3',
    title: 'Urban Gardening Workshop',
    description: 'Learn how to grow your own vegetables in small urban spaces. We\'ll cover container gardening, vertical farming, and sustainable practices.',
    creatorId: '3',
    creator: mockUsers[2],
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    interestedUsers: ['1', '2', '4', '6'], // 4 === 4
    interestedUsersPreview: [mockUsers[0], mockUsers[1], mockUsers[3]],
    minimumInterested: 4,
    expirationDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now (red)
    location: 'Community Garden, Brooklyn',
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-08'),
    visibilityOption: 'public',
  },
  {
    id: '4',
    title: 'Online Book Club',
    description: 'A virtual book club where we read and discuss thought-provoking books. Perfect for book lovers who want to connect with others remotely.',
    creatorId: '1',
    creator: mockUsers[0],
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    interestedUsers: ['2', '3', '4', '5', '6', '7'], // 6 >= 6
    interestedUsersPreview: [mockUsers[1], mockUsers[2], mockUsers[3]],
    minimumInterested: 6,
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (normal - blue)
    location: '',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-10'),
    visibilityOption: 'followers',
  },
  {
    id: '5',
    title: 'Remote Work Productivity Tips',
    description: 'Share and learn strategies for staying productive while working from home. From time management to workspace optimization.',
    creatorId: '2',
    creator: mockUsers[1],
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    interestedUsers: ['1', '3', '4', '6', '8', '9', '10'], // 7 > 2
    interestedUsersPreview: [mockUsers[0], mockUsers[2], mockUsers[3]],
    minimumInterested: 2,
    expirationDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now (red)
    location: '',
    createdAt: new Date('2024-07-12'),
    updatedAt: new Date('2024-07-12'),
    visibilityOption: 'followers',
  },
  {
    id: '6',
    title: 'Weekend Hiking Adventure',
    description: 'Join us for a challenging but rewarding hike through the mountains. We\'ll explore scenic trails and enjoy breathtaking views.',
    creatorId: '4',
    creator: mockUsers[3],
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
    interestedUsers: ['1', '2', '5', '7', '8'], // 5 > 3
    interestedUsersPreview: [mockUsers[0], mockUsers[1], mockUsers[4]],
    minimumInterested: 3,
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now (yellow)
    location: 'Mountain Trail, Colorado',
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-15'),
    visibilityOption: 'followers',
  },
  {
    id: '7',
    title: 'Photography Workshop',
    description: 'Learn the basics of photography from composition to lighting. Perfect for beginners and intermediate photographers.',
    creatorId: '5',
    creator: mockUsers[4],
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    interestedUsers: ['2', '3', '6', '9'], // 4 === 4
    interestedUsersPreview: [mockUsers[1], mockUsers[2], mockUsers[5]],
    minimumInterested: 4,
    expirationDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now (red)
    location: 'City Park, Portland',
    createdAt: new Date('2024-07-18'),
    updatedAt: new Date('2024-07-18'),
    visibilityOption: 'followers',
  },
  {
    id: 'longdesc1',
    title: 'Marathon of Creativity: 48h Hackathon',
    description: `Join us for a 48-hour hackathon where teams will brainstorm, design, and build innovative solutions to real-world problems. Whether you're a developer, designer, marketer, or just passionate about tech, this event is for you! 

We'll provide food, drinks, and plenty of coffee. Prizes for the top 3 teams, plus networking opportunities with industry leaders. 

Schedule:
- Friday 6pm: Kickoff & team formation
- Saturday: Hacking, workshops, and mentorship
- Sunday: Final presentations & awards

Bring your laptop, creativity, and team spirit! All experience levels welcome. Let's build something amazing together and push the boundaries of what's possible in just two days! If you have any questions, feel free to reach out to the organizers. See you there!`,
    creatorId: '2',
    creator: mockUsers[1],
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    interestedUsers: ['1', '3', '4'],
    interestedUsersPreview: [mockUsers[0], mockUsers[2], mockUsers[3]],
    minimumInterested: 10,
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now (normal - blue)
    location: 'Tech Hub Downtown',
    createdAt: new Date(),
    updatedAt: new Date(),
    visibilityOption: 'followers',
  },
];

export const mockFeedItems: FeedItem[] = mockIdeas.map(idea => ({
  idea,
  interestCount: idea.interestedUsers.length,
  isInterested: false,
}));

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Local Food Festival',
    description: `Get ready for the most exciting culinary celebration of the year! Our Local Food Festival is a community-driven extravaganza that brings together the very best of our city's vibrant food scene. This isn't just another food event – it's a full sensory experience that celebrates local culture, creativity, and community spirit.

What to Expect:
🎵 Live Music & Entertainment
Throughout the day, enjoy performances from local bands, acoustic sets, and cultural music that perfectly complements the culinary experience. Our main stage will feature everything from jazz ensembles to indie rock bands, creating the perfect ambiance for your food journey.

🍳 Interactive Cooking Demonstrations
Watch master chefs from our top local restaurants showcase their signature dishes live! Learn the secrets behind their most popular recipes, get cooking tips, and even participate in some hands-on cooking sessions. From traditional techniques to modern culinary innovations, there's something for every skill level.

🏆 Food Competitions & Challenges
Witness the excitement of our "Iron Chef" style competitions where local chefs battle it out in real-time cooking challenges. Categories include "Best Street Food," "Most Creative Fusion Dish," and "People's Choice Award." The energy is electric, and the creativity is off the charts!

🍕 Food Trucks & Local Restaurants
Over 50 local food vendors will be serving up their finest dishes. From gourmet food trucks to established restaurant pop-ups, you'll find everything from artisanal pizzas and gourmet burgers to authentic ethnic cuisine, vegan delights, and decadent desserts. Each vendor has been carefully selected to represent the diversity and quality of our local food scene.

🍷 Craft Beer & Wine Garden
Our dedicated beverage area features local craft breweries, wineries, and artisanal cocktail makers. Sample unique brews, discover new favorite wines, and enjoy expertly crafted cocktails made with local ingredients. Perfect for pairing with your food discoveries!

👨‍👩‍👧‍👦 Family-Friendly Activities
We haven't forgotten about the little foodies! Kids can enjoy cooking workshops, face painting, food-themed games, and special children's menus. There's even a "Junior Chef" competition where kids can show off their budding culinary skills.

🌱 Sustainability Focus
This festival is committed to environmental responsibility. We use compostable servingware, encourage recycling, and partner with local farms for fresh ingredients. Learn about sustainable food practices and how to make eco-friendly choices in your daily cooking.

📸 Photo Opportunities
Capture your food journey with our Instagram-worthy photo spots, food art installations, and interactive displays. Share your experience with #LocalFoodFest2024 and connect with fellow food enthusiasts.

🎁 Special Features:
- VIP Experience: Exclusive access to premium food tastings, private cooking demonstrations, and meet-and-greets with celebrity chefs
- Food Tours: Guided tours of the festival with behind-the-scenes access to food preparation areas
- Recipe Exchange: Bring your favorite family recipe to share and discover new ones from other attendees
- Local Artisan Market: Browse and purchase locally made food products, cookware, and culinary accessories

This festival is more than just eating – it's about celebrating our community's rich culinary heritage, supporting local businesses, and creating lasting memories with friends and family. Whether you're a foodie, a casual diner, or just looking for a fun day out, there's something here for everyone.

Come hungry, leave inspired! Join us for a day of delicious discoveries, cultural celebration, and community connection. This is the food event of the year that you won't want to miss!`,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    startDate: new Date('2024-08-15T18:00:00'),
    location: 'Central Park, New York',
    creator: mockUsers[1],
    admins: [mockUsers[1], mockUsers[0]],
    invitees: [mockUsers[2], mockUsers[3]],
    pendingInvitees: [mockUsers[4]],
    attendees: [mockUsers[0], mockUsers[2], mockUsers[3]],
    isPaid: true,
    tickets: [
      { name: 'General Admission', price: 25, quantity: 100 },
      { name: 'VIP', price: 75, quantity: 10 },
    ],
    visibility: 'followers',
  },
  {
    id: '2',
    title: 'Urban Gardening Workshop',
    description: 'Learn how to grow your own vegetables in small urban spaces. We\'ll cover container gardening, vertical farming, and sustainable practices.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    startDate: new Date('2024-08-20T14:00:00'),
    location: 'Community Garden, Brooklyn',
    creator: mockUsers[2],
    admins: [mockUsers[2]],
    invitees: [mockUsers[0], mockUsers[1]],
    pendingInvitees: [],
    attendees: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[5]],
    isPaid: false,
    tickets: [],
    visibility: 'invited',
  },
];

export const getCurrentUser = (): User => mockUsers[0]; 