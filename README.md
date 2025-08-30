# Arithmetic Practice - Professional Math Skills Trainer

A modern, responsive arithmetic practice application built with React, TypeScript, and industry best practices. Master your math skills with personalized practice sessions, detailed analytics, and an engaging user experience.

## ✨ Features

### 🎯 Core Functionality

- **Four Operations**: Addition, subtraction, multiplication, and division with intelligent problem generation
- **Multiple Difficulty Levels**: 
  - **Beginner**: Numbers 1-50, whole numbers only
  - **Intermediate**: Numbers 1-500, includes negative numbers
  - **Advanced**: Full range with decimals and negatives
- **Practice Modes**: 
  - **Practice**: Unlimited time, focus on learning
  - **Timed**: Customizable timer (1-15 minutes) with countdown
  - **Custom**: Advanced settings with digit control (1-9 digits), single difficulty selection, and bonus systems
- **Smart Problem Generation**: Adaptive difficulty with overflow protection for large numbers

### 📊 Analytics & Progress Tracking

- **Comprehensive Statistics**: Track accuracy, speed, and progress over time
- **Best Record System**: Automatic tracking and celebration of new personal records
- **Operation-Specific Analytics**: Detailed performance metrics for each math operation
- **Difficulty-Level Tracking**: Monitor progress across different difficulty levels with smart analytics
- **Session History**: Review past practice sessions with detailed breakdowns
- **Real-time Performance Feedback**: Speed ratings and bonus point calculations

### 🎨 User Experience

- **Modern Glass Morphism Design**: Beautiful, responsive interface with smooth animations
- **Framer Motion Animations**: Engaging transitions and micro-interactions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smart Visual Feedback**: 
  - Dynamic font scaling for large numbers (auto-adjusts from 6xl to 2xl)
  - Adaptive timing for incorrect answers (2x display time)
  - Color-coded feedback with smooth transitions
- **Enhanced Audio System**: Balanced sound effects with volume optimization

### ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Audio Feedback**: Optional sound effects for correct/incorrect answers with balanced volume
- **High Contrast**: Clear visual design for better readability
- **Dynamic Scaling**: Auto-adjusting interface for different screen sizes

### 🔧 Technical Excellence

- **Performance Optimized**: Memoized components and efficient re-renders
- **Local Storage**: Progress and settings persist between sessions
- **TypeScript**: Full type safety and better developer experience
- **Modern Tooling**: Vite for fast development and building
- **State Management**: Zustand for clean, efficient state handling

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

1. **Select Operations**: Choose from addition, subtraction, multiplication, and division
2. **Choose Difficulty**: Select from Beginner, Intermediate, or Advanced
3. **Set Parameters**:
   - Number of problems (5, 10, 15, 20, or 30)
   - Mode selection (Practice, Timed, or Custom)
   - For Timed mode: Set timer from 1-15 minutes
4. **Custom Mode Options**:
   - Single difficulty selection (no more multi-select confusion)
   - Digit control (1-9 digits) with intelligent range limiting
   - Toggle negative numbers and non-integers
   - Enable speed/streak bonuses
5. **Click "Start Practice"**

### During Practice

- **Input**: Type your answer in the input field
- **Submit**: Press Enter or click Submit
- **Feedback**: Get immediate visual and audio feedback
- **Large Numbers**: Interface automatically adjusts font size for readability
- **Error Review**: Incorrect answers display longer (2 seconds vs 1 second)
- **Navigation**: Use keyboard shortcuts for faster interaction

### Settings & Customization

- **Sound Controls**: Toggle sound effects on/off
- **Display Mode**: Choose between decimal (0.5) or fraction (1/2) display
- **Hints**: Enable/disable helpful hints during problems
- **Data Management**: Reset all statistics and progress if needed

### Keyboard Shortcuts

- **Enter**: Submit answer or continue to next problem
- **Space**: Continue to next problem (when result is shown) or pause/resume
- **Number keys**: Quick number input
- **Escape**: Pause game (if implemented)

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Audio**: Web Audio API for sound effects

### Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.tsx     # Main landing page with improved Custom mode
│   ├── ProblemDisplay.tsx # Math problem display with dynamic scaling
│   ├── GameHeader.tsx   # Game status header
│   ├── GameResults.tsx  # Results screen with record tracking
│   ├── StatsPage.tsx    # Statistics dashboard
│   └── SettingsPage.tsx # Settings (streamlined, no duplicate timers)
├── hooks/               # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   └── useSound.ts      # Enhanced with volume balancing
├── store/               # Zustand store
│   └── gameStore.ts     # Global game state
├── types/               # TypeScript definitions
│   └── index.ts         # Updated with single difficulty for Custom mode
├── utils/               # Utility functions
│   ├── problemGenerator.ts # Enhanced with difficulty-aware Custom mode
│   ├── storage.ts       # Local storage management
│   ├── analytics.ts     # Performance analytics with record tracking
│   └── performance.ts   # Performance optimizations
└── styles/              # CSS styles
    └── index.css        # Global styles and animations
```

### Key Design Patterns

- **Component-based Architecture**: Modular, reusable components
- **Custom Hooks**: Shared logic for keyboard shortcuts and sound
- **Separation of Concerns**: Clear separation between UI, state, and business logic
- **Performance Optimization**: Memoized components and efficient rendering
- **Single Source of Truth**: Centralized state management with Zustand

## 🎨 Design System

### Color Scheme

- **Primary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Background**: Purple-blue gradient (#667eea to #764ba2)
- **Glass Effect**: Semi-transparent white with blur
- **Text**: White with blue accents
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Custom Mode**: Purple accents (#8b5cf6)

### Typography

- **Primary Font**: Inter (modern, readable)
- **Dynamic Sizing**: Auto-scaling from text-6xl to text-2xl based on number length
- **UI Text**: Medium weight for interface elements

### Animations

- **Page Transitions**: Smooth fade and scale animations
- **Problem Changes**: Bounce-in effect for new problems
- **Feedback**: Scale animations for correct/incorrect responses with adaptive timing
- **Progress**: Animated progress bars and counters
- **Record Celebrations**: Special animations for new personal bests

## 📈 Performance Features

### Optimization Techniques

- **React.memo**: Prevent unnecessary re-renders
- **Component Memoization**: Cache expensive computations
- **Efficient State Updates**: Minimal state mutations
- **Dynamic Content Scaling**: Responsive UI that adapts to content size
- **Smart Problem Generation**: Overflow protection for large numbers

### Latest Improvements

- **Custom Mode Overhaul**: Single difficulty selection instead of confusing multi-select
- **Visual Enhancement**: Dynamic font sizing for numbers up to 9 digits
- **UX Polish**: Extended error display time, balanced audio, streamlined settings
- **Performance**: Better difficulty logic that respects both Custom settings and difficulty levels

## 🔒 Data Privacy

- **Local Storage Only**: No data sent to external servers
- **No Tracking**: No analytics or tracking scripts
- **Privacy Focused**: User data stays on their device
- **Secure**: No sensitive data collection

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
- Test thoroughly across different devices and number ranges
- Maintain consistent code formatting
- Consider accessibility in all UI changes

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020, CSS Grid, Flexbox, Web Audio API
- **Responsive**: Optimized for screens from 320px to 4K

## 🔄 Recent Updates

### Version 2.0 (Latest)
- ✅ **Custom Mode Redesign**: Single difficulty selection (no more multi-select confusion)
- ✅ **Visual Enhancements**: Dynamic font scaling for large numbers (1-9 digits)
- ✅ **UX Improvements**: Extended display time for incorrect answers
- ✅ **Audio Balance**: Fixed volume inconsistencies between correct/incorrect sounds
- ✅ **Settings Cleanup**: Removed duplicate timer settings, streamlined interface
- ✅ **Problem Generation**: Enhanced difficulty logic with overflow protection
- ✅ **Record System**: Automatic tracking and celebration of personal bests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Lucide**: For beautiful, consistent icons
- **Zustand**: For elegant state management

---

Built with ❤️ for math education and skill development.
**Latest Update**: Enhanced Custom mode with single difficulty selection and improved user experience.