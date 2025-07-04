# Phone Authentication Setup Guide

This guide explains how to set up and use the phone authentication feature with ClickSend SMS provider.

## 🚀 Features Implemented

### ✅ Dual Authentication Methods
- **Email Magic Link**: Original Supabase email authentication
- **Phone OTP**: Custom SMS verification using ClickSend API

### ✅ Rate Limiting & Security
- **5 attempts limit** per phone number
- **10-minute expiration** for OTP codes
- **Automatic cleanup** of expired records
- **Input validation** for phone numbers and OTP codes

### ✅ Enhanced UI/UX
- **Tabbed interface** for method selection
- **Real-time validation** and error handling
- **Responsive design** for mobile devices
- **Animated transitions** and feedback

## 📱 How Phone Authentication Works

### 1. **User Flow**
1. User selects "Phone" tab on sign-in page
2. Enters phone number with country code (e.g., `+1234567890`)
3. Clicks "Send Verification Code"
4. Receives 6-digit OTP via SMS
5. Enters OTP code to complete authentication
6. Gets logged in successfully

### 2. **Rate Limiting**
- Each phone number can request **maximum 5 OTP codes**
- Rate limit resets after **10 minutes** from last attempt
- Remaining attempts shown to user in real-time
- Clear error messages when limit reached

### 3. **Security Features**
- OTP codes are **6 digits** and securely generated
- Codes expire after **10 minutes**
- Phone number format validation
- Automatic cleanup of expired records

## 🛠️ Technical Implementation

### ClickSend Configuration
The SMS service uses your ClickSend credentials:
- **API URL**: `https://rest.clicksend.com/v3/sms/send`
- **Username**: `andrzej.butrym75@gmail.com`
- **API Key**: `A16AED08-E89D-2E73-34DF-D6C170D95BAA`

### Components
- **`SmsService`**: Handles ClickSend API integration and OTP management
- **`SignInComponent`**: Updated with dual authentication UI
- **Rate limiting**: In-memory storage (consider database for production)

### API Integration
```typescript
// Send OTP
const result = await smsService.sendOTP('+1234567890');

// Verify OTP
const verification = smsService.verifyOTP('+1234567890', '123456');
```

## 🔧 Setup Instructions

### 1. **Database Setup**
First, apply the simplified profiles migration:

```sql
-- Apply this in Supabase SQL Editor
-- Copy content from: migrations/004_create_profiles_table_simple.sql
```

### 2. **Test Phone Authentication**

1. **Navigate to Sign-In Page**
   - Go to `/sign-in` route
   - Click on "📱 Phone" tab

2. **Enter Phone Number**
   - Use international format: `+[country code][number]`
   - Examples: `+1234567890`, `+447123456789`

3. **Receive & Enter OTP**
   - Check your phone for SMS
   - Enter the 6-digit code
   - Click "Verify Code"

## 📋 Testing Scenarios

### ✅ Valid Test Cases
```
✓ +1234567890 (US format)
✓ +447123456789 (UK format)  
✓ +33123456789 (France format)
✓ Valid 6-digit OTP codes
```

### ❌ Invalid Test Cases
```
✗ 1234567890 (missing country code)
✗ +1-234-567-890 (with dashes)
✗ +123 (too short)
✗ Invalid OTP codes
✗ Expired OTP codes
```

### 🔒 Rate Limit Testing
1. Send OTP 5 times to same number
2. Verify rate limit message appears
3. Wait 10 minutes for reset
4. Confirm attempts reset

## 🛠️ Troubleshooting

### Common Issues

#### 1. **"Database error saving new user"**
**Solution**: Apply the simplified profiles migration:
```sql
-- Run in Supabase SQL Editor:
-- migrations/004_create_profiles_table_simple.sql
```

#### 2. **SMS Not Received**
**Possible causes**:
- ClickSend account balance
- Invalid phone number format
- Network/carrier issues

**Debug steps**:
```typescript
// Check ClickSend response in browser console
// Look for API errors or rate limiting
```

#### 3. **Rate Limit Issues**
**Reset attempts for testing**:
```typescript
// In browser console:
smsService.resetAttempts('+1234567890');
```

#### 4. **OTP Verification Failed**
**Check**:
- Code entered correctly (6 digits)
- Code not expired (10 minutes)
- Phone number matches exactly

### Debug Information

#### Browser Console Commands
```javascript
// Check remaining attempts
smsService.getRemainingAttempts('+1234567890');

// Reset attempts (testing only)
smsService.resetAttempts('+1234567890');

// Check time until reset
smsService.getTimeUntilReset('+1234567890');
```

#### Network Tab
- Monitor ClickSend API calls
- Check for 200 response codes
- Verify request payload format

## 🔮 Future Enhancements

### Recommended Improvements
1. **Database Storage**: Move OTP records from memory to database
2. **SMS Templates**: Customize SMS message content
3. **Multiple Providers**: Add backup SMS providers
4. **User Session**: Integrate with Supabase user sessions
5. **Analytics**: Track authentication success rates

### Integration with Supabase Auth
```typescript
// Future implementation idea:
// Create custom Supabase auth hook for phone verification
await supabase.auth.signInWithCustomToken(phoneVerificationToken);
```

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [ClickSend API Documentation](https://developers.clicksend.com/)
- [International Phone Number Formats](https://en.wikipedia.org/wiki/E.164)

## 🎯 Production Checklist

- [ ] Move OTP storage to database
- [ ] Set up SMS provider redundancy
- [ ] Configure proper rate limiting per user
- [ ] Add SMS cost monitoring
- [ ] Implement phone number verification
- [ ] Set up logging and analytics
- [ ] Test with various phone carriers
- [ ] Comply with SMS regulations by country

---

**🎉 The phone authentication system is now ready for testing!**

Try signing in with your phone number to see the complete flow in action. 