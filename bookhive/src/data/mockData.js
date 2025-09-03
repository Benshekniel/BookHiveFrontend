import { subDays, format, addDays } from 'date-fns';

// Mock Users
export const users = [
  {
    id: "1",
    name: "Jayani Perera",
    email: "jayani@example.com",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    location: "Colombo, Sri Lanka",
    trustScore: 4.8,
    joinDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    bio: "Book lover and literature enthusiast. I have a wide collection of fiction and non-fiction books.",
    isLender: true,
    isSeller: true
  },
  {
    id: "2",
    name: "Nimal Fernando",
    email: "nimal@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    location: "Kandy, Sri Lanka",
    trustScore: 4.5,
    joinDate: format(subDays(new Date(), 182), 'yyyy-MM-dd'),
    bio: "History and science fiction enthusiast. Always looking for rare books to add to my collection.",
    isLender: true,
    isSeller: false
  },
  {
    id: "3",
    name: "Kumari Silva",
    email: "kumari@example.com",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    location: "Galle, Sri Lanka",
    trustScore: 4.9,
    joinDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    bio: "University student passionate about educational books and novels.",
    isLender: true,
    isSeller: true
  },
  {
    id: "4",
    name: "Ashan Mendis",
    email: "ashan@example.com",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    location: "Colombo, Sri Lanka",
    trustScore: 4.2,
    joinDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
    isLender: false,
    isSeller: true
  }
];

// Mock Books
export const books = [
  {
    id: "1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg",
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to a fashion photographer, she lives in a grand house overlooking a park in London. One evening her husband Gabriel returns late from work, and Alicia shoots him five times in the face, and then never speaks another word.",
    genre: ["Psychological Thriller", "Mystery", "Fiction"],
    condition: "Like New",
    owner: users[0],
    forLend: true,
    forSale: true,
    forExchange: false,
    forBidding: false,
    price: 700,
    inStock: 5,
    lendingPeriod: 14,
    availableFrom: format(new Date(), 'yyyy-MM-dd'),
    location: "Colombo 07, Sri Lanka",
    language: "English",
    isbn: "9781250301697",
    publishYear: 2019,
    createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    wishlistedCount: 17
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    genre: ["Self-Help", "Personal Development", "Psychology"],
    condition: "Good",
    owner: users[1],
    forLend: true,
    forSale: false,
    forExchange: true,
    forBidding: true,
    inStock: 6,
    price: 600,
    lendingPeriod: 21,
    availableFrom: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    location: "Kandy, Sri Lanka",
    language: "English",
    isbn: "9780735211292",
    publishYear: 2018,
    createdAt: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    wishlistedCount: 24
  },
  {
    id: "3",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    cover: "https://images.pexels.com/photos/3646105/pexels-photo-3646105.jpeg",
    description: "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.",
    genre: ["History", "Anthropology", "Non-fiction"],
    condition: "Very Good",
    owner: users[2],
    forLend: true,
    forSale: false,
    forExchange: true,
    forBidding: false,
    price: 650,
    inStock: 8,
    lendingPeriod: 30,
    availableFrom: format(new Date(), 'yyyy-MM-dd'),
    location: "Galle, Sri Lanka",
    language: "English",
    isbn: "9780062316097",
    publishYear: 2014,
    createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    wishlistedCount: 32
  },
  {
    id: "4",
    title: "ගින්දර (Gindara)",
    author: "Martin Wickramasinghe",
    cover: "https://images.pexels.com/photos/2099691/pexels-photo-2099691.jpeg",
    description: "A classic novel by renowned Sri Lankan author Martin Wickramasinghe, exploring themes of rural life and social change in Sri Lanka.",
    genre: ["Classic", "Fiction", "Cultural"],
    condition: "Good",
    owner: users[3],
    forLend: true,
    forSale: true,
    forExchange: false,
    forBidding: false,
    price: 950,
    inStock: 2,
    availableFrom: format(new Date(), 'yyyy-MM-dd'),
    location: "Colombo 04, Sri Lanka",
    language: "Sinhala",
    publishYear: 1973,
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    wishlistedCount: 8
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    cover: "https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg",
    description: "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    genre: ["Memoir", "Biography", "Education"],
    condition: "New",
    owner: users[0],
    forLend: true,
    forSale: false,
    forExchange: true,
    forBidding: false,
    inStock: 1,
    price: 550,
    lendingPeriod: 14,
    availableFrom: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    location: "Colombo 07, Sri Lanka",
    language: "English",
    isbn: "9780399590504",
    publishYear: 2018,
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    wishlistedCount: 12
  },
  {
    id: "6",
    title: "Becoming",
    author: "Michelle Obama",
    cover: "https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg",
    description: "In her memoir, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her.",
    genre: ["Memoir", "Biography", "Politics"],
    condition: "Very Good",
    owner: users[2],
    forLend: true,
    forSale: false,
    forExchange: true,
    forBidding: true,
    price: 800,
    inStock: 5,
    lendingPeriod: 21,
    availableFrom: format(new Date(), 'yyyy-MM-dd'),
    location: "Galle, Sri Lanka",
    language: "English",
    isbn: "9781524763138",
    publishYear: 2018,
    createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    wishlistedCount: 19
  }
];

