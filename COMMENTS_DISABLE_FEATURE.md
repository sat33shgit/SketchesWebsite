# Comments and Messages Disable Feature

## Overview
This feature allows you to enable or disable comment posting and contact form messages across the entire application using database configuration flags. When disabled, users will see the form fields but they will be disabled, and a message will be displayed indicating that the functionality is currently disabled.

## Database Schema
A `configurations` table has been created with the following structure:
- **key** (VARCHAR(255), PRIMARY KEY): The configuration key name
- **value** (TEXT): The configuration value
- **date_created** (TIMESTAMP): When the configuration was created
- **date_updated** (TIMESTAMP): When the configuration was last updated (auto-updated via trigger)

## Default Configuration
By default, both comments and messages are **enabled**:
- Key: `comments_disable`, Value: `N`
- Key: `message_disable`, Value: `N`

## How to Disable/Enable Comments

### Method 1: Using the Update Script (Recommended)

**To disable comments:**
```bash
node scripts/update-comments-config.js Y
```

**To enable comments:**
```bash
node scripts/update-comments-config.js N
```

## How to Disable/Enable Contact Messages

### Method 1: Using the Update Script (Recommended)

**To disable contact messages:**
```bash
node scripts/update-message-config.js Y
```

**To enable contact messages:**
```bash
node scripts/update-message-config.js N
```

### Method 2: Direct Database Query

You can also update the configuration directly in your database:

**To disable comments:**
```sql
UPDATE configurations 
SET value = 'Y', date_updated = NOW() 
WHERE key = 'comments_disable';
```

**To enable comments:**
```sql
UPDATE configurations 
SET value = 'N', date_updated = NOW() 
WHERE key = 'comments_disable';
```

**To disable contact messages:**
```sql
UPDATE configurations 
SET value = 'Y', date_updated = NOW() 
WHERE key = 'message_disable';
```

**To enable contact messages:**
```sql
UPDATE configurations 
SET value = 'N', date_updated = NOW() 
WHERE key = 'message_disable';
```

## How It Works

### Comments Feature

1. **API Endpoint**: A new API endpoint `/api/config` has been created to fetch configuration values.
   - GET `/api/config?key=comments_disable` - Fetches a specific configuration
   - GET `/api/config` - Fetches all configurations

2. **Frontend Integration**: The `CommentsSection` component:
   - Fetches the `comments_disable` configuration on mount
   - If the value is `Y`, the comment form inputs and button are disabled
   - A message "Posting the comments are disabled currently" is displayed next to the button
   - If the value is `N` or the key doesn't exist, comments work normally

3. **Fail-Safe**: If the API call fails, comments default to **enabled** to ensure functionality is not blocked by configuration errors.

### Contact Messages Feature

1. **API Endpoint**: Uses the same `/api/config` endpoint to fetch configuration values.
   - GET `/api/config?key=message_disable` - Fetches the message configuration

2. **Frontend Integration**: The `Contact` page:
   - Fetches the `message_disable` configuration on mount
   - If the value is `Y`, all form fields (Name, Email, Subject, Message) and the Submit button are disabled
   - A message "Message posting is currently disabled" is displayed below the button
   - If the value is `N` or the key doesn't exist, the contact form works normally

3. **Fail-Safe**: If the API call fails, messages default to **enabled** to ensure functionality is not blocked by configuration errors.

## UI Behavior When Disabled

### When Comments are Disabled:
- ✅ The "Your name" input field is disabled
- ✅ The "Share your thoughts..." textarea is disabled
- ✅ The "Post Comment" button is disabled
- ✅ A gray italic message appears: "Comment posting is currently disabled"
- ✅ Users can still view existing comments

### When Contact Messages are Disabled:
- ✅ The "Name" input field is disabled
- ✅ The "Email" input field is disabled
- ✅ The "Subject" input field is disabled
- ✅ The "Message" textarea is disabled
- ✅ The "Send Message" button is disabled
- ✅ A gray italic message appears: "Message posting is currently disabled"

## Files Modified

### New Files Created:
- `database/configurations_schema.sql` - Database schema
- `api/config/index.js` - API endpoint to fetch configurations
- `scripts/setup-configurations.js` - Script to create the configurations table
- `scripts/update-comments-config.js` - Script to easily update the comments config
- `scripts/update-message-config.js` - Script to easily update the messages config
- `scripts/add-message-disable-config.js` - Script to add message_disable configuration
- `scripts/check-configs.js` - Script to view all configurations

### Modified Files:
- `src/components/CommentsSection.jsx` - Added config fetch and conditional disable logic
- `src/pages/Contact.jsx` - Added config fetch and conditional disable logic for contact form
- `src/locales/en/sketch.json` - Added commentsDisabled translation
- `src/locales/en/contact.json` - Added messageDisabled translation
- `src/index.css` - Added styling for the disabled messages

## Testing

### Test Comments Feature

1. **Test with comments enabled** (default):
   - Visit any sketch detail page
   - The comment form should be fully functional
   - You should be able to type in the name and comment fields
   - You should be able to submit comments

2. **Test with comments disabled**:
   ```bash
   node scripts/update-comments-config.js Y
   ```
   - Refresh the sketch detail page
   - The comment form fields should be grayed out and disabled
   - The message "Posting the comments are disabled currently" should appear
   - Existing comments should still be visible

3. **Test re-enabling**:
   ```bash
   node scripts/update-comments-config.js N
   ```
   - Refresh the page
   - The form should be functional again
   - The disabled message should disappear

### Test Contact Messages Feature

1. **Test with messages enabled** (default):
   - Visit the Contact page
   - The contact form should be fully functional
   - You should be able to type in all fields
   - You should be able to submit messages

2. **Test with messages disabled**:
   ```bash
   node scripts/update-message-config.js Y
   ```
   - Refresh the Contact page
   - All form fields should be grayed out and disabled
   - The message "Message posting is currently disabled" should appear below the button

3. **Test re-enabling**:
   ```bash
   node scripts/update-message-config.js N
   ```
   - Refresh the page
   - The form should be functional again
   - The disabled message should disappear

## Deployment Notes

After deploying to Vercel:
1. The configurations table is already created in your database with both default configurations
2. The API endpoint will work automatically
3. Use the update scripts or direct SQL queries to manage the configurations

## Future Enhancements

Potential improvements for this feature:
- Admin UI to toggle comments/messages on/off without running scripts
- Schedule comments/messages to be disabled/enabled at specific times
- Disable comments per sketch instead of globally
- Disable messages with a custom message explaining why
- Add more configuration options (e.g., maximum lengths, require approval, etc.)
