# Arithmetic Practice - Professional Math Skills Trainer

A modern, responsive arithmetic practice application built with React, TypeScript, and industry best practices. Master your math skills with personalized practice sessions, detailed analytics, and an engaging user experience.

## ✨ Features

### 🎯 Core Functionality

- **Four Operations**: Addition, subtraction, multiplication, and division
- **Multiple Difficulty Levels**: Beginner (1-10), Intermediate (1-100), Advanced (1-1000+ with decimals)
- **Practice Modes**: Practice, Timed (5 minutes), and Custom sessions
- **Intelligent Problem Generation**: Tailored problems based on difficulty and operation type

### 📊 Analytics & Progress Tracking

- **Comprehensive Statistics**: Track accuracy, speed, and progress over time
- **Performance Insights**: Identify strengths and areas for improvement
- **Operation-Specific Analytics**: See how you perform in each math operation
- **Difficulty-Level Tracking**: Monitor progress across different difficulty levels
- **Session History**: Review past practice sessions

### 🎨 User Experience

- **Modern Glass Morphism Design**: Beautiful, responsive interface with smooth animations
- **Framer Motion Animations**: Engaging transitions and micro-interactions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Feedback**: Immediate visual and audio feedback for answers

### ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Audio Feedback**: Optional sound effects for correct/incorrect answers
- **High Contrast**: Clear visual design for better readability

### 🔧 Technical Excellence

- **Performance Optimized**: Memoized components and efficient re-renders
- **Local Storage**: Progress and settings persist between sessions
- **TypeScript**: Full type safety and better developer experience
- **Modern Tooling**: Vite for fast development and building

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Yippine/Arithmetic-Practice.git
   cd arithmetic-practice
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎮 How to Use

### Starting a Practice Session

1. Select the math operations you want to practice
2. Choose your difficulty level:
   - **Beginner**: Numbers 1-10, whole numbers only
   - **Intermediate**: Numbers 1-100, includes negative numbers
   - **Advanced**: Numbers 1-1000+, includes decimals and negatives
3. Set the number of problems (5, 10, 15, 20, or 30)
4. Choose your mode (Practice, Timed, or Custom)
5. Click "Start Practice"

### During Practice

- Type your answer in the input field
- Press Enter or click Submit
- Get immediate feedback (correct/incorrect)
- Use keyboard shortcuts for faster navigation
- Pause anytime using the pause button

### Reviewing Progress

- Click "View Statistics" to see detailed analytics
- Review accuracy by operation and difficulty
- See performance trends and improvement suggestions
- Check your best streaks and average times

### Keyboard Shortcuts

- **Enter**: Submit answer or continue to next problem
- **Space**: Continue to next problem (when result is shown)
- **Escape**: Pause game
- **Number keys**: Quick number input

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.tsx     # Main landing page
│   ├── ProblemDisplay.tsx # Math problem display
│   ├── GameHeader.tsx   # Game status header
│   ├── GameResults.tsx  # Results screen
│   └── StatsPage.tsx    # Statistics dashboard
├── hooks/               # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   └── useSound.ts
├── store/               # Zustand store
│   └── gameStore.ts     # Global game state
├── types/               # TypeScript definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── problemGenerator.ts # Math problem generation
│   ├── storage.ts       # Local storage management
│   ├── analytics.ts     # Performance analytics
│   └── performance.ts   # Performance optimizations
└── styles/              # CSS styles
    └── index.css        # Global styles and animations
```

### Key Design Patterns

- **Component-based Architecture**: Modular, reusable components
- **Custom Hooks**: Shared logic for keyboard shortcuts and sound
- **Separation of Concerns**: Clear separation between UI, state, and business logic
- **Performance Optimization**: Memoized components and efficient rendering

## 🎨 Design System

### Color Scheme

- **Primary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Background**: Purple-blue gradient (#667eea to #764ba2)
- **Glass Effect**: Semi-transparent white with blur
- **Text**: White with blue accents
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)

### Typography

- **Primary Font**: Inter (modern, readable)
- **Number Display**: Large, bold for math problems
- **UI Text**: Medium weight for interface elements

### Animations

- **Page Transitions**: Smooth fade and scale animations
- **Problem Changes**: Bounce-in effect for new problems
- **Feedback**: Scale animations for correct/incorrect responses
- **Progress**: Animated progress bars and counters

## 📈 Performance Features

### Optimization Techniques

- **React.memo**: Prevent unnecessary re-renders
- **Component Memoization**: Cache expensive computations
- **Efficient State Updates**: Minimal state mutations
- **Code Splitting**: Lazy loading for better initial load times

### Analytics Integration

- **Performance Monitoring**: Track component render times
- **User Behavior**: Monitor problem-solving patterns
- **Error Tracking**: Catch and log JavaScript errors

## 🔒 Data Privacy

- **Local Storage Only**: No data sent to external servers
- **No Tracking**: No analytics or tracking scripts
- **Privacy Focused**: User data stays on their device

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Write clean, readable code with comments
- Test thoroughly across different devices
- Maintain consistent code formatting

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020, CSS Grid, Flexbox, Web Audio API

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Lucide**: For beautiful, consistent icons

---

Built with ❤️ for math education and skill development.
