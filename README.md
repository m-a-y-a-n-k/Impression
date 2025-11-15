# 🎤 Impression

> A powerful web application that helps you sound more impressive through real-time speech analysis and personalized feedback.

**Impression** is an intelligent communication coaching tool that analyzes your speech patterns, provides actionable feedback, and helps you improve your communication skills for various scenarios like job interviews, presentations, elevator pitches, and networking events.

## ✨ Features

### 🎯 Core Capabilities
- **🔐 User Authentication** - Secure login with Google SSO
- **👤 Profile Management** - Personalized user profiles with preferences
- **Real-time Speech Recognition** - Speak naturally and get instant feedback
- **Text Input Alternative** - Can't use your microphone? Type your text instead
- **Advanced NLP Analysis** - Comprehensive sentiment and linguistic analysis
- **Multi-Scenario Practice** - Practice for different real-world situations:
  - 💼 Job Interviews
  - 🚀 Elevator Pitches
  - 📊 Presentations
  - 🤝 Networking Events

### 📊 Analysis Features
- **Sentiment Analysis** - Understand the emotional tone of your speech
- **Filler Word Detection** - Identify and reduce "um", "uh", "like", etc.
- **Sentence Structure Analysis** - Evaluate sentence variety and clarity
- **Repetition Detection** - Find overused words and phrases
- **Vocabulary Analysis** - Assess word diversity and complexity
- **Speaking Pace Analysis** - Monitor words per minute and pacing
- **Overall Impression Score** - Get a comprehensive score (0-100)

### 🎨 User Experience
- **Modern, Intuitive UI** - Beautiful interface with rich colors and smooth animations
- **User Profiles** - Personalized experience with secure authentication
- **Dark Mode Support** - Comfortable viewing in any lighting condition
- **Progress Tracking** - Monitor your improvement over time (synced across devices)
- **Multilingual Support** - Available in 10+ languages
- **Offline Support** - Service worker for offline functionality
- **PWA Ready** - Install as a Progressive Web App
- **Responsive Design** - Works seamlessly on desktop and mobile browsers
- **Animated Feedback** - Engaging visual feedback with Framer Motion animations

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Framer Motion 8.2.4** - Smooth animations and transitions
- **React Speech Recognition 3.9.1** - Browser-based speech recognition
- **React Router DOM 6.20.1** - Client-side routing

### Backend & Authentication
- **Firebase 10.7.1** - Backend-as-a-Service
- **Firebase Authentication** - Secure user authentication with Google SSO
- **Cloud Firestore** - Real-time NoSQL database for user data

### NLP & Analysis
- **Compromise 14.7.1** - Natural language processing
- **Compendium-js 0.0.31** - Sentiment analysis

### UI Components
- **Fluent UI React Components 9.11.0** - Microsoft's component library
- **Typewriter Effect 2.19.0** - Text animation effects

### Utilities
- **Lodash 4.17.21** - Utility functions
- **DetectRTC 1.4.1** - Browser capability detection

