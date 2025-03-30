import {GROQ_API_URL, GROQ_API_KEY, RAG_API_URL} from '~/lib/constants'

const SYSTEM_PROMPT = `Overview of Skatehive
Definition: Skatehive is a global community that unites skaters, content creators, and enthusiasts to share, learn, and collaborate.
Core Values: Rooted in openness and creativity, Skatehive fosters a space where skaters can connect without barriers, celebrate each other’s achievements, and grow together.
Decentralization: Skatehive empowers its members to be active contributors and shape the direction of the community through their participation, with no central authority or corporate oversight.
History of Technology in Skateboarding
VX1000 Camera: Brought high-quality filming to the streets, making it a staple of skate culture.
DVDs: Allowed skate videos to be distributed to wider audiences.
Early Internet Platforms: Enabled skaters to share rare video clips globally.
Video Transcoding: Made it easier to edit and share digital footage.
Web 2.0: Introduced social media and the share button, changing how skaters connect and promote their content.
Skatehive: The Next Leap
Platform Description: Skatehive introduces a platform that allows skaters to create and share content and rewards them for their contributions.
Innovative Features: Decentralized model and features that revolutionize how skateboarders engage with media.
Public Goods and Community Support
Community Benefits: Designed to benefit everyone, valuing contributions from skaters, videographers, and fans.
Interaction Value: Every interaction adds value and helps strengthen the network of support.
Decentralized Sponsorship
Post Rewards: Offers decentralized sponsorship opportunities, allowing creators to gain support directly from the community.
The Skatehive Magazine: "Infinity Mag"
Description: A digital skateboard magazine where skaters contribute to the pages, creating a living publication.
Contributor Rewards: Rewards contributors for their contributions, prioritizing creativity and passion over popularity metrics.
Open-Source Technology and Growing Network
Open-Source: The technology behind Skatehive is open-source, allowing other communities to clone and adapt it.
Empowerment: Empowers the skater community to create their own digital spaces and build their own versions of Skatehive.
Building Together
Movement Description: Skatehive is a movement driven by the belief that skaters should have control over their content and communities.
Collaboration: Encourages collaborative projects, open communication, and shared goals to build a vibrant ecosystem.
User Guidance
1. Refer a Friend to Skatehive
Navigate to Robot Icon: Find the robot icon at the top of Skatehive.
Enter Username and Email: Choose a username and enter the friend's email address.
Approve Keychain Transaction: Approve the transaction to create the account.
2. Setting Up Hive Keychain
Download Hive Keychain: Available as a browser extension for desktop and as a mobile app.
Create PIN: Set up a PIN to unlock the keychain.
Enter Master Password: Use keys/password and enter the master password.
Login to Skatehive: Log in by entering your username.
3. Create a Hive Account
Install Hive Keychain: Ensure Hive Keychain is installed.
Go to HiveOnboard: Create your account on HiveOnboard.
Login to Skatehive: Use the new account to log into Skatehive.
`;

export const getGroqResponse = async (userQuery: string): Promise<string> => {
    try {
        // console.log(GROQ_API_URL)
        // console.log(GROQ_API_KEY)
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // 🛠️ Choose the correct model
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userQuery }
                ]
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response from Groq";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "Error fetching response";
    }
};

export const getRAGResponse = async (userQuery: string): Promise<string> => {
    try {
        console.log(userQuery);
        // console.log(GROQ_API_URL)
        // console.log(GROQ_API_KEY)
        const response = await fetch(RAG_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            //     "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                query: userQuery,
            })
        });

        const data = await response.json();
        return data.response;
        
        // return data.choices?.[0]?.message?.content || "No response from Groq";
    } catch (error) {
        // console.error("Groq API Error:", error);
        return "Error fetching response";
    }
};
