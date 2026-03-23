#!/bin/bash
# Start a local server for the Family Budget PWA
# PWA requires HTTPS or localhost to work properly

echo "🏦 תקציב משפחתי - שרת מקומי"
echo "================================"
echo ""
echo "📱 לגישה מהטלפון:"
echo "   1. ודא שהטלפון והמחשב על אותה רשת WiFi"
echo "   2. פתח בדפדפן: http://$(ipconfig getifaddr en0 2>/dev/null || echo 'YOUR_IP'):8080"
echo "   3. בכרום: לחץ על 'הוסף למסך הבית'"
echo "   4. בספארי: לחץ שיתוף ← 'הוסף למסך הבית'"
echo ""
echo "💻 לגישה מהמחשב:"
echo "   פתח בדפדפן: http://localhost:8080"
echo ""
echo "⏹️  לעצירה: Ctrl+C"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8080
