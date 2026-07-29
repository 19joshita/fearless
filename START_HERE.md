# 🚀 START HERE - Media Capture Test

## ⚡ Quick Start (2 Minutes)

### Step 1: Run the App
```bash
cd /Users/joshita/Desktop/FearlessCode
npm run ios    # For iOS
# OR
npm run android    # For Android
```

### Step 2: Open Support Chat
1. Tap "Profile" tab at bottom
2. Tap "Support" or "Help"
3. Open a chat conversation

### Step 3: Test Camera
1. Tap the camera icon (📷) in chat input
2. You should see a menu with:
   - Take Photo
   - Record Video
   - Choose from Gallery
   - Cancel

### Step 4: Quick Test All Options

**Test 1: Take Photo (30 sec)**
- Select "Take Photo"
- Camera opens? ✅
- Take a photo
- Photo preview appears? ✅
- Tap send ➡️
- Message sent? ✅

**Test 2: Record Video (30 sec)**
- Select "Record Video"  
- Camera opens in video mode? ✅
- Record 10 seconds
- Video preview appears? ✅
- Tap send ➡️
- Message sent? ✅

**Test 3: Gallery Image (30 sec)**
- Select "Choose from Gallery"
- Gallery opens? ✅
- Pick an image
- Preview appears? ✅
- Tap send ➡️
- Message sent? ✅

**Test 4: Gallery Video - LONG (1 min) - IMPORTANT!**
- Select "Choose from Gallery"
- Pick a LONG video (>1 minute, ideally >2 minutes)
- Video preview appears? ✅
- Duration shows correctly? ✅
- Tap send ➡️
- **Wait for upload (may take 15-30 seconds for large files)**
- Message sent? ✅

---

## ✅ Success Criteria

### Everything Working If:
- ✅ Camera icon shows menu
- ✅ All 4 menu options work
- ✅ Camera opens for photo
- ✅ Camera opens for video
- ✅ Gallery opens
- ✅ Previews show correctly
- ✅ SHORT videos upload and send
- ✅ **LONG videos upload and send** ← KEY!
- ✅ No crashes
- ✅ No errors in console

---

## 🐛 If Something Fails

### Camera Won't Open?
→ Check device Settings → App → Permissions → Enable Camera

### Upload Fails?
→ Check network connection
→ Look at console for error message

### Video Shows 0:00 Duration?
→ Should show actual duration (e.g., "2:15")
→ Check console logs

---

## 📊 Watch Console

### Open React Native Debugger and Watch For:
```
✅ "Camera Photo Response:"
✅ "Camera Video Response:"
✅ "Gallery Response:"
✅ "Processing selected media:"
✅ "Starting upload:"
✅ "Upload successful:"
```

### If You See Errors:
```
❌ "Camera permission denied" → Enable in Settings
❌ "Upload failed:" → Check network
❌ "No URI provided" → Try again
```

---

## 🎯 Main Goal

**Test LONG video from iOS gallery**
This was the main issue - make sure a video over 1 minute:
1. Selects from gallery ✅
2. Shows preview ✅
3. Shows duration ✅
4. Uploads successfully ✅
5. Sends to chat ✅

---

## 📚 More Help?

- **Quick Test:** Read `TEST_MEDIA_CAPTURE.md`
- **Troubleshooting:** Read `TROUBLESHOOTING_GUIDE.md`
- **All Changes:** Read `FIXES_APPLIED.md`
- **Overview:** Read `README_MEDIA_CAPTURE.md`

---

## 🎉 That's All!

**Total test time: ~3 minutes**

If all 4 tests pass (especially long video), you're done! ✅

If anything fails, check the guides above or share:
- Console logs
- Error message
- Which specific test failed
- iOS or Android

**Good luck! 🚀**
