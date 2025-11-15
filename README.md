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
- **🎥 Video Practice Mode** - Record and analyze video responses with visual and audio feedback
- **📝 Q&A Practice Mode** (Premium) - Answer topic-specific questions across difficulty levels
  - 10 diverse topics (STEM & Non-STEM)
  - 74+ questions across Beginner, Intermediate, and Advanced levels
  - Real-time evaluation with detailed feedback
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
- **Session Limits** - Free tier with 10 daily sessions, unlimited for Premium/Pro
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

### Utilities & Additional Libraries
- **Lodash 4.17.21** - Utility functions
- **DetectRTC 1.4.1** - Browser capability detection
- **html2canvas 1.4.1** - Screenshot generation for PDF export
- **jsPDF 3.0.3** - PDF generation for progress reports
- **Recharts 3.4.1** - Charts and data visualization for analytics
- **i18next 25.6.2** - Internationalization framework
- **React i18next 16.3.3** - React integration for i18n

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
   
   # Payment Configuration (Optional - Required for Production)
   # Razorpay configuration for real payments
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE
   REACT_APP_UPI_MERCHANT_VPA=yourmerchant@paytm
   REACT_APP_UPI_MERCHANT_NAME=Impression
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

### Getting Started

1. **Sign In**
   - Sign in with your Google account
   - Your profile and progress will be automatically created
   - Free tier includes 10 sessions per day

2. **Choose Your Mode**
   - **💬 Text Mode** - Type and analyze your responses
   - **🎤 Audio Mode** - Speak naturally with voice recognition
   - **🎥 Video Mode** - Record video for comprehensive feedback (Premium)
   - **📝 Q&A Mode** - Answer topic-specific questions (Premium)

### Text & Audio Modes

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

### Q&A Practice Mode (Premium)

6. **Select a Topic**
   - Choose from 10 diverse topics:
     - 🔬 Science (12 questions)
     - 💻 Technology (9 questions)
     - ⚙️ Engineering (8 questions)
     - 📐 Mathematics (7 questions)
     - 💼 Business & Economics (8 questions)
     - 📜 History (6 questions)
     - 🎨 Arts & Culture (6 questions)
     - 📰 Current Affairs (6 questions)
     - 🧠 Psychology (6 questions)
     - 📚 Literature (6 questions)

7. **Choose Difficulty**
   - **Beginner** - Foundational concepts (3 min timer)
   - **Intermediate** - Deeper understanding (4 min timer)
   - **Advanced** - Expert-level analysis (5 min timer)

8. **Answer the Question**
   - Read the question carefully
   - Type your answer within the time limit
   - Get instant, detailed evaluation

9. **Review Q&A Feedback**
   - **Accuracy Score** - How well you covered key concepts
   - **Clarity Score** - How clearly you explained
   - **Completeness Score** - Coverage of expected topics
   - **Vocabulary Score** - Use of appropriate terminology
   - **Keyword Analysis** - Which keywords you covered
   - **Improvement Suggestions** - Specific tips to improve

### Progress & Analytics

10. **Track Progress**
    - Click the progress button (📊) to view your improvement over time
    - Review your historical performance (synced across devices)
    - View analytics and insights (Premium)
    - Export progress reports as PDF (Pro)

