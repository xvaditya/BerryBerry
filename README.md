# 🍓 BerryBerry - AI-Powered English Learning Web App

A modern, minimalist web application designed to help users improve their English through AI-powered features.

## ✨ Features

### 📖 Dictionary
- Search any English word
- Get meanings, phonetics, and example sentences
- Play pronunciation audio
- Powered by [Free Dictionary API](https://dictionaryapi.dev/)

### 🎤 Pronunciation Checker
- Speak into your microphone
- Real-time speech recognition
- Compare your pronunciation with the correct word
- Get instant feedback with confidence scores
- Uses browser's native Web Speech API

### 🧠 AI Sentence Corrector
- Input sentences for grammar checking
- AI-powered corrections using Claude
- Simple explanations for corrections
- Helps improve your writing skills

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Speech**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Dictionary**: Free Dictionary API

## 🎨 Design Features

- Black + Blue gradient theme
- Glassmorphism UI cards
- Smooth animations
- Mobile-first responsive design
- Soft glowing effects
- Clean, minimalist interface

## 📂 Project Structure

```
berryberry/
├── src/
│   ├── components/
│   │   ├── Dictionary/
│   │   │   └── Dictionary.tsx
│   │   ├── PronunciationChecker/
│   │   │   └── PronunciationChecker.tsx
│   │   └── SentenceCorrector/
│   │       └── SentenceCorrector.tsx
│   ├── hooks/
│   │   └── useSpeechRecognition.ts
│   ├── utils/
│   │   ├── dictionaryApi.ts
│   │   ├── speechRecognition.ts
│   │   └── aiCorrection.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── speech.d.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ installed
- Modern browser (Chrome recommended for best speech recognition support)

### Steps

1. **Navigate to the project**:
```bash
cd berryberry
```

2. **Install dependencies** (if not already installed):
```bash
npm install
```

3. **Run development server**:
```bash
npm run dev
```

4. **Open in browser**:
Navigate to `http://localhost:5173`

## 🎯 Usage Guide

### Dictionary Feature
1. Click on the "Dictionary" tab
2. Type any English word in the search box
3. Click "Search" or press Enter
4. View meanings, phonetics, and examples
5. Click the play button (🔊) to hear pronunciation

### Pronunciation Checker
1. Click on the "Pronunciation" tab
2. Enter a word you want to practice
3. Click "Start Speaking" and speak the word clearly
4. See your pronunciation vs. correct pronunciation
5. Get instant feedback on accuracy

### AI Sentence Corrector
1. Click on the "AI Corrector" tab
2. Type or paste your sentence
3. Click "Check Grammar"
4. See the corrected version with explanations
5. Learn from the AI's suggestions

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Dictionary | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition | ✅ | ❌ | ✅ | ✅ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |
| AI Correction | ✅ | ✅ | ✅ | ✅ |

**Note**: Speech recognition works best in Chrome and Edge due to full Web Speech API support.

## 🔧 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 🚀 Deployment

Deploy the `dist/` folder to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ React Hooks (useState, useCallback, custom hooks)
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for modern styling
- ✅ API integration (REST APIs)
- ✅ Browser APIs (Web Speech)
- ✅ AI integration (Claude API)
- ✅ Component-based architecture
- ✅ Responsive design patterns

## 📝 Future Enhancements

- [ ] Save favorite words (localStorage)
- [ ] Daily practice streaks
- [ ] Progress tracking dashboard
- [ ] PWA support (offline access)
- [ ] More AI features (vocabulary builder, quiz mode)
- [ ] Multi-language support

## 🤝 Contributing

Feel free to fork this project and make improvements!

## 📄 License

MIT License - Feel free to use this project for learning and personal use.

## 👨‍💻 Created By

**Adi** - Computer Engineering Student @ Dr. D.Y. Patil Technical Campus, Pune

Made with 💙 and lots of ☕

---

### 💡 Tips for Best Experience

1. **Microphone Access**: Allow microphone permissions for pronunciation checker
2. **Quiet Environment**: Use in a quiet space for better speech recognition
3. **Clear Speech**: Speak clearly and at normal pace
4. **Chrome Browser**: For best results, use Google Chrome
5. **Mobile**: Fully responsive - works great on phones!

---

**Start improving your English today with BerryBerry! 🍓**
