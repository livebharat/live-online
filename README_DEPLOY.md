
# Sarkari Portal AI - Netlify Deployment Guide

अपनी वेबसाइट को Netlify पर चलाने के लिए इन स्टेप्स को फॉलो करें:

1. **GitHub पर अपलोड करें:** अपनी सभी फाइलों को एक GitHub Repository में डालें।
2. **Netlify से जोड़ें:** Netlify में 'Import from GitHub' करें।
3. **Environment Variable:** 
   - Netlify Dashboard में `Site Settings` > `Environment variables` पर जाएं।
   - `API_KEY` नाम से एक वेरिएबल बनाएं और अपनी Gemini API Key वहां डालें।
4. **Build Settings:** 
   - Build Command: (इसे खाली छोड़ दें)
   - Publish directory: `.` (डॉट)
5. **Success:** आपकी साइट `https://your-site-name.netlify.app` पर लाइव हो जाएगी।

**Admin Panel Login:**
- URL: `your-site-name.netlify.app` पर जाएं।
- 'Admin Panel' बटन दबाएं।
- पासवर्ड: `admin123`
