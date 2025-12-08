// Example: src/services/user.service.js
import {User} from '../models/user.model.js'; // Assuming this model is defined

/**
 * Fetches the IDs and email addresses of all users opted-in for email notifications.
 * @returns {Array<Object>} An array of user objects: [{_id: '...', email: '...', username: '...'}]
 */
const fetchUsersToNotify = async () => {
    try {
        // Query MongoDB to find only users where emailNotification is true (opted-in).
        const users = await User.find({ 
            emailNotification: true 
        }).select('email username').lean(); // Selects only the necessary fields for email sending
        const emails = users.map((user)=>user.email); 
        return emails;
        
    } catch (error) {
        console.error("Database Error: Failed to fetch opted-in user emails:", error);
        return [];
    }
};

export { fetchUsersToNotify };