### Build Tools
- **React Scripts 5.0.1** - Create React App build configuration
- **gh-pages 5.0.0** - GitHub Pages deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn package manager
- A modern web browser with microphone support (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/m-a-y-a-n-k/Impression.git
   cd Impression/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (Required for authentication)
   - Follow the detailed setup guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Create a Firebase project and enable Google Authentication
   - Create a `.env` file in the `app/` directory with the following variables:
   
   ```bash
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   
   # Beta Testing Configuration (Optional)
   # Set to 'true' to enable beta testing tools in Profile for Premium Access testing
   # This allows testing Premium/Pro features without payment (stored locally)
   REACT_APP_ENABLE_BETA_TESTING=false
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - Sign in with your Google account
   - Allow microphone permissions when prompted

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment

The app is configured for GitHub Pages deployment:

```bash
npm run deploy
```

## 📖 Usage

1. **Sign In**
   - Sign in with your Google account
   - Your profile and progress will be automatically created

2. **Start a Session**
   - Click the microphone button to start recording
   - Or click "Can't use Mic? Go with Text instead" for text input

3. **Choose a Scenario** (optional)
   - Select from Job Interview, Elevator Pitch, Presentation, or Networking
   - Each scenario has tailored feedback criteria

4. **Speak or Type**
   - Speak naturally into your microphone
   - Or type your text in the text input mode
   - Watch real-time transcript as you speak

5. **Review Feedback**
   - Get comprehensive analysis including:
     - Sentiment score
     - Filler word count
     - Speaking pace
     - Vocabulary diversity
     - Overall impression score
   - Receive actionable improvement suggestions

6. **Track Progress**
   - Click the progress button (📊) to view your improvement over time
   - Review your historical performance (synced across devices)

7. **Manage Profile**
   - Click your avatar in the top-right corner
   - Update your profile, preferences, and view account details
   - Change language and other settings

## 🌐 Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Note:** Speech recognition requires browser support for the Web Speech API. Chrome and Edge have the best support.

## 📁 Project Structure

```
app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, audio, and media files
│   ├── components/        # React components
│   │   ├── AnimatedMic.jsx      # Main speech input component
│   │   ├── App.jsx              # Root component
│   │   ├── Login.jsx            # Login with Google SSO
│   │   ├── Profile.jsx          # User profile management
│   │   ├── UserMenu.jsx         # User menu dropdown
│   │   ├── ProtectedRoute.jsx   # Authentication wrapper
│   │   ├── Feedback.jsx         # Feedback display
│   │   ├── VideoRecorder.jsx    # Video recording functionality
│   │   └── ...
│   ├── config/           # Configuration files
│   │   ├── firebase.js          # Firebase configuration
│   │   ├── practiceScenarios.js # Scenario definitions
│   │   └── ...
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── SubscriptionContext.jsx # Subscription management
│   │   ├── ThemeContext.jsx     # Theme management
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   └── useSiteAudio.js
│   ├── i18n/             # Internationalization
│   │   ├── index.js
│   │   └── locales/             # Translation files
│   ├── styles/           # CSS files
│   ├── utils/            # Utility functions
│   │   ├── nlpAnalysis.js       # NLP analysis logic
│   │   ├── videoAnalysis.js     # Video analysis
│   │   └── ...
│   └── index.js          # Entry point
├── .env.example          # Environment variables template
├── FIREBASE_SETUP.md     # Firebase setup guide
├── package.json
└── README.md
```

## 💳 Payment Integration

Impression includes a comprehensive payment system with support for multiple payment methods and environment-based configuration.

### Supported Payment Methods

- **💳 Card Payments** - Debit and Credit cards
- **📱 UPI Payments** - Google Pay, PhonePe, Paytm
- **🏦 Net Banking** - 12+ major Indian banks
- **💰 Digital Wallets** - PayPal, Stripe (Production only)

### Environment-Based Payments

The payment system automatically switches between mock and real payments based on configuration:

**Beta Testing Mode** (Development)
- Mock payments for testing
- No real transactions
- Perfect for development
- Enable with: `REACT_APP_ENABLE_BETA_TESTING=true`

**Production Mode** (Live)
- Real payment gateway integration
- Actual transactions
- Requires backend API
- Enable with: `REACT_APP_ENABLE_BETA_TESTING=false`

### Quick Start

1. **For Development/Testing** (Mock Payments):
   ```bash
   # Add to your .env file
   REACT_APP_ENABLE_BETA_TESTING=true
   ```
   That's it! You can now test the complete checkout flow without any payment setup.

2. **For Production** (Real Payments):
   ```bash
   # Add to your .env file
   REACT_APP_ENABLE_BETA_TESTING=false
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
   REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_premium_id
   REACT_APP_STRIPE_PRO_PRICE_ID=price_pro_id
   REACT_APP_API_ENDPOINT=https://your-backend.com/api
   ```

### Documentation

For complete payment integration setup and usage:
- 📘 **[Payment Integration Guide](./PAYMENT_INTEGRATION.md)** - Complete documentation
- 🚀 **[Quick Start Guide](./app/PAYMENT_QUICKSTART.md)** - 5-minute setup
- ⚙️ **[Environment Configuration](./app/ENV_CONFIGURATION.md)** - Environment variables
- 📋 **[Implementation Summary](./PAYMENT_INTEGRATION_SUMMARY.md)** - What's included

### Payment Flow

```
User selects plan → Checkout page → Select payment method → 
Enter details → Process payment → Subscription activated
```

In beta testing mode, all payments are simulated instantly without real transactions.

## 🧪 Beta Testing & Development

### Premium Access Testing

For development and testing purposes, you can enable beta testing tools in the user profile to test Premium and Pro features without payment:

1. **Enable Beta Testing**:
   - Set `REACT_APP_ENABLE_BETA_TESTING=true` in your `.env` file
   - Restart the development server

2. **Access Beta Tools**:
   - Sign in to your account
   - Open your Profile (click on your avatar)
   - Expand the "🧪 Beta Testing" section
   - Toggle between Free, Premium, and Pro plans

3. **Note**: Beta testing changes are stored locally in browser storage and won't affect actual subscription status.

## 🎯 Key Features Explained

### Speech Recognition
- Uses browser's native Web Speech API
- Continuous listening with interim results
- Automatic transcript processing
- Fallback to text input if microphone unavailable

### NLP Analysis
- **Sentiment**: Positive, negative, neutral, or mixed
- **Filler Words**: Detects common fillers like "um", "uh", "like"
- **Repetition**: Identifies overused words
- **Sentence Structure**: Analyzes length, variety, and clarity
- **Vocabulary**: Measures diversity and complexity
- **Pace**: Calculates words per minute

### Feedback System
- Priority-based suggestions (high, medium, low)
- Scenario-specific feedback templates
- Actionable improvement tips
- Overall impression score calculation

## 🔒 Privacy & Security

- **Authentication**: Secure Google Sign-In via Firebase Authentication
- **Data Storage**: User profiles and progress stored in Firebase Firestore
- **Access Control**: Firestore security rules ensure users can only access their own data
- **Local Processing**: Speech and NLP analysis happen **locally in your browser**
- **Speech Recognition**: Uses browser's built-in API (no data sent to external servers)
- **Privacy First**: Your transcripts and analysis are processed locally
- **Secure by Default**: All Firebase communication is encrypted over HTTPS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 👤 Author

**Mayank N**

- GitHub: [@m-a-y-a-n-k](https://github.com/m-a-y-a-n-k)
- Project Homepage: [https://m-a-y-a-n-k.github.io/Impression/](https://m-a-y-a-n-k.github.io/Impression/)

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Speech recognition powered by [react-speech-recognition](https://github.com/JamesBrill/react-speech-recognition)
- NLP capabilities from [Compromise](https://github.com/spencermountain/compromise) and [Compendium-js](https://github.com/Planeshifter/compendium-js)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ to help you make a better impression** 