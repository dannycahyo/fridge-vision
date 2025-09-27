# 🍽️ FridgeVision AI

**Transform your fridge contents into delicious recipes with the power of AI and computer vision.**

FridgeVision AI is a modern web application that helps you discover what to cook by intelligently detecting ingredients through your camera and generating personalized recipes using Google's Gemini AI.

![FridgeVision AI](https://img.shields.io/badge/React-Router-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Google Vision](https://img.shields.io/badge/Google-Vision-orange) ![Gemini](https://img.shields.io/badge/Google-Gemini-green)

## ✨ Features

- 📸 **Smart Ingredient Detection** - Capture images and use Google Vision API to identify ingredients with high accuracy
- 🤖 **AI-Powered Recipe Generation** - Get personalized recipes using Google Gemini AI
- 🎯 **Multiple Object Detection** - Detect multiple ingredients simultaneously from a single image
- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive UI
- ⚡ **Server-Side Processing** - Secure image analysis using Google Vision API on the server
- 🎨 **Modern UI/UX** - Built with shadcn/ui components and Tailwind CSS
- 🔧 **Manual Ingredient Management** - Add or remove ingredients from the detected list

## 🚀 Tech Stack

### Frontend & Framework

- **React Router v7** - Latest routing with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library

### AI & Computer Vision

- **Google Vision API** - Advanced image analysis with text and object detection
- **Server-Side Processing** - Secure and accurate ingredient detection
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
│       ├── DetectionOverlay.tsx
│       ├── ProgressIndicator.tsx
│       └── ErrorDisplay.tsx
├── hooks/                # Custom React hooks
│   ├── useCamera.ts      # Camera management
│   ├── useIngredientDetection.ts  # Image capture and server communication
│   └── useAppFlow.ts     # Application state flow
├── lib/                  # Utilities and services
│   ├── googleVision.ts   # Google Vision API integration
│   ├── gemini.ts         # Google Gemini AI integration
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
    └── index.ts
```

## 🎯 How It Works

1. **Camera Access** - Request camera permissions and initialize webcam
2. **Image Capture** - Capture high-quality images of ingredients using the camera
3. **Server Analysis** - Send images to Google Vision API for text and object detection
4. **Smart Filtering** - Intelligently filter results to identify food-related items
5. **Ingredient Curation** - Allow users to confirm, remove, or add ingredients manually
6. **Recipe Generation** - Send ingredient list to Google Gemini AI for recipe creation
7. **Recipe Display** - Present the generated recipe with proper formatting

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A modern web browser with camera support
- Google Gemini API key
- Google Vision API key

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

   Add your Google API keys:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_VISION_API_KEY=your_google_vision_api_key_here
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

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `GOOGLE_VISION_API_KEY` - Your Google Vision API key (required)

### Camera Permissions

The app requires camera access to function. Ensure you grant camera permissions when prompted.

## 📱 Usage

1. **Launch the app** - Open FridgeVision in your browser
2. **Grant camera access** - Allow camera permissions when prompted
3. **Capture ingredients** - Point your camera at ingredients and tap "Capture & Analyze"
4. **Review detections** - See detected ingredients identified by Google Vision API
5. **Capture more** - Take additional photos to detect more ingredients
6. **Customize list** - Remove incorrect items or add missing ingredients manually
7. **Generate recipe** - Tap "Generate Recipe" to create an AI-powered recipe
8. **Cook and enjoy** - Follow the step-by-step instructions

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
- Detection accuracy depends on image quality and lighting conditions
- Google Vision API requires internet connection for ingredient detection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Vision API** for advanced image analysis and ingredient detection
- **Google Gemini AI** for powerful recipe generation
- **shadcn/ui** for beautiful React components
- **React Router** team for the modern routing solution

---

**Built with ❤️ by [dannycahyo](https://github.com/dannycahyo)**

_Turn your ingredients into inspiration with FridgeVision AI!_ ✨