11. **Manage Profile**
    - Click your avatar in the top-right corner
    - Update your profile, preferences, and view account details
    - Upgrade to Premium/Pro for unlimited access
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
│   │   ├── Landing.jsx          # Main mode selection landing
│   │   ├── Profile.jsx          # User profile management
│   │   ├── UserMenu.jsx         # User menu dropdown
│   │   ├── ProtectedRoute.jsx   # Authentication wrapper
│   │   ├── Feedback.jsx         # Text/Audio feedback display
│   │   ├── VideoRecorder.jsx    # Video recording functionality
│   │   ├── VideoFeedback.jsx    # Video analysis feedback
│   │   ├── QuestionDisplay.jsx  # Q&A question interface
│   │   ├── QnAFeedback.jsx      # Q&A evaluation feedback
│   │   ├── TopicSelector.jsx    # Q&A topic selection (NEW)
│   │   ├── DifficultySelector.jsx # Q&A difficulty selection
│   │   ├── ScenarioSelector.jsx # Video scenario selection
│   │   ├── Checkout.jsx         # Payment checkout page
│   │   ├── PricingModal.jsx     # Subscription pricing
│   │   ├── UpgradePrompt.jsx    # Session limit prompts
│   │   └── ...
│   ├── config/           # Configuration files
│   │   ├── firebase.js          # Firebase configuration
│   │   ├── practiceScenarios.js # Scenario definitions
│   │   ├── qnaQuestions.js      # Q&A question bank (74 questions)
│   │   ├── paymentConfig.js     # Payment gateway config
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
│   │   └── locales/             # Translation files (10+ languages)
│   ├── styles/           # CSS files
│   │   ├── Checkout.css         # Checkout page styles (scroll-fixed)
│   │   ├── TopicSelector.css    # Topic selection styles (NEW)
│   │   └── ...
│   ├── utils/            # Utility functions
│   │   ├── nlpAnalysis.js       # NLP analysis logic
│   │   ├── videoAnalysis.js     # Video analysis
│   │   ├── qnaEvaluation.js     # Q&A answer evaluation
│   │   ├── razorpayIntegration.js # Razorpay payment (NEW)
│   │   ├── mockPaymentService.js # Mock payment for testing
│   │   ├── progressStorage.js   # Progress tracking
│   │   ├── sessionTracking.js   # Session limits
│   │   ├── pdfExport.js         # PDF report generation
│   │   └── ...
│   └── index.js          # Entry point
├── env.example.txt       # Environment variables template
├── PAYMENT_SETUP.md      # Razorpay setup guide (NEW)
├── QUICK_START.md        # Quick start payment guide (NEW)
├── FIREBASE_SETUP.md     # Firebase setup guide
├── package.json
└── README.md
```

## 💳 Payment Integration

Impression includes a production-ready payment system powered by **Razorpay** with support for multiple payment methods across India.

### Supported Payment Methods

- **💳 Card Payments** - All major Debit/Credit cards (Visa, Mastercard, Amex, RuPay)
- **📱 UPI Payments** - Google Pay, PhonePe, Paytm, and all UPI apps
- **🏦 Net Banking** - 12+ major Indian banks (HDFC, ICICI, SBI, Axis, etc.)
- **💰 Digital Wallets** - Paytm, Mobikwik, and other wallets

### Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | ₹0 | 10 sessions/day, Basic features |
| **Premium** | ₹299/month | Unlimited sessions, Q&A Mode, Video Mode, Advanced Analytics |
| **Pro** | ₹599/month | All Premium + PDF Export, Priority Support, API Access (coming soon) |

### Environment-Based Payments

The payment system automatically switches between mock and real payments based on configuration:

**Beta Testing Mode** (Development)
- ✅ Mock payments for testing
- ✅ No real transactions
- ✅ Perfect for development
- ✅ Test all payment methods
- Enable with: `REACT_APP_ENABLE_BETA_TESTING=true`

**Production Mode** (Live)
- ✅ Razorpay payment gateway integration
- ✅ Real payment processing
- ✅ PCI-compliant and secure
- ✅ Automatic subscription activation
- Enable with: `REACT_APP_ENABLE_BETA_TESTING=false`

### Quick Start

1. **For Development/Testing** (Mock Payments):
   ```bash
   # Add to your .env file
   REACT_APP_ENABLE_BETA_TESTING=true
   ```
   That's it! You can now test the complete checkout flow without any payment setup.

2. **For Production** (Real Payments with Razorpay):
   ```bash
   # Add to your .env file
   REACT_APP_ENABLE_BETA_TESTING=false
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
   REACT_APP_UPI_MERCHANT_VPA=yourmerchant@paytm
   REACT_APP_UPI_MERCHANT_NAME=Impression
   ```

3. **Setup Razorpay Account**:
   - Sign up at [https://razorpay.com](https://razorpay.com)
   - Complete KYC verification
   - Get your API Key from Dashboard → Settings → API Keys
   - Add your live key to `.env` file

### Payment Flow

```
User selects plan → Checkout page → Razorpay modal opens → 
Select payment method → Complete payment → 
Subscription activated automatically
```

### Features

✅ **Instant Activation** - Subscription activates immediately after successful payment  
✅ **Secure Processing** - All payments processed through Razorpay's PCI-compliant gateway  
✅ **Multiple Methods** - Support for Cards, UPI, Net Banking, and Wallets  
✅ **Mobile Optimized** - Smooth checkout experience on mobile devices  
✅ **Scroll-Fixed UI** - Improved checkout page with proper scrolling  
✅ **Auto-Renewal** - Subscriptions auto-renew monthly (can be cancelled anytime)  

### Documentation

For complete payment integration setup:
- 📘 **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** - Comprehensive setup guide with troubleshooting
- 🚀 **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start guide

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

### Q&A Evaluation System (Premium)
- **Keyword Matching**: Analyzes coverage of expected concepts
- **Accuracy Scoring**: Evaluates correctness of information
- **Clarity Assessment**: Measures how well you explain concepts
- **Completeness Check**: Ensures all aspects are covered
- **Vocabulary Analysis**: Appropriate use of terminology
- **Time-Limited Responses**: Practice under realistic conditions
- **Difficulty-Based Evaluation**: Criteria adjust based on level

### Video Analysis (Premium)
- **Visual Feedback**: Gesture recognition and body language
- **Audio Analysis**: Combined with speech evaluation
- **Scenario-Specific**: Tailored for job interviews, pitches, etc.
- **Comprehensive Scoring**: Video + Audio overall assessment

### Feedback System
- Priority-based suggestions (high, medium, low)
- Scenario-specific feedback templates
- Actionable improvement tips
- Overall impression score calculation
- Historical progress tracking
- Exportable PDF reports (Pro)

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

## 🆕 Recent Updates

### Version 5.2.0 (Latest)

**✨ Enhanced Q&A Mode**
- Added topic-based question selection with 10 diverse categories
- Expanded question bank from 20 to 74 questions
- Beautiful topic selector UI with smooth animations
- Questions now organized by both topic and difficulty
- Added more STEM and Non-STEM questions across all levels

**💳 Production Payment Integration**
- Integrated Razorpay payment gateway for real payments
- Support for all major Indian payment methods
- Client-side payment processing with Razorpay Checkout
- Environment-based payment switching (beta/production)
- Improved checkout UX with proper scrolling

**🐛 Bug Fixes**
- Fixed checkout page scrolling issues
- Improved mobile responsiveness on checkout
- Better overflow handling in payment forms

**📚 Documentation**
- Added comprehensive payment setup guides
- Created quick start payment documentation
- Updated README with latest features

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Speech recognition powered by [react-speech-recognition](https://github.com/JamesBrill/react-speech-recognition)
- NLP capabilities from [Compromise](https://github.com/spencermountain/compromise) and [Compendium-js](https://github.com/Planeshifter/compendium-js)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Payment processing by [Razorpay](https://razorpay.com)
- Charts and visualizations by [Recharts](https://recharts.org)

---

**Made with ❤️ to help you make a better impression** 