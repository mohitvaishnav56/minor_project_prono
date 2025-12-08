/* Note: This is a function that returns the HTML string, 
   ready to be plugged into the 'html' field of your Nodemailer options.
*/
const messageStructure = (challengeTitle, challengeDescription, challengeDate, challengeLink) => {
    
    // Define the colors from your UI image:
    const primaryGreen = '#4CAF50'; // For the 'SPEAK • INSPIRE • TRANSFORM' bar
    const darkBackground = '#1c1c1c'; // Main app background
    const cardBackground = '#2c2c2c'; // Card background
    const accentColor = '#FFC107'; // Yellow/Gold for accents (like 'itna time left')
    const lightText = '#FFFFFF';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Challenge on Prono</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${darkBackground};">

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: ${cardBackground}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                        
                        <tr>
                            <td align="left" style="padding: 20px 25px; border-bottom: 1px solid #333;">
                                <span style="font-size: 24px; font-weight: bold; color: ${lightText};">Prono</span>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 30px 25px;">
                                <p style="font-size: 16px; font-weight: 500; color: ${accentColor}; margin-bottom: 5px;">
                                    ☀️ AI Hosted Challenge
                                </p>
                                <h1 style="font-size: 28px; color: ${lightText}; margin: 0 0 10px 0;">
                                    ${challengeTitle} 
                                </h1>
                                <p style="font-size: 14px; color: #aaa; margin: 0 0 15px 0;">
                                    ${challengeDescription}
                                </p>
                                <p style="font-size: 14px; color: #888; margin: 0 0 25px 0;">
                                    📅 ${challengeDate}
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="right" style="padding: 0;">
                                            <a href="${challengeLink}" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 14px; font-weight: bold; color: ${lightText}; background-color: ${primaryGreen}; border-radius: 4px; text-decoration: none;">
                                                Accept Challenge →
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 15px 0; background-color: ${primaryGreen}; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                <span style="font-size: 16px; font-weight: bold; color: ${lightText}; letter-spacing: 1px;">
                                    SPEAK • INSPIRE • TRANSFORM
                                </span>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};

export default messageStructure;