// Mock Book Requests
export const bookRequests = [
  {
    id: "1",
    book: books[0],
    requestor: users[1],
    status: "Pending",
    type: "Borrow",
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    message: "I've been wanting to read this for a while. Would love to borrow it for two weeks.",
    startDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 17), 'yyyy-MM-dd')
  },
  {
    id: "2",
    book: books[2],
    requestor: users[3],
    status: "Approved",
    type: "Buy",
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    message: "Interested in buying this book. Is the price negotiable?"
  },
  {
    id: "3",
    book: books[1],
    requestor: users[0],
    status: "Completed",
    type: "Borrow",
    createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    startDate: format(subDays(new Date(), 28), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 7), 'yyyy-MM-dd')
  }
];

// Mock Messages
export const messages = [
  {
    id: "1",
    sender: users[1],
    recipient: users[0],
    content: "Hi, I'm interested in borrowing 'The Silent Patient'. Is it still available?",
    timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    read: true,
    relatedBook: books[0]
  },
  {
    id: "2",
    sender: users[0],
    recipient: users[1],
    content: "Yes, it's available. When would you like to borrow it?",
    timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    read: true,
    relatedBook: books[0]
  },
  {
    id: "3",
    sender: users[2],
    recipient: users[0],
    content: "Do you have any other books by Alex Michaelides?",
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    read: false
  }
];

// Mock Notifications
export const notifications = [
  {
    id: "1",
    user: "1",
    type: "BookRequest",
    message: "Nimal Fernando requested to borrow 'The Silent Patient'",
    read: false,
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    link: "/requests/1"
  },
  {
    id: "2",
    user: "1",
    type: "Message",
    message: "You have a new message from Kumari Silva",
    read: false,
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    link: "/messages/3"
  },
  {
    id: "3",
    user: "2",
    type: "ReturnReminder",
    message: "You need to return 'Atomic Habits' in 3 days",
    read: true,
    createdAt: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
    link: "/borrowed/3"
  }
];

// Mock Book Circles
export const bookCircles = [
  {
    id: "1",
    name: "Sri Lankan Literature Club",
    description: "A group dedicated to discussing Sri Lankan authors and their works.",
    members: [users[0], users[2], users[3]],
    books: [books[3]],
    creator: users[0],
    createdAt: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
    coverImage: "https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg",
    tags: ["Sri Lankan", "Literature", "Cultural"]
  },
  {
    id: "2",
    name: "Science & Philosophy Readers",
    description: "Exploring the intersection of science, philosophy, and human understanding.",
    members: [users[1], users[2]],
    books: [books[2]],
    creator: users[1],
    createdAt: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
    coverImage: "https://images.pexels.com/photos/1261820/pexels-photo-1261820.jpeg",
    tags: ["Science", "Philosophy", "Non-fiction"]
  }
];

// Helper functions to get data
export const getBookById = (id) => {
  return books.find(book => book.id === id);
};

export const getUserById = (id) => {
  return users.find(user => user.id === id);
};

export const getBooksByOwner = (userId) => {
  return books.filter(book => book.owner.id === userId);
};

export const getRequestsByUser = (userId) => {
  return bookRequests.filter(request => request.requestor.id === userId);
};

export const getRequestsForUser = (userId) => {
  return bookRequests.filter(request => request.book.owner.id === userId);
};

export const getMessagesByUser = (userId) => {
  return messages.filter(message => 
    message.sender.id === userId || message.recipient.id === userId
  );
};