# 🍽️ FridgeVision AI

**Transform your fridge contents into delicious recipes with the power of AI and computer vision.**

FridgeVision AI is a modern web application that helps you discover what to cook by intelligently detecting ingredients through your camera and generating personalized recipes using Google's Gemini AI.

![FridgeVision AI](https://img.shields.io/badge/React-Router-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-AI-orange) ![Gemini](https://img.shields.io/badge/Google-Gemini-green)

## ✨ Features

- 📸 **Real-time Ingredient Detection** - Point your camera at ingredients and watch AI identify them instantly
- 🤖 **AI-Powered Recipe Generation** - Get personalized recipes using Google Gemini AI
- 🎯 **Multiple Object Detection** - Detect multiple ingredients simultaneously with visual bounding boxes
- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive UI
- ⚡ **Real-time Processing** - Live camera feed with instant object recognition
- 🎨 **Modern UI/UX** - Built with shadcn/ui components and Tailwind CSS
- 🔧 **Manual Ingredient Management** - Add or remove ingredients from the detected list

## 🚀 Tech Stack

### Frontend & Framework

- **React Router v7** - Latest routing with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library

### AI & Computer Vision

- **Google Vision API** - High-accuracy ingredient detection and food recognition
- **Google Gemini API** - Advanced AI recipe generation

### Core Libraries

- **React Webcam** - Camera access and video streaming
- **Lucide React** - Beautiful icons
- **React Markdown** - Recipe formatting

## 🏗️ Architecture

```
app/
├── components/
│   ├── screens/           # Main application screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── ConfirmationScreen.tsx
│   │   ├── GenerationScreen.tsx
│   │   └── RecipeScreen.tsx
│   └── ui/               # Reusable UI components
│       ├── ProgressIndicator.tsx
│       └── ErrorDisplay.tsx
├── hooks/                # Custom React hooks
│   ├── useCamera.ts      # Camera management
│   ├── useServerVisionIngredientDetection.ts  # Secure server-side Vision API
│   └── useAppFlow.ts     # Application state flow
├── lib/                  # Utilities and services
│   ├── gemini.ts         # Google Gemini AI integration
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
    └── index.ts
```

## 🎯 How It Works

1. **Camera Access** - Request camera permissions and initialize webcam
2. **Image Capture** - Capture images from camera feed when user clicks "Detect Now"
3. **Server-Side Processing** - Send images to server-side Google Vision API proxy for secure processing
4. **Ingredient Detection** - Google Vision API analyzes images and returns detected ingredients
5. **Ingredient Curation** - Allow users to confirm, remove, or add ingredients manually
6. **Recipe Generation** - Send ingredient list to Google Gemini AI for recipe creation
7. **Recipe Display** - Present the generated recipe with proper formatting

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A modern web browser with camera support
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dannycahyo/fridge-vision.git
   cd fridge-vision
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your Google Gemini API key:

   ```env
   VITE_GEMINI_API_KEY=your_VITE_GEMINI_API_KEY_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY` - Your Google Gemini API key (required)

### Camera Permissions

The app requires camera access to function. Ensure you grant camera permissions when prompted.

## 📱 Usage

1. **Launch the app** - Open FridgeVision in your browser
2. **Grant camera access** - Allow camera permissions when prompted
3. **Scan ingredients** - Point your camera at ingredients in your fridge or pantry
4. **Review detections** - See detected ingredients with confidence scores
5. **Customize list** - Remove incorrect items or add missing ingredients manually
6. **Generate recipe** - Tap "Generate Recipe" to create an AI-powered recipe
7. **Cook and enjoy** - Follow the step-by-step instructions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Dietary Preferences** - Add vegetarian, gluten-free, and other dietary filters
- [ ] **Recipe History** - Save and access previously generated recipes
- [ ] **Recipe Variations** - Generate variations of existing recipes
- [ ] **Shopping List** - Generate shopping lists for missing ingredients
- [ ] **Offline Mode** - Basic functionality without internet connection
- [ ] **Recipe Sharing** - Share recipes with friends and family

## 🐛 Known Issues

- Camera access may not work on older browsers
- Detection accuracy depends on lighting conditions
- Some small or partially occluded objects may not be detected

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful recipe generation
- **TensorFlow.js** team for browser-based machine learning
- **shadcn/ui** for beautiful React components
- **React Router** team for the modern routing solution

---

**Built with ❤️ by [dannycahyo](https://github.com/dannycahyo)**

_Turn your ingredients into inspiration with FridgeVision AI!_ ✨
