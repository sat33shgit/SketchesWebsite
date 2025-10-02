# Comments Disable Feature

## Overview
This feature allows you to enable or disable comment posting across the entire application using a database configuration flag. When disabled, users will see the comment form fields but they will be disabled, and a message will be displayed indicating that comments are currently disabled.

## Database Schema
A new `configurations` table has been created with the following structure:
- **key** (VARCHAR(255), PRIMARY KEY): The configuration key name
- **value** (TEXT): The configuration value
- **date_created** (TIMESTAMP): When the configuration was created
- **date_updated** (TIMESTAMP): When the configuration was last updated (auto-updated via trigger)

## Default Configuration
By default, comments are **enabled**:
- Key: `comments_disable`
- Value: `N`

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

## How It Works

1. **API Endpoint**: A new API endpoint `/api/config` has been created to fetch configuration values.
   - GET `/api/config?key=comments_disable` - Fetches a specific configuration
   - GET `/api/config` - Fetches all configurations

2. **Frontend Integration**: The `CommentsSection` component:
   - Fetches the `comments_disable` configuration on mount
   - If the value is `Y`, the comment form inputs and button are disabled
   - A message "Posting the comments are disabled currently" is displayed next to the button
   - If the value is `N` or the key doesn't exist, comments work normally

3. **Fail-Safe**: If the API call fails, comments default to **enabled** to ensure functionality is not blocked by configuration errors.

## UI Behavior When Disabled

When comments are disabled:
- ✅ The "Your name" input field is disabled
- ✅ The "Share your thoughts..." textarea is disabled
- ✅ The "Post Comment" button is disabled
- ✅ A gray italic message appears: "Comment posting is currently disabled"
- ✅ Users can still view existing comments

## Files Modified

### New Files Created:
- `database/configurations_schema.sql` - Database schema
- `api/config/index.js` - API endpoint to fetch configurations
- `scripts/setup-configurations.js` - Script to create the configurations table
- `scripts/update-comments-config.js` - Script to easily update the config

### Modified Files:
- `src/components/CommentsSection.jsx` - Added config fetch and conditional disable logic
- `src/index.css` - Added styling for the disabled message

## Testing

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

## Deployment Notes

After deploying to Vercel:
1. The configurations table is already created in your database
2. The API endpoint will work automatically
3. Use the update script or direct SQL queries to manage the configuration

## Future Enhancements

Potential improvements for this feature:
- Admin UI to toggle comments on/off without running scripts
- Schedule comments to be disabled/enabled at specific times
- Disable comments per sketch instead of globally
- Add more configuration options (e.g., maximum comment length, require approval, etc.)
